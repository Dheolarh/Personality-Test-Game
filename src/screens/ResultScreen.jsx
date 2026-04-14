import React, { useMemo, useState, useEffect } from 'react';
import { questionsData } from '../data/questions';
import ConfettiExplosion from 'react-confetti-explosion';

const traitToFolder = {
  'Early Achiever': 'Achiever',
  'Comfort Seeker': 'Comfort',
  'Culinary Alchemist': 'Culinary',
  'On the Go Hustler': 'Hustler',
  'Nostalgic Traditionalist': 'Traditional'
};

const traitToPersona = {
  'Early Achiever': 'man.webp',
  'Comfort Seeker': 'man.webp',
  'Culinary Alchemist': 'chef.webp',
  'On the Go Hustler': 'woman.webp',
  'Nostalgic Traditionalist': 'woman.webp'
};

const traitToColors = {
  'Early Achiever': ['#5D4037', '#ffffff', '#688e40', '#fbbc05'],
  'Comfort Seeker': ['#87CEEB', '#00008B', '#ffffff', '#90EE90'],
  'Culinary Alchemist': ['#d32f2f', '#5D4037', '#FFFDD0', '#ffffff'],
  'On the Go Hustler': ['#8B0000', '#fbbc05', '#000000', '#ffffff'],
  'Default': ['#fbbc05', '#688e40', '#ffffff', '#17385c']
};

const traitList = Object.keys(traitToFolder);

function ResultScreen({ userData, answers, debugTrait, setDebugTrait }) {
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
    if (debugTrait) return debugTrait;

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
  }, [answers, debugTrait]);

  const folderName = traitToFolder[resultTrait] || 'Achiever';
  const personaFile = traitToPersona[resultTrait] || 'man.webp';
  const basePath = `/assets/results/${folderName}`;

  const handleCycleResult = () => {
    const currentIndex = traitList.indexOf(resultTrait);
    const nextIndex = (currentIndex + 1) % traitList.length;
    setDebugTrait(traitList[nextIndex]);
    fireConfetti();
  };

  return (
    <>
      <div className={`result-screen result-${folderName}`}>
        <div className="result-layers">
          <img src={`${basePath}/background.webp`} className="layer-bg" alt="bg" />
          
          <div className="layers-content">
            <img src={`${basePath}/headline.webp`} className="layer-headline" alt="headline" />
            <img src={`${basePath}/${personaFile}`} className="layer-man" alt="persona" />
            <img src={`${basePath}/product.webp`} className="layer-product" alt="product" />
            <img src={`${basePath}/motivation.webp`} className="layer-motivation" alt="motivation" />
          </div>
        </div>

        <button 
          onClick={handleCycleResult}
          className="debug-cycle-btn"
        >
          SWAP RESULT ({resultTrait})
        </button>
      </div>

      {isExploding && (
        <ConfettiExplosion
          key={confettiKey}
          force={0.8}
          duration={4000}
          particleCount={250}
          width={1600}
          zIndex={99999}
          colors={traitToColors[resultTrait] || traitToColors.Default}
        />
      )}
    </>
  );
}

export default ResultScreen;
