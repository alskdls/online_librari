import React, { useState } from 'react';

const FiltersModal = ({ isOpen, onClose, genres, authors = [], onApplyFilters }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedYears, setSelectedYears] = useState({ from: '', to: '' });
  const [pageFilter, setPageFilter] = useState('');
  const [onlyWithImages, setOnlyWithImages] = useState(false);

  if (!isOpen) return null;

  const toggleSection = (section) => setActiveSection(activeSection === section ? null : section);

  const handleCheckboxChange = (id, list, setList) => {
    list.includes(id) ? setList(list.filter(item => item !== id)) : setList([...list, id]);
  };

  const handleReset = () => {
    setSelectedGenres([]);
    setSelectedAuthors([]);
    setPriceRange({ min: '', max: '' });
    setSelectedYears({ from: '', to: '' });
    setPageFilter('');
    setOnlyWithImages(false);
  };

  return (
    <div 
      style={overlayStyle} 
      onClick={onClose} 
      className="modal-overlay" 
    >
      {styleTag} 
      {modalAnimationStyles}

      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose}>✕</button>

        <div style={filterContainerStyle}>
          <FilterSection title="Жанри" id="genres" active={activeSection} onToggle={toggleSection}>
            {genres.map(g => (
              <label key={g.id} style={labelStyle}>
                <input type="checkbox" checked={selectedGenres.includes(g.id)} onChange={() => handleCheckboxChange(g.id, selectedGenres, setSelectedGenres)} /> {g.name}
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Автори" id="authors" active={activeSection} onToggle={toggleSection}>
            {authors.length > 0 ? authors.map(author => (
              <label key={author} style={labelStyle}>
                <input type="checkbox" checked={selectedAuthors.includes(author)} onChange={() => handleCheckboxChange(author, selectedAuthors, setSelectedAuthors)} /> {author}
              </label>
            )) : <p style={{fontSize: '12px'}}>Авторів не знайдено</p>}
          </FilterSection>

          <FilterSection title="Ціна (грн)" id="price" active={activeSection} onToggle={toggleSection}>
            <div style={{display: 'flex', gap: '5px'}}>
                <input type="number" placeholder="Від" style={inputStyle} value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} />
                <input type="number" placeholder="До" style={inputStyle} value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} />
            </div>
          </FilterSection>

          <FilterSection title="Рік видання" id="years" active={activeSection} onToggle={toggleSection}>
            <div style={{display: 'flex', gap: '5px'}}>
                <input type="number" placeholder="З" style={inputStyle} value={selectedYears.from} onChange={(e) => setSelectedYears({...selectedYears, from: e.target.value})} />
                <input type="number" placeholder="До" style={inputStyle} value={selectedYears.to} onChange={(e) => setSelectedYears({...selectedYears, to: e.target.value})} />
            </div>
          </FilterSection>

          <FilterSection title="Кількість сторінок" id="pages" active={activeSection} onToggle={toggleSection}>
            <select style={inputStyle} value={pageFilter} onChange={(e) => setPageFilter(e.target.value)}>
              <option value="">Будь-яка</option>
              <option value="short">До 200 сторінок</option>
              <option value="medium">200-500 сторінок</option>
              <option value="long">Понад 500 сторінок</option>
            </select>
          </FilterSection>

          <label style={checkboxLabelStyle}>
             <input type="checkbox" checked={onlyWithImages} onChange={() => setOnlyWithImages(!onlyWithImages)} />
             Тільки з обкладинкою 📸
          </label>
        </div>

        <button 
          className="reset-button" 
          style={resetBtnStyle} 
          onClick={handleReset}
        >
          Скинути фільтри
        </button>

        <button style={applyBtnStyle} onClick={() => onApplyFilters({ selectedGenres, selectedAuthors, priceRange, selectedYears, pageFilter, onlyWithImages })}>
          Застосувати
        </button>
      </div>
    </div>
  );
};

// --- ВИПРАВЛЕНИЙ КОМПОНЕНТ ДЛЯ ПЛАВНОСТІ ---
const FilterSection = ({ title, id, active, onToggle, children }) => {
  const isOpen = active === id;
  
  return (
    <div style={filterSectionStyle}>
      <div style={sectionHeaderStyle} onClick={() => onToggle(id)}>
        {title} 
        <span style={{ 
          transition: 'transform 0.3s ease', 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
        }}>▼</span>
      </div>
      
      {/* Контейнер з анімацією виїзду */}
      <div style={{
        maxHeight: isOpen ? '400px' : '0',
        opacity: isOpen ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s ease-in-out, opacity 0.3s ease, margin 0.3s ease',
        marginTop: isOpen ? '10px' : '0'
      }}>
        <div style={dropdownListStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

// --- СТИЛІ ---
const resetBtnStyle = { 
  width: '100%', marginTop: '15px', padding: '12px', background: 'white', color: '#e74c3c', 
  border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s'
};

const applyBtnStyle = { 
  width: '100%', marginTop: '10px', padding: '12px', background: '#27ae60', 
  color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
};

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 };
const modalStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%', maxHeight: '80vh', position: 'relative', display: 'flex', flexDirection: 'column', color: '#333', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' };
const filterContainerStyle = { 
  overflowY: 'auto', 
  paddingRight: '10px',
  marginTop: '25px' 
};
const filterSectionStyle = { borderBottom: '1px solid #eee', padding: '15px 0' };
const sectionHeaderStyle = { display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 'bold', color: '#2c3e50', padding: '5px 0' };
const dropdownListStyle = { display: 'flex', flexDirection: 'column', padding: '10px', background: '#f1f1f1', borderRadius: '5px', color: '#333' };
const labelStyle = { margin: '8px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '14px' };
const inputStyle = { padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ddd' };
const closeBtnStyle = { position: 'absolute', top: '10px', right: '15px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#333' };
const checkboxLabelStyle = { padding: '15px 0', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', cursor: 'pointer', color: '#333', userSelect: 'none' };

const styleTag = (
  <style>
    {`
      .reset-button:hover {
        background-color: #e74c3c !important;
        color: white !important;
        border-color: #e74c3c !important;
      }
    `}
  </style>
);

const modalAnimationStyles = (
  <style>
    {`
      /* Анімація для темного фону — просто плавна прозорість */
      @keyframes overlayFade {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* Анімація для самого вікна — м'який виїзд вгору + збільшення */
      @keyframes modalSlideUp {
        from { 
          opacity: 0; 
          transform: translateY(20px) scale(0.98); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0) scale(1); 
        }
      }

      .modal-overlay {
        animation: overlayFade 0.3s ease-out;
        backdrop-filter: blur(3px); /* Додаємо легке розмиття фону для елітності */
      }

      .modal-overlay > div {
        animation: modalSlideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      }
    `}
  </style>
);

export default FiltersModal;