import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const UpdateBookForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    // Vérifie si les données du livre sont passées via la navigation
    if (location.state?.book) {
      const { title, author, year } = location.state.book;
      setTitle(title);
      setAuthor(author);
      setYear(year);
    } else {
      // Si pas de données passées, récupérer depuis l'API
      axios
        .get(`http://localhost:5000/books/${id}`)
        .then((res) => {
          const book = res.data;
          setTitle(book.title);
          setAuthor(book.author);
          setYear(book.year);
        })
        .catch((err) => console.error('Erreur lors de la récupération du livre : ', err));
    }
  }, [id, location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedBook = { title, author, year };

    axios
      .put(`http://localhost:5000/books/${id}`, updatedBook)
      .then(() => {
        alert('Livre mis à jour avec succès');
        navigate('/books'); // Redirige vers la liste des livres après mise à jour
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du livre : ', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Modifier un Livre</h2>
      <label>
        Titre :
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label>
        Auteur :
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </label>
      <label>
        Année :
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
      </label>
      <button type="submit">Mettre à jour</button>
    </form>
  );
};

export default UpdateBookForm;
