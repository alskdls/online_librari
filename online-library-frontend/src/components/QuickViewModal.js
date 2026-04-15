import React from 'react';

const QuickViewModal = ({ book, cover, onClose }) => {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose}>✕</button>
        
        <div style={containerStyle}>
          <div style={imageSideStyle}>
            <img src={cover} alt={book.title} style={modalImgStyle} />
          </div>
          
          <div style={infoSideStyle}>
            <h2 style={{margin: '0 0 10px 0'}}>{book.title}</h2>
            <p style={authorStyle}>Автор: <b>{book.author}</b></p>
            <p style={genreStyle}>Жанр: {book.genre_name || 'Загальний'}</p>
            
            <hr style={dividerStyle} />
            
            <p style={descStyle}>
              {book.description || "Опис для цієї книги поки що відсутній, але ми скоро його додамо!"}
            </p>
            
            <div style={statsStyle}>
              <span>📄 Сторінок: {book.pages || '---'}</span>
              <span style={priceTagStyle}>{book.price} грн</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Стилі для модалки
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { width: '800px', maxWidth: '90%', background: '#fff', borderRadius: '12px', padding: '30px', position: 'relative', animation: 'fadeIn 0.3s ease' };
const containerStyle = { display: 'flex', gap: '30px', flexWrap: 'wrap' };
const imageSideStyle = { flex: '1', minWidth: '250px' };
const modalImgStyle = { width: '100%', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' };
const infoSideStyle = { flex: '1.5', display: 'flex', flexDirection: 'column' };
const closeBtnStyle = { position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' };
const authorStyle = { fontSize: '16px', color: '#555' };
const genreStyle = { fontSize: '14px', color: '#3498db' };
const dividerStyle = { border: '0', borderTop: '1px solid #eee', margin: '20px 0' };
const descStyle = { fontSize: '15px', lineHeight: '1.6', color: '#444', marginBottom: '20px', flexGrow: 1 };
const statsStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' };
const priceTagStyle = { fontSize: '24px', color: '#27ae60' };

export default QuickViewModal;