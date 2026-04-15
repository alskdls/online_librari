import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onApplyFilters, isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleQuickFilter = (type) => {
    const currentYear = new Date().getFullYear();
    let filters = {
      selectedGenres: [],
      selectedAuthors: [],
      priceRange: { min: '', max: '' },
      selectedYears: { from: '', to: '' },
      pageFilter: '',
      onlyWithImages: false
    };

    if (type === 'new') {
      filters.selectedYears = { from: (currentYear - 1).toString(), to: currentYear.toString() };
    }
    onApplyFilters(filters);
  };

  return (
    <aside style={sidebarContainerStyle}>
      <style>
        {`
          .sidebar-item {
            padding: 12px 15px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #555;
            font-size: 14px;
            font-weight: 500;
            text-align: left;
          }
          .sidebar-item:hover {
            background-color: #f1f3f5;
            color: #2c3e50;
            padding-left: 20px;
          }
          
          .theme-toggle-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 15px;
          }
          .switch {
            position: relative;
            display: inline-block;
            width: 38px;
            height: 20px;
          }
          .switch input { opacity: 0; width: 0; height: 0; }
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 20px;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 14px; width: 14px;
            left: 3px; bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + .slider { background-color: #2ecc71; }
          input:checked + .slider:before { transform: translateX(18px); }
        `}
      </style>

      {/* ВЕРХНЯ НАВІГАЦІЯ (БЕЗ ЕМОДЗІ ТА ЗАГОЛОВКІВ) */}
      <div className="sidebar-item" onClick={() => navigate('/')}>Головна</div>
      <div className="sidebar-item" onClick={() => handleQuickFilter('new')}>Новинки</div>
      <div className="sidebar-item" onClick={() => handleQuickFilter('top')}>Топ книги</div>
      <div className="sidebar-item" onClick={() => navigate('/recommendations')}>Рекомендації</div>

      <div style={{ height: '40px' }}></div>

      {/* РОЗВАЖАЛЬНІ КНОПКИ */}
      <div className="sidebar-item" onClick={() => alert('Шукаємо випадкову книгу...')}>Рандомна книга</div>

      <div style={{ marginTop: 'auto' }}>
        {/* ПЕРЕМИКАЧ ТЕМИ ЯК ТИ ХОТІВ */}
        <div className="theme-toggle-container">
          <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>Темна тема</span>
          <label className="switch">
            <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* НИЖНІЙ БЛОК (ТОЙ САМИЙ ДИЗАЙН З КАРТКОЮ) */}
      <div style={bottomSectionStyle}>
        {user ? (
          <>
            <div style={userCardStyle}>
              <div style={avatarMiniStyle}>👤</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={userNameStyle}>{user.username}</div>
                <div style={userRoleStyle}>{user.role}</div>
              </div>
            </div>

            {user.role === 'admin' && (
              <button onClick={() => navigate('/add-book')} style={addBookBtnStyle}>
                + Додати книгу
              </button>
            )}
          </>
        ) : (
          <button onClick={() => navigate('/login')} style={loginBtnStyle}>
            Увійти в кабінет
          </button>
        )}
      </div>
    </aside>
  );
};

// --- СТИЛІ ---

const sidebarContainerStyle = {
  width: '240px',
  padding: '20px 15px',
  borderRight: '1px solid #eee',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fff',
  height: 'calc(100vh - 70px)',
  position: 'sticky',
  top: '70px',
  boxSizing: 'border-box'
};

const bottomSectionStyle = {
  paddingTop: '20px',
  borderTop: '1px solid #f1f1f1'
};

const userCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px',
  background: '#f8f9fa',
  borderRadius: '12px',
  marginBottom: '15px'
};

const avatarMiniStyle = {
  width: '35px',
  height: '35px',
  background: '#fff',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  border: '1px solid #eee'
};

const userNameStyle = {
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#2c3e50',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const userRoleStyle = {
  fontSize: '11px',
  color: '#999',
  textTransform: 'capitalize'
};

const addBookBtnStyle = { 
  backgroundColor: '#2ecc71', 
  color: 'white', 
  width: '100%', 
  padding: '12px', 
  border: 'none', 
  borderRadius: '10px', 
  cursor: 'pointer', 
  fontWeight: 'bold', 
  fontSize: '13px',
  marginBottom: '10px',
  transition: '0.3s'
};

const loginBtnStyle = {
  backgroundColor: '#3498db',
  color: 'white',
  width: '100%',
  padding: '12px',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default Sidebar;