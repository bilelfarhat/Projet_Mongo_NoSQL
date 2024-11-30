import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';
import UpdateBookForm from './components/UpdateBookForm';
import SubscriberList from './components/SubscriberList';
import AddSubscriberForm from './components/AddSubscriberForm';
import BorrowerList from './components/borrowerList';
import UpdateSubscriberForm from './components/UpdateSubscriberForm';
import AddBorrower from './components/AddBorrower';

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
          <Route path="/borrower" element={<BorrowerList />} />
          <Route path="/update-subscriber/:email" element={<UpdateSubscriberForm />} />
          <Route path="/add-borrower" element={<AddBorrower />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
