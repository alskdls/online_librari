import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';

const Favorites = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/favorites-details/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setFavoriteBooks(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user?.id]);

  if (!user) {
    return <div style={{ padding: '20px' }}>Будь ласка, увійдіть в аккаунт, щоб переглянути обране.</div>;
  }

  if (loading) {
    return <div style={{ padding: '20px' }}>Завантаження...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Моє Обране</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
        {favoriteBooks.length > 0 ? (
          favoriteBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              isFavoriteInitial={true} 
            />
          ))
        ) : (
          <p>У вас поки немає збережених книг.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;