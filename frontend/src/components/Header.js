import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img
          src="./image.jpg"
          alt="Library Logo"
          style={styles.logo}
        />
        <span style={styles.appName}>Gestion de Bibliothèque</span>
      </div>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Tableau de bord</Link>
        <Link to="/books" style={styles.link}>Livres</Link>
        <Link to="/subscribers" style={styles.link}>Abonnés</Link>
        <Link to="/borrower" style={styles.link}>Emprunts</Link>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#007bff',
    padding: '10px 20px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '40px',
    marginRight: '10px',
  },
  appName: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    gap: '15px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'color 0.3s',
  },
  linkHover: {
    color: '#d1eaff',
  },
};

export default Header;