import './App.css';
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import BookList from './components/BookList';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AddBook from './components/AddBook';
import Favorites from './components/Favorites';
import Cart from './components/Cart';
import EditBook from './components/EditBook';
import BookDetail from './components/BookDetail';

function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [extraFilters, setExtraFilters] = useState(null);

  return (
    <div className="App" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <Header onSearch={setSearchTerm} onApplyFilters={setExtraFilters} />
      
      <div className="main-layout" style={{ 
        display: 'flex', 
        flex: 1,
        alignItems: 'stretch'
      }}>
        <Sidebar onSelectGenre={setSelectedGenreId} onApplyFilters={setExtraFilters} />
        
        <main className="content-area" style={{ 
          flex: 1, 
          padding: '20px',
          backgroundColor: '#f9f9f9'
        }}>
          <Routes>
            <Route path="/" element={
              <Home 
                searchQuery={searchTerm} 
                extraFilters={extraFilters} 
              />
            } />

            <Route path="/search" element={
              <BookList 
                selectedGenre={selectedGenreId} 
                searchQuery={searchTerm} 
                extraFilters={extraFilters} 
              />
            } />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/edit-book/:id" element={<EditBook />} />
            <Route path="/book/:id" element={<BookDetail />} />
          </Routes>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;