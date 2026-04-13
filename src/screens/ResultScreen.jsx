import React, { useMemo, useState, useEffect } from 'react';
import { questionsData } from '../data/questions';
import ConfettiExplosion from 'react-confetti-explosion';

function ResultScreen({ userData, answers }) {
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    setIsExploding(true);
  }, []);

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

  const imageFilename = resultTrait !== "Unknown" 
    ? `/assets/results/${resultTrait.replace(/\s+/g, '')}.webp`
    : null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100dvh', 
      backgroundColor: '#1c1c1c',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {isExploding && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 10 
        }}>
          <ConfettiExplosion 
            force={0.8}
            duration={3000}
            particleCount={250}
            width={1600}
            colors={['#fbbc05', '#688e40', '#ffffff', '#17385c']}
          />
        </div>
      )}
      
      {imageFilename && (
        <img 
          src={imageFilename} 
          alt={`${resultTrait} Result`} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            display: 'block'
          }} 
        />
      )}
    </div>
  );
}

export default ResultScreen;
