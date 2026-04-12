import React, { useState } from 'react';
import Header from '../components/Header';
import { questionsData } from '../data/questions';

const QuestionnaireScreen = ({ userData, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const handleOptionSelect = (optionId) => {
    // If clicking the currently highlighted option, lock it in and advance!
    if (selectedOptionId === optionId) {
      const qId = questionsData[currentQuestionIndex].id;
      const newAnswers = { ...answers, [qId]: optionId };
      setAnswers(newAnswers);
      setSelectedOptionId(null); // Clear selected state for the next question

      if (currentQuestionIndex < questionsData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        onComplete(newAnswers); // trigger completion flow!
      }
    } else {
      // First click: just vividly highlight it 
      setSelectedOptionId(optionId);
    }
  };

  const currentQ = questionsData[currentQuestionIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <Header overlay={true} />
      
      {/* Dynamic image based on active question */}
      <img src={currentQ.image} alt={`Q${currentQ.id} Header Photo`} className="question-header-image" />
      
      <div className="question-card-wrapper">
        <div className="question-box">
          <div className="q-badge">Q{currentQ.id}</div>
          {currentQ.question}
        </div>
      </div>

      <div className="options-container">
        {currentQ.options.map((opt) => (
          <div 
            className={`option-row ${selectedOptionId === opt.id ? 'selected' : ''}`} 
            key={opt.id} 
            onClick={() => handleOptionSelect(opt.id)}
          >
             <div className="option-badge">{opt.id}</div>
             <div className="option-text">{opt.text}</div>
          </div>
        ))}
      </div>

      <div className="footer-banner" style={{ display: 'flex', justifyContent: 'center' }}>
        <img src="/assets/homeOfGoodFood.webp" alt="The Home of Good Food banner" style={{ width: '90%', objectFit: 'contain' }} />
      </div>
    </div>
  );
};

export default QuestionnaireScreen;
