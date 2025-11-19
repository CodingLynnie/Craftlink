import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer',
    location: '', // Add location to formData
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'buyer',
      location: '', // Reset location on tab change
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = tabValue === 0 ? '/api/auth/login' : '/api/auth/register';
      const payload = tabValue === 0 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`http://localhost:5002${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      switch (data.user.role) {
        case 'buyer':
          navigate('/buyer-dashboard');
          break;
        case 'seller':
          navigate('/seller-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/buyer-dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#2C2C2C', mb: 1 }}>
            Welcome to CraftLink
          </Typography>
          <Typography variant="body1" sx={{ color: '#5A5A5A' }}>
            Connect with Kenyan artisans and discover authentic crafts
          </Typography>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {tabValue === 1 && (
            <>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Role"
                >
                  <MenuItem value="buyer">Buyer</MenuItem>
                  <MenuItem value="seller">Artisan/Seller</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#D8572A',
              '&:hover': { backgroundColor: '#D8572A' },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              tabValue === 0 ? 'Login' : 'Register'
            )}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" sx={{ color: '#5A5A5A' }}>
            OR
          </Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#5A5A5A', mb: 2 }}>
            {tabValue === 0 ? "Don't have an account?" : "Already have an account?"}
          </Typography>
          <Button
            variant="text"
            onClick={() => setTabValue(tabValue === 0 ? 1 : 0)}
            sx={{ color: '#D8572A' }}
          >
            {tabValue === 0 ? 'Create Account' : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;