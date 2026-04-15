import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        
        {/* Блок 1: Про нас */}
        <div style={sectionStyle}>
          <h4 style={headingStyle}>📚 Бібліотека</h4>
          <p style={textStyle}>
            Ми допомагаємо знайти найкращі книги для навчання та відпочинку. 
            Твій цифровий простір для читання.
          </p>
        </div>

        {/* Блок 2: Швидкі посилання (поки неклікабельні) */}
        <div style={sectionStyle}>
          <h4 style={headingStyle}>Навігація</h4>
          <ul style={listStyle}>
            <li style={listItemStyle}>Про нас</li>
            <li style={listItemStyle}>Правила користування</li>
            <li style={listItemStyle}>Допомога</li>
            <li style={listItemStyle}>FAQ</li>
          </ul>
        </div>

        {/* Блок 3: Контакти */}
        <div style={sectionStyle}>
          <h4 style={headingStyle}>Зв'язок з нами</h4>
          <p style={textStyle}>📧 support@library.ua</p>
          <p style={textStyle}>📞 +380 (99) 123-45-67</p>
          <p style={textStyle}>📍 м. Львів, вул. Технічна, 1</p>
        </div>

      </div>

      <div style={bottomBarStyle}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Система управління бібліотекою. Всі права захищені.</p>
      </div>
    </footer>
  );
};

// --- СТИЛІ ---

const footerStyle = {
  background: '#2c3e50', // Темний колір як у Header
  color: '#ecf0f1',
  padding: '40px 0 20px 0',
  marginTop: '50px',
  borderTop: '4px solid #27ae60', // Зелений акцент
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px',
  gap: '30px'
};

const sectionStyle = {
  flex: '1',
  minWidth: '250px',
};

const headingStyle = {
  color: '#27ae60',
  marginBottom: '20px',
  fontSize: '18px',
  fontWeight: 'bold'
};

const textStyle = {
  fontSize: '14px',
  lineHeight: '1.6',
  opacity: 0.8,
  margin: '5px 0'
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0
};

const listItemStyle = {
  fontSize: '14px',
  marginBottom: '10px',
  cursor: 'pointer',
  opacity: 0.8,
  transition: '0.3s',
  // Ефект при наведенні можна додати через CSS, але тут залишаємо так
};

const bottomBarStyle = {
  textAlign: 'center',
  marginTop: '40px',
  paddingTop: '20px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  fontSize: '12px',
  opacity: 0.6
};

export default Footer;