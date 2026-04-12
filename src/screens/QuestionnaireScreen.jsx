import React from 'react';
import Header from '../components/Header';

const QuestionnaireScreen = ({ userData }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <Header overlay={true} />
      
      {/* Placeholder for the sleeping guy image */}
      <img src="https://placehold.co/400x250/cccccc/333333?text=Sleeping+Guy+Image" alt="Top Graphic" className="question-header-image" />
      
      <div className="question-card-wrapper">
        <div className="question-box">
          <div className="q-badge">Q1</div>
          Your alarm goes off at 6:00 AM. What's your first move?
        </div>
      </div>

      <div className="options-container">
        <div className="option-row">
          <div className="option-badge">A</div>
          <div className="option-text">Jump up and start prepping a solid breakfast</div>
        </div>
        <div className="option-row">
          <div className="option-badge">B</div>
          <div className="option-text">Hit snooze; I need five more minutes of peace</div>
        </div>
        <div className="option-row">
          <div className="option-badge">C</div>
          <div className="option-text">Check my emails/notifications immediately</div>
        </div>
        <div className="option-row">
          <div className="option-badge">D</div>
          <div className="option-text">Think about what I'm having for dinner tonight</div>
        </div>
      </div>

      <div className="footer-banner" style={{ display: 'flex', justifyContent: 'center' }}>
        <img src="/assets/homeOfGoodFood.webp" alt="The Home of Good Food banner" style={{ width: '90%', objectFit: 'contain' }} />
      </div>
    </div>
  );
};

export default QuestionnaireScreen;
