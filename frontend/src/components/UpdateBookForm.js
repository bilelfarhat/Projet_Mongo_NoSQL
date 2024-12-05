import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const UpdateBookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Assurez-vous que l'ID est récupéré à partir des paramètres de l'URL
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [quantity, setQuantity] = useState(''); // Ajout de l'état pour la quantité

  useEffect(() => {
    // Vérifie si les données du livre sont passées via la navigation
    if (location.state?.book) {
      const { title, author, year, quantity } = location.state.book;
      setTitle(title);
      setAuthor(author);
      setYear(year);
      setQuantity(quantity); // Initialiser la quantité
    } else {
      // Si pas de données passées, récupérer depuis l'API
      axios
        .get(`http://localhost:5000/books/${id}`)
        .then((res) => {
          const book = res.data;
          setTitle(book.title);
          setAuthor(book.author);
          setYear(book.year);
          setQuantity(book.quantity); // Initialiser la quantité
        })
        .catch((err) => console.error('Erreur lors de la récupération du livre : ', err));
    }
  }, [id, location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedBook = { title, author, year, quantity };

    axios
      .put(`http://localhost:5000/books/${id}`, updatedBook)
      .then((res) => {
        navigate('/books'); // Redirection après la mise à jour du livre
      })
      .catch((err) => console.error('Erreur lors de la mise à jour du livre : ', err));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mettre à jour le Livre</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Titre :</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Auteur :</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Année :</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Quantité :</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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
};

export default UpdateBookForm;