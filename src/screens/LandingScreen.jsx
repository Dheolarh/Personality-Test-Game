import React, { useState } from 'react';
import Header from '../components/Header';
import { saveUserToSheet } from '../services/db';

const LandingScreen = ({ onStart, onDebugResult }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', location: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleStart = async (e) => {
    e.preventDefault();

    // Strict validation: Exactly two names, each at least 2 characters
    const trimmedName = formData.name.trim();
    const nameRegex = /^[a-zA-Z]{2,}\s+[a-zA-Z]{2,}$/;
    
    if (!trimmedName) { 
      setErrorMsg('Please enter your full name.'); 
      return; 
    }
    
    if (!nameRegex.test(trimmedName)) {
      setErrorMsg('Please enter both First and Last name (at least 2 letters each).');
      return;
    }

    if (!formData.phone) { setErrorMsg('Please enter your phone number.'); return; }
    if (!formData.location) { setErrorMsg('Please enter your location.'); return; }

    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (digitsOnly.length !== 11) {
      setErrorMsg('Phone number must be exactly 11 digits (e.g., 08012345678).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const result = await saveUserToSheet(formData);
      if (result.success) {
        onStart(formData);
      } else {
        setErrorMsg(result.message || 'Something went wrong. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      setErrorMsg('Connection error. Please check your internet.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
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

      <form className="form-container" onSubmit={handleStart} noValidate>
        <div className="form-group">
          <div className="form-label">Name</div>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Firstname Lastname"
            title="Please enter your First and Last name"
            required
            disabled={isSubmitting}
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
            placeholder="08012345678"
            maxLength="11"
            title="Please enter your 11-digit phone number"
            required
            disabled={isSubmitting}
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
            placeholder="Ikeja, Lagos"
            required
            disabled={isSubmitting}
          />
        </div>

        {errorMsg && (
          <div style={{ color: '#ff4d4d', fontSize: 'clamp(10px, 2.8vw, 12px)', textAlign: 'center', fontWeight: 'bold' }}>
            {errorMsg}
          </div>
        )}

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Discover YOU!'}
        </button>

        <button 
          type="button" 
          onClick={onDebugResult} 
          style={{
            marginTop: '15px',
            background: 'transparent',
            color: '#fbbc05',
            border: '1px solid #fbbc05',
            padding: '10px',
            borderRadius: '25px',
            fontSize: '11px',
            cursor: 'pointer',
            opacity: 0.8,
            width: '100%',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          DEBUG: VIEW RESULTS
        </button>
      </form>
    </>
  );
};

export default LandingScreen;
