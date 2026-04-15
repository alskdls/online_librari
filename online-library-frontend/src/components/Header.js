import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FiltersModal from './FiltersModal';

const Header = ({ onSearch, onApplyFilters }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [user, setUser] = useState(null); // Додаємо стан для юзера
  const navigate = useNavigate();

  useEffect(() => {
    // Перевіряємо, чи є юзер в системі
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);

    fetch('http://localhost:5000/genres').then(res => res.json()).then(data => setGenres(data));
    fetch('http://localhost:5000/books').then(res => res.json()).then(data => {
      const uniqueAuthors = [...new Set(data.map(b => b.author))].sort();
      setAuthors(uniqueAuthors);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header style={headerStyle}>
      {/* ЛІВА ЧАСТИНА */}
      <div style={leftSectionStyle}>
        <div 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer', fontSize: '24px', marginRight: '20px' }}
          title="На головну"
        >
          📚
        </div>
        
        <nav style={navStyle}>
          <Link to="/" style={linkStyle}>Головна</Link>
          <Link to="/favorites" style={linkStyle}>Обране ⭐</Link>
          <Link to="/cart" style={linkStyle}>Кошик 🛒</Link>
        </nav>
      </div>

      {/* ЦЕНТР */}
      <div style={{ flex: 1 }}></div>

      {/* ПРАВА ЧАСТИНА */}
      <div style={rightSectionStyle}>
        <div style={searchContainerStyle}>
          <input 
            type="text" 
            placeholder="Пошук..." 
            onChange={(e) => onSearch(e.target.value)} 
            style={inputStyle}
          />
          <button 
            onClick={() => setIsModalOpen(true)} 
            style={filterBtnStyle}
          >
            ⚙️ Фільтри
          </button>
        </div>

        {/* ПЕРЕВІРКА: якщо юзера немає — показуємо кнопки, якщо є — тільки іконку */}
        {!user ? (
          <div style={authNavStyle}>
            <Link to="/login" style={linkStyle}>Увійти</Link>
            <Link to="/register" style={linkStyle}>Реєстрація</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div 
              style={{ ...profileIconStyle, cursor: 'pointer' }} 
              onClick={() => navigate('/profile')} 
              title="Перейти в профіль"
            >
              👤
            </div>
            <button onClick={handleLogout} style={logoutSmallStyle}>Вийти</button>
          </div>
        )}
      </div>

      <FiltersModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        genres={genres}
        authors={authors}
        onApplyFilters={(filters) => {
          onApplyFilters(filters);
          setIsModalOpen(false);
        }} 
      />
    </header>
  );
};

// --- СТИЛІ (БЕЗ ЗМІН ТВОГО ДИЗАЙНУ) ---

const headerStyle = { 
  background: '#2c3e50', 
  padding: '10px 30px', 
  color: 'white', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between', 
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  position: 'sticky',
  top: 0,
  zIndex: 1000
};

const leftSectionStyle = { display: 'flex', alignItems: 'center' };
const navStyle = { display: 'flex', gap: '15px' };
const rightSectionStyle = { display: 'flex', alignItems: 'center', gap: '20px' };

const searchContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: '2px 5px',
  width: '300px'
};

const inputStyle = {
  flex: 1,
  padding: '8px 15px',
  borderRadius: '20px',
  border: 'none',
  outline: 'none',
  fontSize: '14px',
  color: '#333'
};

const filterBtnStyle = {
  background: '#f1f1f1',
  border: 'none',
  borderRadius: '15px',
  padding: '5px 10px',
  cursor: 'pointer',
  fontSize: '12px',
  color: '#2c3e50',
  whiteSpace: 'nowrap'
};

const profileIconStyle = {
  fontSize: '22px',
  opacity: 1
};

const authNavStyle = {
  display: 'flex',
  gap: '10px',
  borderLeft: '1px solid #555',
  paddingLeft: '15px'
};

const linkStyle = { 
  color: '#ecf0f1', 
  textDecoration: 'none', 
  fontWeight: '500',
  fontSize: '13px', 
  whiteSpace: 'nowrap' 
};

// Маленька кнопка виходу, щоб вписувалася в дизайн
const logoutSmallStyle = {
  background: 'none',
  border: '1px solid #e74c3c',
  color: '#e74c3c',
  padding: '4px 8px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '11px'
};

export default Header;