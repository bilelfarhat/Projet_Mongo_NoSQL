import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';
import UpdateBookForm from './components/UpdateBookForm';
import SubscriberList from './components/SubscriberList';
import AddSubscriberForm from './components/AddSubscriberForm';
import LoanList from './components/LoanList';
import UpdateSubscriberForm from './components/UpdateSubscriberForm';

function App() {
  return (
    <Router>
      <Header />
      <div style={{ paddingTop: '70px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/add-book" element={<AddBookForm />} />
          <Route path="/update-book/:id" element={<UpdateBookForm />} />
          <Route path="/subscribers" element={<SubscriberList />} />
          <Route path="/add-subscriber" element={<AddSubscriberForm />} />
          <Route path="/loans" element={<LoanList />} />
          <Route path="/update-subscriber/:email" element={<UpdateSubscriberForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
