import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img
          src="logo.png"
          alt="Library Logo"
          style={styles.logo}
        />
        <span style={styles.appName}>Gestion de Bibliothèque</span>
      </div>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Tableau de bord</Link>
        <Link to="/books" style={styles.link}>Livres</Link>
        <Link to="/subscribers" style={styles.link}>Abonnés</Link>
        <Link to="/loans" style={styles.link}>Emprunts</Link>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#007bff',
    padding: '10px 20px',
    color: '#fff',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  appName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
  },
  nav: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default Header;
