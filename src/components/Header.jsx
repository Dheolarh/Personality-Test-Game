import React from 'react';

const Header = ({ overlay }) => {
  return (
    <div className={`header-container ${overlay ? 'header-overlay' : ''}`}>
      <img src="/assets/logo.webp" alt="Golden Penny Logo" className="logo-left" />
      <img src="/assets/foodFest.png" alt="FoodFest Logo" className="logo-right" />
    </div>
  );
};

export default Header;
