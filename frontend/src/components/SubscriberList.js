import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/subscribers`)
      .then(res => setSubscribers(res.data))
      .catch(err => console.error('Erreur lors de la récupération des abonnés : ', err));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteSubscriber = (email) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet abonné ?")) {
      axios.delete(`http://localhost:5000/subscribers/${email}`)
        .then((res) => {
          alert(res.data.message);
          // Mettre à jour la liste des abonnés après suppression
          setSubscribers(subscribers.filter(subscriber => subscriber.email !== email));
        })
        .catch((err) => {
          console.error("Erreur lors de la suppression de l'abonné : ", err);
          alert("Une erreur est survenue lors de la suppression.");
        });
    }
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Liste des Abonnés</h2>
      <Link to="/add-subscriber" style={styles.addButton}>Ajouter un abonné</Link>
      <input
        type="text"
        placeholder="Rechercher par nom ou email"
        value={searchTerm}
        onChange={handleSearchChange}
        style={styles.searchInput}
      />
      <div style={styles.subscriberList}>
        {filteredSubscribers.length > 0 ? (
          filteredSubscribers.map(subscriber => (
            <div key={subscriber.email} style={styles.subscriberItem}>
              <h3>{subscriber.name}</h3>
              <p>{subscriber.email}</p>
              <div style={styles.buttonContainer}>
                <Link to={`/update-subscriber/${subscriber.email}`} state={{ subscriber }} style={styles.editButton}>
                  Modifier
                </Link>
                <button 
  style={styles.deleteButton} 
  onClick={() => handleDeleteSubscriber(subscriber.email)}
>
  Supprimer
</button>

              </div>
            </div>
          ))
        ) : (
          <p style={styles.noDataText}>Aucun abonné trouvé</p>
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
  subscriberList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  subscriberItem: {
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
  editButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
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

export default SubscriberList;