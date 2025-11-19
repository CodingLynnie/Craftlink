import React from 'react';
import './ProfileModal.css'; // Optional, for your custom styles
import { Box, Avatar, Typography, Button } from '@mui/material';

const ProfileModal = ({ open, onClose, user, products, orders }) => {
  if (!open) return null;

  return (
    <Box
      className="profile-modal-backdrop"
      sx={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1300
      }}
      onClick={onClose}
    >
      <Box
        className="profile-modal-content"
        sx={{
          background: '#fff',
          borderRadius: 2,
          p: 4,
          minWidth: 350,
          minHeight: 350,
          boxShadow: 3,
          maxWidth: 400
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Profile Header */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 64, height: 64, mb: 1 }}>
            {user.name?.charAt(0)}
          </Avatar>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Seller'}
          </Typography>
          {user.phone && (
            <Typography variant="body2" color="text.secondary">{user.phone}</Typography>
          )}
          {user.created_at && (
            <Typography variant="body2" color="text.secondary">
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </Typography>
          )}
        </Box>
        {/* Stats */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Stats</Typography>
          <Typography variant="body2">Products listed: {products.length}</Typography>
          <Typography variant="body2">
            Orders completed: {orders.filter(o => o.status === 'delivered').length}
          </Typography>
          <Typography variant="body2">Average rating: <i>Coming soon</i></Typography>
        </Box>
        <Button sx={{ mt: 2 }} onClick={onClose} fullWidth>Close</Button>
      </Box>
    </Box>
  );
};

export default ProfileModal;