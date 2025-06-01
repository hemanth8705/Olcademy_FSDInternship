import React, { useState } from 'react';

function LoginModal({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        onLoginSuccess && onLoginSuccess(data.token);
        // Force a full reload so the App state updates immediately.
        window.location.reload();
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
      console.error(err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Login</h2>
        <form onSubmit={handleEmailLogin}>
          <div style={styles.inputContainer}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          {message && <p style={styles.message}>{message}</p>}
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <div style={styles.divider}>or</div>
        <button type="button" style={styles.googleButton} onClick={handleGoogleLogin}>
          Continue with Google
        </button>
        <button style={styles.cancel} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    width: '300px'
  },
  inputContainer: {
    marginBottom: '1rem',
    textAlign: 'left'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#1a73e8',
    color: '#fff',
    cursor: 'pointer'
  },
  googleButton: {
    width: '100%',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#db4437',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  divider: {
    margin: '1rem 0',
    fontWeight: 'bold'
  },
  message: {
    color: 'red',
    marginBottom: '1rem'
  },
  cancel: {
    marginTop: '1rem',
    background: 'transparent',
    border: 'none',
    color: '#007BFF',
    cursor: 'pointer'
  }
};

export default LoginModal;