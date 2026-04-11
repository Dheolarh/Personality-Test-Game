import React from 'react';

const Header = ({ overlay }) => {
  return (
    <div className={`header-container ${overlay ? 'header-overlay' : ''}`} style={overlay ? { padding: '15px 40px' } : {}}>
      <img src="/assets/logo.webp" alt="Golden Penny Logo" className="logo-left" style={overlay ? { width: '70px'} : {}} />
      <img src="/assets/foodFest.png" alt="FoodFest Logo" className="logo-right" style={overlay ? { width: '100px'} : {}} />
    </div>
  );
};

export default Header;
