import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [email, setEmail] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    // Fetch up-to-date user details from the server
    fetch('http://localhost:5000/profile/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Profile data from server:', data);
        if (data.error) {
          console.error(data.error);
          navigate('/');
        } else {
          setEmail(data.email);
          setHasPassword(data.hasPassword); // Use updated info from DB
        }
      })
      .catch(err => console.error('Error fetching profile:', err));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/profile/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
    });
    const data = await response.json();
    if (response.ok) {
      setMessage(data.message);
      // Force a refresh of the profile info so hasPassword is updated
      window.location.reload();
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Profile</h2>
      <p>Email: {email}</p>
      <form onSubmit={handleSubmit}>
        {hasPassword ? (
          <div>
            <label>Old Password:</label>
            <input 
              type="password" 
              value={oldPassword} 
              onChange={e => setOldPassword(e.target.value)} 
              required 
            />
          </div>
        ) : (
          <p>You haven't set a password yet. Set up one now:</p>
        )}
        <div>
          <label>New Password:</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">{hasPassword ? 'Update Password' : 'Set Password'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;