import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BorrowerList = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/borrowers`)
      .then(res => setBorrowers(res.data))
      .catch(err => console.error('Erreur lors de la récupération des emprunteurs : ', err));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    const borrowerToDelete = borrowers.find(borrower => borrower._id === id);

    if (borrowerToDelete) {
      try {
        setIsLoading(true); // Marquer l'état comme "chargement en cours"
        await axios.put(`${process.env.REACT_APP_API_URL}/books/update-quantity`, {
          book_title: borrowerToDelete.book_title,
          quantity_change: 0 // Augmenter la quantité de 1
        });

        await axios.delete(`${process.env.REACT_APP_API_URL}/borrowers/${id}`);
        setBorrowers(borrowers.filter(borrower => borrower._id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'emprunteur : ', err);
      } finally {
        setIsLoading(false); // Réinitialiser l'état à "non chargé"
      }
    }
  };

  const filteredBorrowers = borrowers.filter(borrower =>
    borrower.subscriber_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrower.book_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Liste des Emprunteurs</h2>
      <Link to="/add-borrower" style={styles.addButton}>Ajouter un emprunteur</Link>
      <input
        type="text"
        placeholder="Rechercher par email ou titre du livre"
        value={searchTerm}
        onChange={handleSearchChange}
        style={styles.searchInput}
      />
      <div style={styles.borrowerList}>
        {filteredBorrowers.length > 0 ? (
          filteredBorrowers.map(borrower => (
            <div key={borrower._id} style={styles.borrowerItem}>
              <h3>{borrower.subscriber_email}</h3>
              <p>{borrower.book_title}</p>
              <p>{borrower.borrow_start_date} - {borrower.borrow_end_date}</p>
              <div style={styles.buttonContainer}>
                <button 
                  style={styles.deleteButton} 
                  onClick={() => handleDelete(borrower._id)} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Suppression...' : 'Enregistrer le retour'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noDataText}>Aucun emprunteur trouvé</p>
        )}
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
  addButton: {
    display: 'inline-block',
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s',
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '20px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  borrowerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  borrowerItem: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s',
  },
  noDataText: {
    textAlign: 'center',
    color: '#777',
    fontSize: '16px',
  },
};

export default BorrowerList;
