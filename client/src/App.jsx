import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import LoginModal from './components/LoginModal.jsx';

function App() {
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(null);
  const [profileURL, setProfileURL] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
      params.delete('token');
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, document.title, newUrl);
    } else {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
      }
    }

    // Fetch additional info (including profileURL) from /profile/me if token exists
    if (localStorage.getItem('token')) {
      fetch('http://localhost:5000/profile/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            console.log("profile data from /profile/me:", data);
            setProfileURL(data.profileURL);
          }
          else {
            console.error('Error fetching profile data from /profile/me::', data.error);
          }
        })
        .catch(err => console.error('Error fetching profile:', err));
    }

    fetch('http://localhost:5000')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('Error fetching message:', error));
  }, []);

  const handleLoginClick = () => {
    setModalVisible(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/';
  };

  return (
    <div className="App">
      <Navbar token={token} profileURL={profileURL} onLoginClick={handleLoginClick} onLogout={handleLogout} />
      {modalVisible && <LoginModal onClose={() => setModalVisible(false)} />}
      <h1>MERN Stack Boilerplate</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;