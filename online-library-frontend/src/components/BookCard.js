import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Додали імпорт axios
import QuickViewModal from './QuickViewModal';

const BookCard = ({ book, isFavoriteInitial = false }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Стан для реального рейтингу
  const [ratingData, setRatingData] = useState({ average_rating: 0, total_votes: 0 });

  useEffect(() => {
    setIsFavorite(isFavoriteInitial);
    
    // Отримуємо рейтинг для цієї конкретної книги
    axios.get(`http://localhost:5000/books/${book.id}/rating`)
      .then(res => setRatingData(res.data))
      .catch(err => console.error(err));
  }, [isFavoriteInitial, book.id]);

  const cover = (book.image_url && book.image_url !== "[null]" && book.image_url.trim() !== "") 
    ? book.image_url 
    : "https://kappa.lol/pAubra"; 

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Видалити цю книгу назавжди?")) return;
    try {
      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRole: user?.role })
      });
      if (response.ok) {
        window.location.reload(); 
      }
    } catch (err) { console.error(err); }
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!user) { alert("Увійдіть!"); return; }
    const method = isFavorite ? 'DELETE' : 'POST';
    try {
      const response = await fetch('http://localhost:5000/favorites', {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, bookId: book.id })
      });
      if (response.ok) setIsFavorite(!isFavorite);
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <style>
        {`
          @keyframes cardAppear {
            from { opacity: 0; transform: translateY(10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .book-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important;
            border-color: #3498db !important;
          }
        `}
      </style>
      <div 
        className="book-card" 
        style={cardStyle} 
        onClick={() => navigate(`/book/${book.id}`)}
      >
        <div style={topRowStyle}>
          {user && (
            <button onClick={handleFavoriteClick} style={iconBtnStyle(isFavorite ? '#f1c40f' : '#ccc')}>
              {isFavorite ? '★' : '☆'}
            </button>
          )}

          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            {user?.role === 'admin' && (
              <React.Fragment>
                <button onClick={(e) => { e.stopPropagation(); navigate(`/edit-book/${book.id}`); }} style={iconBtnStyle('#f39c12')} title="Редагувати">✏️</button>
                <button onClick={(e) => handleDelete(e, book.id)} style={iconBtnStyle('#e74c3c')} title="Видалити">🗑️</button>
              </React.Fragment>
            )}
            <button onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} style={iconBtnStyle('#3498db')} title="Швидкий перегляд">👁️</button>
          </div>
        </div>

        <div style={imageBoxStyle}>
          <img src={cover} alt={book.title} style={imgStyle} onError={(e) => { e.target.src = "https://kappa.lol/pAubra"; }} />
        </div>
        
        <div style={contentStyle}>
          <h3 style={titleStyle} title={book.title}>{book.title}</h3>
          <p style={authorStyle}>{book.author}</p>
          {book.year && <p style={yearLabelStyle}>{book.year} рік</p>}
          
          {/* Справжні зірочки на основі average_rating */}
          <div style={ratingRowStyle}>
            <span style={{color: '#f1c40f'}}>
              {'★'.repeat(Math.round(ratingData.average_rating)) || ''}
              <span style={{color: '#ccc'}}>{'★'.repeat(5 - Math.round(ratingData.average_rating))}</span>
            </span>
            <span style={ratingNumStyle}>{ratingData.average_rating || 0}</span>
          </div>

          <button 
            style={readBtnStyle} 
            onClick={(e) => {
              e.stopPropagation();
              alert('Відкриваємо читалку...');
            }}
          >
            Читати онлайн 📖
          </button>
        </div>
      </div>

      {isModalOpen && <QuickViewModal book={book} cover={cover} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

// --- СТИЛІ (без змін) ---
const cardStyle = { width: '210px', background: '#fff', borderRadius: '10px', padding: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', border: '1px solid #f0f0f0', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', animation: 'cardAppear 0.5s ease-out forwards', cursor: 'pointer' };
const topRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' };
const iconBtnStyle = (color) => ({ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: color, padding: 0, transition: 'transform 0.2s ease' });
const imageBoxStyle = { width: '100%', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden' };
const imgStyle = { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: '2px' };
const contentStyle = { marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: '2px' };
const titleStyle = { fontSize: '16px', fontWeight: '700', color: '#2c3e50', margin: '0 0 2px 0', lineHeight: '1.2', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const authorStyle = { fontSize: '13px', color: '#555', margin: 0 };
const yearLabelStyle = { fontSize: '12px', color: '#999', margin: 0 };
const ratingRowStyle = { fontSize: '13px', display: 'flex', alignItems: 'center', margin: '4px 0', justifyContent: 'flex-start', width: '100%' };
const ratingNumStyle = { marginLeft: '6px', color: '#888' };
const readBtnStyle = { marginTop: '8px', width: '100%', padding: '10px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'background 0.3s ease' };

export default BookCard;