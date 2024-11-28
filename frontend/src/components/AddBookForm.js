import React, { useState } from 'react';
import axios from 'axios';

const AddBookForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBook = { title, author, year };

    axios.post('http://localhost:5000/books', newBook)
      .then(res => {
        alert('Livre ajouté avec succès');
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du livre', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default AddBookForm;
