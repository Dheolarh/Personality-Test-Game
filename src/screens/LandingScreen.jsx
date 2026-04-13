import React, { useState } from 'react';
import Header from '../components/Header';
import { saveUserToSheet } from '../services/db';

const LandingScreen = ({ onStart }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', location: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg(''); // Clear error when typing
  };

  const handleStart = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!formData.name) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.phone) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    if (!formData.location) {
      setErrorMsg('Please enter your location.');
      return;
    }

    // Name regex validation
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(formData.name)) {
      setErrorMsg('Names should only contain letters and spaces.');
      return;
    }

    // Phone length validation
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
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
            placeholder="Adebayo Chukwuma Abubakar"
            title="Please use only letters for your name"
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
          <div style={{ color: '#ff4d4d', fontSize: '12px', textAlign: 'center', marginTop: '5px', fontWeight: 'bold' }}>
            {errorMsg}
          </div>
        )}

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Discover YOU!'}
        </button>
      </form>
    </div>
  );
};

export default LandingScreen;
