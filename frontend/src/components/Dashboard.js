import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    // Fetch books, subscribers, and loans
    axios.get('http://localhost:5000/books').then(res => setBooks(res.data));
    axios.get('http://localhost:5000/subscribers').then(res => setSubscribers(res.data));
    axios.get('http://localhost:5000/borrowers').then(res => setLoans(res.data));
  }, []);

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.heading}>Tableau de Bord</h2>
      <div style={styles.stats}>
        <div style={styles.stat}>
          <h3>Livres</h3>
          <p>{books.length}</p>
          <Link to="/books">Voir les livres</Link>
        </div>
        <div style={styles.stat}>
          <h3>Abonnés</h3>
          <p>{subscribers.length}</p>
          <Link to="/subscribers">Voir les abonnés</Link>
        </div>
        <div style={styles.stat}>
          <h3>Emprunts</h3>
          <p>{loans.length}</p>
          <Link to="/loans">Voir les emprunts</Link>
        </div>
      </div>
      <Link to="/add-book" style={styles.addButton}>Ajouter un livre</Link>
      <Link to="/add-subscriber" style={styles.addButton}>Ajouter un abonné</Link>
    </div>
  );
};

const styles = {
  dashboard: {
    padding: '20px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  stat: {
    backgroundColor: '#f1f1f1',
    padding: '20px',
    borderRadius: '8px',
    width: '30%',
  },
  addButton: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '16px',
    margin: '10px',
  },
};

export default Dashboard;
