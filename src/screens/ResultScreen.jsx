import React, { useMemo } from 'react';
import Header from '../components/Header';
import { questionsData } from '../data/questions';

function ResultScreen({ userData, answers }) {
  const resultTrait = useMemo(() => {
    const tally = {};
    let maxCount = 0;
    let firstToReachMax = "Unknown";

    // Sort the keys so we process them chronologically (1..10)
    const sortedQIds = Object.keys(answers || {}).map(Number).sort((a, b) => a - b);

    sortedQIds.forEach(qId => {
      const optionId = answers[String(qId)];
      const question = questionsData.find(q => q.id === qId);
      if (question) {
        const option = question.options.find(opt => opt.id === optionId);
        if (option && option.trait) {
          tally[option.trait] = (tally[option.trait] || 0) + 1;
          
          if (tally[option.trait] > maxCount) {
            maxCount = tally[option.trait];
            firstToReachMax = option.trait;
          }
        }
      }
    });

    return firstToReachMax;
  }, [answers]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
      <Header />
      
      <div style={{ color: 'white', marginTop: '40px', padding: '0 20px', textAlign: 'center', width: '100%' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-yellow)', fontSize: '2.5rem' }}>YOUR CHARACTER CODE</h1>
        <p style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          {userData?.name || 'Player'}, you are a...
        </p>
        <div style={{ 
          marginTop: '30px', 
          backgroundColor: 'white', 
          color: '#17385c', 
          padding: '30px 20px', 
          borderRadius: '16px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: 0, color: 'var(--color-green)', lineHeight: 1.1 }}>
            {resultTrait.toUpperCase()}
          </h2>
          <div style={{ width: '50px', height: '4px', backgroundColor: 'var(--color-yellow)', borderRadius: '2px' }}></div>
        </div>
      </div>

      <div className="footer-banner" style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', paddingBottom: '20px' }}>
        <img src="/assets/homeOfGoodFood.webp" alt="The Home of Good Food banner" style={{ width: '90%', objectFit: 'contain' }} />
      </div>
    </div>
  );
}

export default ResultScreen;
