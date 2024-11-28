import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch loans data
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/borrowers');
        setLoans(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load loans');
        setLoading(false);
        console.error('Error fetching loans:', err);
      }
    };

    fetchLoans();
  }, []);

  // Delete loan
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/borrowers/${id}`);
      setLoans(loans.filter(loan => loan._id !== id)); // Remove deleted loan from state
    } catch (err) {
      console.error('Error deleting loan:', err);
    }
  };

  if (loading) {
    return <div>Loading loans...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Liste des Emprunts</h2>
      <ul>
        {loans.map(loan => (
          <li key={loan._id}>
            Livre : {loan.book_title} - Abonné : {loan.subscriber_email} - Date : {loan.borrow_date}
            <button onClick={() => handleDelete(loan._id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoanList;
