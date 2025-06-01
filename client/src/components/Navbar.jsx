import React, { useState } from 'react';

function Navbar({ token, profileURL, onLoginClick, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const tempImageURL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJKivxYj4tNABt4gMj_Ui7BKVb30plCXwpG-SVyBkJvxHC0e8kRuFJ6kgDfbANJ_4XEtI&usqp=CAU'; // Placeholder image URL
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem',
        background: '#f0f0f0',
        position: 'relative'
      }}
    >
      <h2>MERN Boilerplate</h2>
      {token ? (
        <div style={{ position: 'relative' }}>
          <img
            src={profileURL || tempImageURL}
            alt="Profile"
            crossOrigin="anonymous"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              objectFit: 'cover'
            }}
            onClick={handleProfileClick}
          />
          {showDropdown && (
            <div style={dropdownStyles}>
              <button style={dropdownItemStyles} onClick={() => window.location.href = '/profile'}>
                Profile
              </button>
              <button style={dropdownItemStyles} onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={onLoginClick}>Login</button>
      )}
    </nav>
  );
}

const dropdownStyles = {
  position: 'absolute',
  top: '50px',
  right: 0,
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  zIndex: 1000,
};

const dropdownItemStyles = {
  display: 'block',
  width: '100%',
  padding: '0.5rem 1rem',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer'
};

export default Navbar;