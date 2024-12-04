import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBorrower = () => {
  const navigate = useNavigate();
  const [borrower, setBorrower] = useState({
    subscriber_email: '',
    book_title: '',
    borrow_start_date: '',
    borrow_end_date: '',
  });
  const [books, setBooks] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/books`)
      .then((res) => setBooks(res.data))
      .catch((err) => console.error('Erreur chargement livres : ', err));

    axios
      .get(`${process.env.REACT_APP_API_URL}/subscribers`)
      .then((res) => setSubscribers(res.data))
      .catch((err) => console.error('Erreur chargement abonnés : ', err));

    axios
      .get(`${process.env.REACT_APP_API_URL}/borrowers`)
      .then((res) => setBorrowers(res.data))
      .catch((err) => console.error('Erreur chargement emprunts : ', err));
  }, []);

  const handleChange = (e) => {
    setBorrower({ ...borrower, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérifier si l'email de l'abonné existe déjà
    const existingSubscriber = subscribers.find(subscriber => subscriber.email === borrower.subscriber_email);
    if (!existingSubscriber) {
      alert('Email de l\'abonné n\'existe pas');
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/borrowers`, borrower)
      .then((res) => {
        setMessage(res.data.message);
        setBorrower({
          subscriber_email: '',
          book_title: '',
          borrow_start_date: '',
          borrow_end_date: '',
        });
        // Mettre à jour la liste des livres disponibles
        axios
          .get(`{process.env.REACT_APP_API_URL}/books`)
          .then((res) => setBooks(res.data))
          .catch((err) => console.error('Erreur chargement livres : ', err));
        navigate('/borrower');
      })
      .catch((err) => setMessage(err.response?.data?.error || 'Erreur lors de l\'ajout'));
  };

  const isBookBorrowed = (bookTitle) => {
    return borrowers.some(borrower => borrower.book_title === bookTitle);
  };

  const availableBooks = books.filter(book => book.quantity > 0 && !isBookBorrowed(book.title));

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Ajouter un Emprunteur</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email de l'abonné :</label>
          <input
            list="subscribers"
            name="subscriber_email"
            value={borrower.subscriber_email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <datalist id="subscribers">
            {subscribers.map((subscriber) => (
              <option key={subscriber.email} value={subscriber.email}>
                {subscriber.email}
              </option>
            ))}
          </datalist>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Titre du livre :</label>
          <input
            list="books"
            name="book_title"
            value={borrower.book_title}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <datalist id="books">
            {availableBooks.map((book) => (
              <option key={book.title} value={book.title}>
                {book.title}
              </option>
            ))}
          </datalist>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Date de début d'emprunt :</label>
          <input
            type="date"
            name="borrow_start_date"
            value={borrower.borrow_start_date}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Date de fin d'emprunt :</label>
          <input
            type="date"
            name="borrow_end_date"
            value={borrower.borrow_end_date}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>Ajouter</button>
      </form>
      {message && <p>{message}</p>}
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

export default AddBorrower;