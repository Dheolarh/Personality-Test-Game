import React, { useState } from 'react';
import Header from '../components/Header';

const LandingScreen = ({ onStart }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', location: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!formData.name) return; // Basic validation
    onStart(formData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header />

      <div className="hero-image-wrap">
        <img src="/assets/mask.webp" alt="Mask" className="hero-image" />
      </div>

      <div className="title-container">
        <div className="title-line-1">
          <span className="text-green">DECIPHER</span> <span className="text-yellow">YOUR</span>
        </div>
        <div className="title-line-2">
          <span className="text-yellow">CHARACTER</span> <span className="text-green">CODE</span>
        </div>
      </div>

      <form className="form-container" onSubmit={handleStart}>
        <div className="form-group">
          <div className="form-label">Name</div>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <div className="form-label">Phone No.</div>
          <input
            type="tel"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <div className="form-label">Location</div>
          <input
            type="text"
            name="location"
            className="form-input"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          Discover YOU!
        </button>
      </form>
    </div>
  );
};

export default LandingScreen;
