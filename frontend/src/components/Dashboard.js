import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [borrowers, setBorrowers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/books`)
      .then(res => setBooks(res.data))
      .catch(err => console.error('Erreur lors de la récupération des livres : ', err));

    axios.get(`http://localhost:5000/subscribers`)
      .then(res => setSubscribers(res.data))
      .catch(err => console.error('Erreur lors de la récupération des abonnés : ', err));

    axios.get(`http://localhost:5000/borrowers`)
      .then(res => setBorrowers(res.data))
      .catch(err => console.error('Erreur lors de la récupération des emprunts : ', err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Tableau de Bord</h2>
      <div style={styles.statsContainer}>
        <div style={styles.stat}>
          <h3>Livres</h3>
          <p>{books.length}</p>
          <Link to="/books" style={styles.link}>Voir les livres</Link>
        </div>
        <div style={styles.stat}>
          <h3>Abonnés</h3>
          <p>{subscribers.length}</p>
          <Link to="/subscribers" style={styles.link}>Voir les abonnés</Link>
        </div>
        <div style={styles.stat}>
          <h3>Emprunts</h3>
          <p>{borrowers.length}</p>
          <Link to="/borrower" style={styles.link}>Voir les emprunts</Link>
        </div>
      </div>
      <div style={styles.buttonsContainer}>
        <Link to="/add-book" style={styles.addButton}>Ajouter un livre</Link>
        <Link to="/add-subscriber" style={styles.addButton}>Ajouter un abonné</Link>
        <Link to="/add-borrower" style={styles.addButton}>Ajouter un emprunt</Link>
      </div>
    </div>
  );
};

// Styles modernisés
const styles = {
  container: {
    maxWidth: '800px',
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
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  stat: {
    textAlign: 'center',
    flex: '1',
    margin: '0 10px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  link: {
    display: 'block',
    marginTop: '10px',
    color: '#2196F3',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s',
  },
  addButtonHover: {
    backgroundColor: '#45a049',
  },
};

export default Dashboard;