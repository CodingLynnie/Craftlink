import React, { useEffect, useState } from "react";

function UserDetailModal({ open, user, onClose }) {
  if (!open || !user) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, maxWidth: 400 }}>
        <h2>User Details</h2>
        <div><b>Name:</b> {user.name}</div>
        <div><b>Email:</b> {user.email}</div>
        <div><b>Role:</b> {user.role}</div>
        <div><b>Status:</b> {user.status}</div>
        {user.role === 'seller' && <div><b>Rent:</b> {user.rent}</div>}
        <div><b>Joined:</b> {user.joined || '-'}</div>
        <div><b>Last Active:</b> {user.lastActive || '-'}</div>
        <button style={{ marginTop: 16, padding: '6px 18px', borderRadius: 8, background: '#e67e22', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusLoading, setStatusLoading] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [rentLoading, setRentLoading] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5002/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    setStatusLoading(prev => ({ ...prev, [user.id]: true }));
    try {
      const token = localStorage.getItem("token");
      const newStatus = user.status === "active" ? "inactive" : "active";
      const res = await fetch(`http://localhost:5002/api/users/${user.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setUsers(users => users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert("Error updating user status: " + err.message);
    } finally {
      setStatusLoading(prev => ({ ...prev, [user.id]: false }));
    }
  };

  const handleToggleRent = async (user) => {
    setRentLoading(prev => ({ ...prev, [user.id]: true }));
    try {
      const token = localStorage.getItem("token");
      const newRent = user.rent === "paid" ? "unpaid" : "paid";
      const res = await fetch(`http://localhost:5002/api/users/${user.id}/rent`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rent: newRent }),
      });
      if (!res.ok) throw new Error("Failed to update rent status");
      setUsers(users => users.map(u => u.id === user.id ? { ...u, rent: newRent } : u));
    } catch (err) {
      alert("Error updating rent status: " + err.message);
    } finally {
      setRentLoading(prev => ({ ...prev, [user.id]: false }));
    }
  };

  // Calculate summary
  const summary = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    paid: users.filter(u => u.rent === "paid").length,
    unpaid: users.filter(u => u.rent === "unpaid").length,
  };

  return (
    <div style={{ background: '#f8f3e9', minHeight: '100vh', padding: 32 }}>
      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        <SummaryCard label="Total Users" value={summary.total} icon="👥" color="#d35400" />
        <SummaryCard label="Active Users" value={summary.active} icon="🧑‍🤝‍🧑" color="#f1c40f" />
        <SummaryCard label="Paid Rent" value={summary.paid} icon="KSH" color="#27ae60" />
        <SummaryCard label="Unpaid Rent" value={summary.unpaid} icon="📈" color="#e74c3c" />
      </div>
      {/* Registered Users */}
      <div style={{ background: '#fff7e6', borderRadius: 12, padding: 24 }}>
        <h2>Registered Users</h2>
        <p style={{ color: '#555', marginBottom: 24 }}>Manage user accounts and rent status</p>
        {loading && <div>Loading users...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {!loading && !error && users.map((user, idx) => (
          <div key={user.id || idx} style={{ background: '#f8f3e9', borderRadius: 12, padding: 24, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ background: '#e74c3c', color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold' }}>
                {user.name ? user.name[0] : '?'}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 18 }}>{user.name}</div>
                <div style={{ color: '#555' }}>{user.email}</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <span style={{ background: user.role === 'seller' ? '#f1c40f' : '#e67e22', color: '#fff', borderRadius: 8, padding: '2px 8px', fontSize: 12 }}>{user.role}</span>
                  <span style={{ background: '#2ecc71', color: '#fff', borderRadius: 8, padding: '2px 8px', fontSize: 12 }}>{user.status}</span>
                  {user.rent && <span style={{ background: '#a3f7b5', color: '#222', borderRadius: 8, padding: '2px 8px', fontSize: 12 }}>Rent: {user.rent}</span>}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>Joined: {user.joined || '-'}</div>
              <div>Last active: {user.lastActive || '-'}</div>
              {user.role === 'seller' && (
                <div style={{ margin: '8px 0' }}>
                  Rent Status: <input type="checkbox" checked={user.rent === 'paid'} readOnly />
                  <button
                    style={{ marginLeft: 8, background: user.rent === 'paid' ? '#e74c3c' : '#27ae60', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 12px', cursor: 'pointer', opacity: rentLoading[user.id] ? 0.6 : 1 }}
                    onClick={() => handleToggleRent(user)}
                    disabled={rentLoading[user.id]}
                  >
                    {rentLoading[user.id] ? (user.rent === 'paid' ? 'Marking Unpaid...' : 'Marking Paid...') : (user.rent === 'paid' ? 'Mark Unpaid' : 'Mark Paid')}
                  </button>
                </div>
              )}
              <button
                style={{ background: 'none', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: 8, padding: '6px 12px', marginRight: 8, cursor: 'pointer', opacity: statusLoading[user.id] ? 0.6 : 1 }}
                onClick={() => handleToggleStatus(user)}
                disabled={statusLoading[user.id]}
              >
                {user.status === 'active' ? (statusLoading[user.id] ? 'Deactivating...' : 'Deactivate') : (statusLoading[user.id] ? 'Activating...' : 'Activate')}
              </button>
              <button
                style={{ background: 'none', border: '1px solid #e67e22', color: '#e67e22', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}
                onClick={() => { setSelectedUser(user); setShowUserModal(true); }}
              >View</button>
            </div>
          </div>
        ))}
      </div>
      {/* User Detail Modal */}
      <UserDetailModal open={showUserModal} user={selectedUser} onClose={() => setShowUserModal(false)} />
    </div>
  );
}

function SummaryCard({ label, value, icon, color }) {
  return (
    <div style={{ background: '#fff7e6', borderRadius: 12, padding: 24, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px #0001' }}>
      <div style={{ fontSize: 32, color, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 'bold' }}>{value}</div>
      <div style={{ color: '#555', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default AdminDashboard;