import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const AddSubscriberForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSubscriber = { name, email };

    axios.post('http://localhost:5000/subscribers', newSubscriber)
      .then(res => {
        alert('Abonné ajouté avec succès');
        setName('');
        setEmail('');
        navigate('/subscribers');
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout de l\'abonné', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nom :
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Email :
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default AddSubscriberForm;
