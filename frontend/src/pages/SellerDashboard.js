import AddProductForm from './ProductForm';
import React, { useState, useEffect } from 'react';
import GeneralReviewModal from "./GeneralReviewModal";
import ProfileModal from './ProfileModal';
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// Place this outside the component so it's not recreated on every render
const socket = io('http://localhost:5002', { withCredentials: true });

// Simple Seller ChatModal component
function SellerChatModal({ seller, buyers, selectedBuyer, onSelectBuyer, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("Selected buyer object:", selectedBuyer);
    if (!selectedBuyer) return;
    const room = `buyer_${selectedBuyer.name}_seller_${seller.name}`;
    console.log("Seller joining room:", room);
    socket.emit("join_room", room);
    socket.on("chat_history", (msgs) => {
      console.log("Received chat history:", msgs);
      setMessages(msgs);
    });
    socket.on("receive_message", (msg) => setMessages((prev) => [...prev, msg]));
    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
    };
  }, [selectedBuyer, seller]);

  const sendMessage = () => {
    if (!selectedBuyer) return;
    const room = `buyer_${selectedBuyer.name}_seller_${seller.name}`;
    if (message.trim()) {
      socket.emit("send_message", {
        room,
        user: seller.name,
        text: message,
      });
      setMessage("");
    }
  };

  // Debug: log messages state
  console.log("Seller chat messages:", messages);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 350, maxWidth: 500 }}>
        <h2>Chat with Buyers</h2>
        <div style={{ marginBottom: 12 }}>
          <b>Select Buyer:</b>
          <select value={selectedBuyer?.id || ''} onChange={e => {
            const buyer = buyers.find(b => String(b.id) === e.target.value);
            console.log("Dropdown selected buyer:", buyer);
            onSelectBuyer(buyer);
          }} style={{ marginLeft: 8 }}>
            <option value=''>-- Select --</option>
            {buyers.map(buyer => (
              <option key={buyer.id} value={buyer.id}>{buyer.name}</option>
            ))}
          </select>
        </div>
        {selectedBuyer && (
          <>
            <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10, border: '1px solid #ccc', padding: 8 }}>
              {messages.map((msg, idx) => (
                <div key={idx}><b>{msg.user}:</b> {msg.text}</div>
              ))}
            </div>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              style={{ width: '80%' }}
            />
            <button onClick={sendMessage}>Send</button>
          </>
        )}
        <button onClick={onClose} style={{ marginLeft: 8, marginTop: 8 }}>Close</button>
      </div>
    </div>
  );
}

const SellerDashboard = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showGeneralReview, setShowGeneralReview] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // Profile modal state
  const [showChatModal, setShowChatModal] = useState(false);
  const [buyers, setBuyers] = useState([]); // List of buyers who have messaged
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadSellerData();
    }
  }, [user]);

  // Fetch buyers who have messaged this seller
  useEffect(() => {
    if (!user) return;
    const fetchAllBuyers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5002/api/users?role=buyer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBuyers(data.users || []);
          console.log("All buyers for dropdown:", data.users || []);
        } else {
          setBuyers([]);
        }
      } catch (err) {
        setBuyers([]);
      }
    };
    fetchAllBuyers();
  }, [user]);

  const loadSellerData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Load products
      const productsResponse = await fetch(`http://localhost:5002/api/products?seller_id=${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.products || []);
      }

      // Load orders
      const ordersResponse = await fetch('http://localhost:5002/api/orders/my-sales', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }
    } catch (error) {
      console.error('Error loading seller data:', error);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddProduct = async (form) => {
    console.log('Adding product with form data:', form);
    
    const data = new FormData();
    data.append("name", form.name);
    data.append("category", form.category);
    data.append("price", parseFloat(form.price));
    data.append("description", form.description);
    data.append("stock_quantity", parseInt(form.stock_quantity));

    for (let i = 0; i < form.images.length; i++) {
      data.append("images", form.images[i]);
    }

    const token = localStorage.getItem("token");
    console.log('Token:', token ? 'Present' : 'Missing');

    try {
      const res = await fetch("http://localhost:5002/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);

      if (res.ok) {
        const result = await res.json();
        console.log('Success response:', result);
        alert("Product added successfully!");
        setShowAddProduct(false);
        loadSellerData(); // Refresh products
      } else {
        const error = await res.json();
        console.error('Error response:', error);
        alert("Error: " + (error.error || "Could not add product"));
      }
    } catch (error) {
      console.error('Network error:', error);
      alert("Network error: " + error.message);
    }
  };

  const handleGeneralReviewSubmit = async (reviewData) => {
    try {
      const res = await fetch('http://localhost:5002/api/community-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (res.ok) {
        alert('Thank you for your feedback!');
      } else {
        const error = await res.json();
        alert('Error: ' + (error.error || 'Could not submit review'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ backgroundColor: '#F7F1E1', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#D8572A' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CraftLink - Seller Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          {/* <Button color="inherit" onClick={() => setShowGeneralReview(true)}>
            Share Experience
          </Button> */}
          <Button color="inherit" onClick={() => setShowProfile(true)}>
            Profile
          </Button>
          <Button color="inherit" onClick={handleMenuOpen}>
            <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
              {user.name?.charAt(0)}
            </Avatar>
            {user.name}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Modal for Reviews */}
      {showGeneralReview && (
        <GeneralReviewModal
          onClose={() => setShowGeneralReview(false)}
          onSubmit={handleGeneralReviewSubmit}
        />
      )}

      <ProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        products={products}
        orders={orders}
      />

      {/* Add Product Form */}
      {showAddProduct && (
        <Box sx={{ my: 4 }}>
          <AddProductForm onSubmit={handleAddProduct} />
          <Button onClick={() => setShowAddProduct(false)} sx={{ mt: 2 }}>
            Cancel
          </Button>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, color: '#2C2C2C' }}>
          Welcome back, {user.name}!
        </Typography>

        {/* Action Buttons */}
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#D8572A', '&:hover': { backgroundColor: '#B6461F' } }}
              onClick={() => setShowAddProduct(true)}
            >
              Add New Product
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" sx={{ borderColor: '#D8572A', color: '#D8572A', display: 'flex', alignItems: 'center', gap: 1 }}
              onClick={() => setShowChatModal(true)}>
              <span role="img" aria-label="chat">💬</span> Chat with Buyers
            </Button>
          </Grid>
          {/* <Grid item>
            <Button variant="outlined" sx={{ borderColor: '#D8572A', color: '#D8572A' }}>
              Manage Products
            </Button>
          </Grid> */} 
        </Grid>
      </Container>
      {/* Seller Chat Modal */}
      {showChatModal && (
        <SellerChatModal
          seller={user}
          buyers={buyers}
          selectedBuyer={selectedBuyer}
          onSelectBuyer={setSelectedBuyer}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </Box>
  );
};

export default SellerDashboard;