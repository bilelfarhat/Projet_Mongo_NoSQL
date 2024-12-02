import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSubscriber = () => {
  const [subscriber, setSubscriber] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubscriber({ ...subscriber, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriber),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setSubscriber({ name: '', email: '' });
        navigate('/subscribers');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Une erreur s\'est produite.');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Ajouter un Abonné</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nom et Prénom :</label>
          <input
            type="text"
            name="name"
            value={subscriber.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email :</label>
          <input
            type="email"
            name="email"
            value={subscriber.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>Ajouter</button>
      </form>
      {message && <p style={styles.successMessage}>{message}</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}
    </div>
  );
};

// Styles modernisés
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontSize: '16px',
    color: '#555',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s',
  },
  submitButtonHover: {
    backgroundColor: '#45a049',
  },
  successMessage: {
    color: 'green',
    fontSize: '16px',
    marginTop: '10px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '16px',
    marginTop: '10px',
  },
};

export default AddSubscriber;
