import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/books`)
    .then(res => setBooks(res.data))
    .catch(err => console.error('Erreur lors de la récupération des livres : ', err));
    

    axios.get(`http://localhost:5000/borrowers`)
      .then(res => setBorrowers(res.data))
      .catch(err => console.error('Erreur lors de la récupération des emprunteurs : ', err));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.year.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.quantity.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isBookAvailable = (book) => {
    return book.quantity > 0;
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
     

      axios.delete(`http://localhost:5000/books/${bookId}`)
      //${process.env.REACT_APP_API_URL}
      
      .then((res) => {
        alert(res.data.message);
        // Mettre à jour la liste des abonnés après suppression
        setBooks(books.filter(book => book._id !== bookId));
      })
      .catch((err) => {
        console.error("Erreur lors de la suppression du livre : ", err);
        alert("Une erreur est survenue lors de la suppression.");
      });
    }
  };
  

  
  

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Liste des Livres</h2>
      <Link to="/add-book" style={styles.addButton}>Ajouter un livre</Link>
      <input
        type="text"
        placeholder="Rechercher par titre ou auteur"
        value={searchTerm}
        onChange={handleSearchChange}
        style={styles.searchInput}
      />
      <div style={styles.bookList}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div key={book._id} style={styles.bookItem}>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>{book.year}</p>
              <p>Quantité : {book.quantity}</p>
              <p style={isBookAvailable(book) ? styles.available : styles.unavailable}>
                {isBookAvailable(book) ? 'Disponible' : 'Indisponible'}
              </p>
              <div style={styles.buttonContainer}>
                <Link to={`/update-book/${book._id}`} state={{ book }} style={styles.editButton}>
                  Modifier
                </Link>
                <button
  style={styles.deleteButton}
  onClick={() => handleDeleteBook(book._id)}
>
  Supprimer
</button>

              </div>
            </div>
          ))
        ) : (
          <p style={styles.noDataText}>Aucun livre trouvé</p>
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
  bookList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  bookItem: {
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
  available: {
    color: 'green',
    fontWeight: 'bold',
  },
  unavailable: {
    color: 'red',
    fontWeight: 'bold',
  },
};

export default BookList;