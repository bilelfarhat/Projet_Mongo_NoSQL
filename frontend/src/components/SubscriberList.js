import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/subscribers')
      .then((res) => setSubscribers(res.data))
      .catch((err) => console.error('Erreur : ', err));
  }, []);

  const handleDelete = (email) => {
    axios
      .delete(`http://localhost:5000/subscribers/${email}`)
      .then(() => {
        setSubscribers(subscribers.filter((subscriber) => subscriber.email !== email));
      })
      .catch((err) => console.error('Erreur lors de la suppression : ', err));
  };

  const handleEdit = (subscriber) => {
    // Assuming you want to pass the subscriber data to the edit form
    navigate(`/update-subscriber/${subscriber.email}`, { state: { subscriber } });
  };

  return (
    <div>
      <h2>Liste des Abonnés</h2>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.email}>
            {subscriber.name} - {subscriber.email}
            <button onClick={() => handleDelete(subscriber.email)}>Supprimer</button>
            <button onClick={() => handleEdit(subscriber)}>Modifier</button>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default SubscriberList;
