import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const AddBorrower = () => {
  const currentDate = new Date().toISOString().split("T")[0];

  const [borrower, setBorrower] = useState({
    subscriber_email: "",
    book_title: "",
    borrow_start_date: currentDate,
    borrow_end_date: "",
    duration: "", // pour la sélection de durée (5, 10, 15 jours)
  });
  const [books, setBooks] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate=useNavigate();

  useEffect(() => {
    // Charger les livres depuis l'API
    axios
      .get("http://localhost:5000/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Erreur lors du chargement des livres :", err));

    // Charger les abonnés depuis l'API
    axios
      .get("http://localhost:5000/subscribers")
      .then((res) => setSubscribers(res.data))
      .catch((err) => console.error("Erreur lors du chargement des abonnés :", err));
  }, []);

  const handleChange = (e) => {
    setBorrower({ ...borrower, [e.target.name]: e.target.value });
  };

  const handleBookChange = (selectedOption) => {
    setBorrower({ ...borrower, book_title: selectedOption ? selectedOption.value : "" });
  };

  const handleDurationChange = (selectedOption) => {
    const duration = selectedOption.value;
    const endDate = calculateEndDate(borrower.borrow_start_date, duration);
    setBorrower({
      ...borrower,
      duration: duration,
      borrow_end_date: endDate,
    });
  };

  const calculateEndDate = (startDate, days) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0]; // retourne la date au format YYYY-MM-DD
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingSubscriber = subscribers.find(
      (subscriber) => subscriber.email === borrower.subscriber_email
    );

    if (!existingSubscriber) {
      alert("L'email de l'abonné n'existe pas");
      return;
    }

    axios
      .post("http://localhost:5000/borrowers", borrower)
      .then((res) => {
        setMessage(res.data.message);
        setBorrower({
          subscriber_email: "",
          book_title: "",
          borrow_start_date: currentDate,
          borrow_end_date: "",
          duration: "",
        });
        navigate("/borrower");
      })
      .catch((err) => {
        setMessage(err.response?.data?.error || "Erreur lors de l'ajout");
      });
  };

  const bookOptions = books.map((book) => ({
    value: book.title,
    label: `${book.title} ${book.quantity === 0 ? "(Indisponible)" : "(Disponible)"}`,
    isDisabled: book.quantity === 0, // Désactiver les livres indisponibles
  }));

  const durationOptions = [
    { value: 5, label: "5 jours" },
    { value: 10, label: "10 jours" },
    { value: 15, label: "15 jours" },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Ajouter un Emprunteur</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Titre du livre :</label>
          <Select
            options={bookOptions}
            value={bookOptions.find((option) => option.value === borrower.book_title)}
            onChange={handleBookChange}
            isSearchable={true}
            placeholder="Sélectionnez un livre..."
            styles={customStyles}
          />
        </div>
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
          <label style={styles.label}>Durée de l'emprunt :</label>
          <Select
            options={durationOptions}
            value={durationOptions.find((option) => option.value === borrower.duration)}
            onChange={handleDurationChange}
            isClearable={true} // Permet de supprimer la sélection
            placeholder="Sélectionner une durée"
            styles={customStyles}
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
        <button type="submit" style={styles.submitButton}>
          Ajouter
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

// Styles pour le composant react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#ccc",
    borderRadius: "4px",
    padding: "10px",
    fontSize: "14px",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

// Styles modernisés pour le formulaire
const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontSize: "16px",
    color: "#555",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s",
  },
};

export default AddBorrower;
