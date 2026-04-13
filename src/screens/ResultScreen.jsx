import React, { useMemo } from 'react';
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

  const imageFilename = resultTrait !== "Unknown" 
    ? `/assets/results/${resultTrait.replace(/\s+/g, '')}.webp`
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#1c1c1c' }}>
      {imageFilename && (
        <img 
          src={imageFilename} 
          alt={`${resultTrait} Result`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      )}
    </div>
  );
}

export default ResultScreen;
