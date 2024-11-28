import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const UpdateSubscriberForm = () => {
  const { email } = useParams(); // Getting the subscriber email from the URL parameter
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');

  useEffect(() => {
    // Check if subscriber data is passed via location state
    if (location.state?.subscriber) {
      const { name, email } = location.state.subscriber;
      setName(name);
      setSubscriberEmail(email);
    } else {
      // Fetch subscriber details if not passed through state
      axios
        .get(`http://localhost:5000/subscribers/${email}`)
        .then((res) => {
          const subscriber = res.data;
          setName(subscriber.name);
          setSubscriberEmail(subscriber.email);
        })
        .catch((err) => console.error('Erreur lors de la récupération de l’abonné : ', err));
    }
  }, [email, location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedSubscriber = { name, email: subscriberEmail };

    axios
      .put(`http://localhost:5000/subscribers/${email}`, updatedSubscriber)
      .then(() => {
        alert('Abonné mis à jour avec succès');
        navigate('/subscribers'); // Redirect to the subscriber list after update
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour de l’abonné : ', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Modifier un Abonné</h2>
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
          value={subscriberEmail}
          onChange={(e) => setSubscriberEmail(e.target.value)}
          required
        />
      </label>
      <button type="submit">Mettre à jour</button>
    </form>
  );
};

export default UpdateSubscriberForm;
