import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const UpdateSubscriberForm = () => {
  const { email } = useParams(); // Getting the subscriber email from the URL parameter
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');

  useEffect(() => {
    // Check if subscriber data is passed via location state
    if (location.state?.subscriber) {
      const { name, email } = location.state.subscriber;
      setName(name);
      setSubscriberEmail(email);
    } else {
      // Fetch subscriber details if not passed through state
      axios
        .get(`http://localhost:5000/subscribers/${email}`)
        .then((res) => {
          const subscriber = res.data;
          setName(subscriber.name);
          setSubscriberEmail(subscriber.email);
        })
        .catch((err) => console.error('Erreur lors de la récupération de l’abonné : ', err));
    }
  }, [email, location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedSubscriber = { name, email: subscriberEmail };

    axios
      .put(`http://localhost:5000/subscribers/${email}`, updatedSubscriber)
      .then((res) => {
        navigate('/subscribers'); // Redirection après la mise à jour de l'abonné
      })
      .catch((err) => console.error('Erreur lors de la mise à jour de l’abonné : ', err));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mettre à jour l'Abonné</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nom :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email :</label>
          <input
            type="email"
            value={subscriberEmail}
            onChange={(e) => setSubscriberEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>Mettre à jour</button>
      </form>
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
  inputFocus: {
    borderColor: '#2196F3',
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
};

export default UpdateSubscriberForm;