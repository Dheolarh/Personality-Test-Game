import React, { useState } from 'react';
import Header from '../components/Header';
import { saveUserToSheet } from '../services/db';

const LandingScreen = ({ onStart, onTest, isDebug }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', location: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isWarning, setIsWarning] = useState(false);

  const traits = ['Early Achiever', 'Comfort Seeker', 'Culinary Alchemist', 'On the Go Hustler', 'Nostalgic Traditionalist'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) {
      setErrorMsg('');
      setIsWarning(false);
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const nameRegex = /^[a-zA-Z]{3,}\s+[a-zA-Z]{3,}(\s+[a-zA-Z]{3,})?$/;
    
    if (!trimmedName) { 
      setErrorMsg('Please enter your full name.'); 
      setIsWarning(false);
      return; 
    }
    
    if (!nameRegex.test(trimmedName)) {
      setErrorMsg('Please enter 2 or 3 names (at least 3 letters each).');
      setIsWarning(false);
      return;
    }

    if (!formData.phone) { setErrorMsg('Please enter your phone number.'); setIsWarning(false); return; }
    if (!formData.location) { setErrorMsg('Please enter your location.'); setIsWarning(false); return; }

    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (digitsOnly.length !== 11) {
      setErrorMsg('Phone number must be exactly 11 digits (e.g., 08012345678).');
      setIsWarning(false);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setIsWarning(false);

    try {
      const result = await saveUserToSheet(formData);
      if (result.success) {
        if (result.isDuplicate) {
          setErrorMsg(result.message || 'Welcome Back!');
          setIsWarning(true);
          // Auto-proceed after 1.5s
          setTimeout(() => {
            onStart(formData);
          }, 1500);
        } else {
          onStart(formData);
        }
      } else {
        setErrorMsg(result.message || 'Something went wrong. Please try again.');
        setIsSubmitting(false);
        setIsWarning(false);
      }
    } catch (error) {
      setErrorMsg('Connection error. Please check your internet.');
      setIsSubmitting(false);
      setIsWarning(false);
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
            placeholder="e.g. Lagos, Nigeria"
            required
            disabled={isSubmitting}
          />
        </div>

        {errorMsg && (
          <div style={{ 
            color: isWarning ? '#fbbc05' : '#ff4d4d', 
            fontSize: 'clamp(10px, 2.8vw, 12px)', 
            textAlign: 'center', 
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            {errorMsg}
          </div>
        )}

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Discover YOU!'}
        </button>

        {isDebug && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              type="button"
              onClick={() => onTest(traits[0])}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontSize: '10px',
                padding: '5px 10px',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              TEST RESULTS
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default LandingScreen;
