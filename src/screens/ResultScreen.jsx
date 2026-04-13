import React, { useMemo, useState, useEffect } from 'react';
import { questionsData } from '../data/questions';
import ConfettiExplosion from 'react-confetti-explosion';

function ResultScreen({ userData, answers }) {
  const [isExploding, setIsExploding] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const fireConfetti = () => {
    // Re-trigger explosion
    setIsExploding(false);
    setTimeout(() => {
      setConfettiKey(prev => prev + 1);
      setIsExploding(true);
      const audio = new Audio('/assets/sound/confetti sfx.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    }, 50);
  };

  useEffect(() => {
    fireConfetti();
  }, []);

  const resultTrait = useMemo(() => {
    const tally = {};
    let maxCount = 0;
    let firstToReachMax = 'Unknown';

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

  const imageFilename = resultTrait !== 'Unknown'
    ? `/assets/results/${resultTrait.replace(/\s+/g, '')}.webp`
    : null;

  return (
    <>
      <div className="result-screen">
        {imageFilename && (
          <img
            src={imageFilename}
            alt={`${resultTrait} Result`}
            className="result-image"
          />
        )}
      </div>

      {isExploding && (
        <ConfettiExplosion
          key={confettiKey}
          force={0.8}
          duration={3000}
          particleCount={250}
          width={1600}
          zIndex={99999}
          colors={['#fbbc05', '#688e40', '#ffffff', '#17385c']}
        />
      )}

    </>
  );
}

export default ResultScreen;
