import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate(); // Utilisé pour la redirection

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios
      .get('http://localhost:5000/books')
      .then((res) => setBooks(res.data))
      .catch((err) => console.error('Erreur : ', err));
  };

  const handleDelete = (title) => {
    axios
      .delete(`http://localhost:5000/books/${title}`)
      .then(() => {
        setBooks(books.filter((book) => book.title !== title));
      })
      .catch((err) => console.error('Erreur lors de la suppression : ', err));
  };

  const handleEdit = (book) => {
    navigate(`/update-book/${book.title}`, { state: { book } }); // Redirige vers la page de modification avec les données du livre
  };

  return (
    <div>
      <h2>Liste des Livres</h2>
      <ul>
        {books.map((book) => (
          <li key={book.title}>
            {book.title} - {book.author} - {book.year}
            <button onClick={() => handleDelete(book.title)}>Supprimer</button>
            <button onClick={() => handleEdit(book)}>Modifier</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
