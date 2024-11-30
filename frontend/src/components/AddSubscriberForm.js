import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddSubscriberForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSubscriber = { name, email };

    // Vérifier si l'email de l'abonné existe déjà
    axios
      .get(`http://localhost:5000/subscribers/${email}`)
      .then((res) => {
        if (res.data.exists) {
          alert('Email existe déjà');
          setEmail('');
        } else {
          // Ajouter l'abonné si l'email n'existe pas
          axios
            .post('http://localhost:5000/subscribers', newSubscriber)
            .then((res) => {
              setName('');
              setEmail('');
              navigate('/subscribers'); // Redirection après l'ajout de l'abonné
            })
            .catch((error) => {
              console.error("Erreur lors de l'ajout de l'abonné", error);
            });
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la vérification de l'email de l'abonné", error);
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Ajouter un Abonné</h2>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
        <button type="submit" style={styles.submitButton}>Ajouter</button>
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
  errorText: {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
  },
};

export default AddSubscriberForm;