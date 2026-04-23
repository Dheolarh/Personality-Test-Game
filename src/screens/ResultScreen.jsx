import React, { useMemo, useState, useEffect } from 'react';
import { questionsData } from '../data/questions';
import ConfettiExplosion from 'react-confetti-explosion';
import { toPng } from 'html-to-image';

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
  'Early Achiever': ['#e0e773ff', '#ffffff', '#688e40', '#fbbc05'],
  'Comfort Seeker': ['#f78708ff', '#662c2c', '#ffffff', '#90EE90'],
  'Culinary Alchemist': ['#c20909ff', '#0c613f', '#FFFDD0', '#dea53c'],
  'On the Go Hustler': ['#8B0000', '#fbbc05', '#eb8501ff', '#ffffff'],
  'Nostalgic Traditionalist': ['#0c613f', '#8B4513', '#FFFDD0', '#D4AF37'],
  'Default': ['#fbbc05', '#688e40', '#ffffff', '#17385c']
};

const traits = ['Early Achiever', 'Comfort Seeker', 'Culinary Alchemist', 'On the Go Hustler', 'Nostalgic Traditionalist'];

const traitToShareColor = {
  'Early Achiever': '#688e40',
  'Comfort Seeker': '#662c2c',
  'Culinary Alchemist': '#de4f3cff',
  'On the Go Hustler': '#f7b708ff',
  'Nostalgic Traditionalist': '#0c613f'
};

const traitToShareText = {
  'Culinary Alchemist': "I'm a Master of Flavour",
  'Comfort Seeker': "I'm a Comfort Seeker",
  'Early Achiever': "I'm an Early Achiever",
  'On the Go Hustler': "I'm an On The Go Hustler",
  'Nostalgic Traditionalist': "I'm a Culture Custodian"
};

const hashtags = ['#GoldenPennyFoodFest'];

function ResultScreen({ userData, answers, debugTrait, setDebugTrait, isDebug, onRestart }) {
  const [isExploding, setIsExploding] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const handleNextTrait = () => {
    const currentIndex = traits.indexOf(debugTrait || 'Early Achiever');
    const nextIndex = (currentIndex + 1) % traits.length;
    setDebugTrait(traits[nextIndex]);
    fireConfetti();
  };

  const fireConfetti = () => {
    // Re-trigger explosion
    setIsExploding(false);
    setTimeout(() => {
      setConfettiKey(prev => prev + 1);
      setIsExploding(true);
      const audio = new Audio('/assets/sound/confetti sfx.mp3');
      audio.volume = 0.25; // Set volume to 25%
      audio.loop = false;  // Ensure it doesn't loop
      audio.play().catch(e => console.log('Audio play failed:', e));
    }, 50);
  };

  useEffect(() => {
    fireConfetti();
  }, []);

  const handleShare = async () => {
    const element = document.getElementById('capture-result');
    if (!element) return;

    const hideEls = document.querySelectorAll('.hide-on-capture');
    hideEls.forEach(el => el.style.opacity = '0');

    try {
      // iOS Safari has a known bug where it doesn't wait for images to load 
      // inside the SVG foreignObject, resulting in a black background.
      // The standard workaround is to call toPng twice (first caches, second captures).
      await toPng(element, { pixelRatio: 2 });
      const dataUrl = await toPng(element, { pixelRatio: 2 });
      
      hideEls.forEach(el => el.style.opacity = '1');

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const filename = `${resultTrait || 'Result'}.png`.replace(/\s+/g, '_');
      const file = new File([blob], filename, { type: 'image/png' });

      // In many mobile scenarios over local Wi-Fi, navigator.share is undefined 
      // because the spec requires a Secure Context (HTTPS). 
      // It works on standard localhost or real deployed https sites.
      if (typeof navigator.share !== 'undefined') {
        try {
          const traitText = traitToShareText[resultTrait] || `I'm a ${resultTrait}`;
          const hashtagString = hashtags && hashtags.length > 0 ? `\n${hashtags.join(' ')}` : '';
          const shareText = `Check out my personality result: ${traitText}!${hashtagString}`;

          await navigator.share({
            title: 'My Personality Result',
            text: shareText,
            files: [file]
          });
        } catch (shareErr) {
          console.error("Error from navigator.share:", shareErr);
          // If the user cancelled, AbortError is thrown. We don't want to auto-download if they just cancelled.
          if (shareErr.name !== 'AbortError') {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      } else {
        // Fallback for non-secure contexts (like testing on local IP) or unsupported browsers
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting/sharing image:', error);
      hideEls.forEach(el => el.style.opacity = '1');
    }
  };

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

    return debugTrait || firstToReachMax;
  }, [answers, debugTrait]);

  const folderName = traitToFolder[resultTrait] || 'Achiever';
  const personaFile = traitToPersona[resultTrait] || 'man.webp';
  const basePath = `/assets/results/${folderName}`;

  return (
    <>
      <div id="capture-result" className={`result-screen result-${folderName}`}>
        {/* Debug Controls Overlay */}
        {isDebug && (
          <div className="hide-on-capture" style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <button 
              onClick={handleNextTrait}
              style={{
                background: '#fbbc05',
                color: '#17385c',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}
            >
              SWAP RESULT 🔄
            </button>
            <button 
              onClick={onRestart}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid white',
                padding: '8px 12px',
                borderRadius: '5px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              EXIT TEST ×
            </button>
          </div>
        )}

        <button 
          className="hide-on-capture"
          onClick={handleShare}
          style={{
            position: 'absolute',
            top: '20px',
            right: isDebug ? '150px' : '20px',
            zIndex: 10000,
            background: traitToShareColor[resultTrait] || '#fbbc05',
            color: '#fff',
            border: '2px solid white',
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
        </button>

        <div className="result-layers">
          <img src={`${basePath}/background.webp`} className="layer-bg" alt="bg" />
          
          <div className="layers-content">
            <img src={`${basePath}/headline.webp`} className="layer-headline" alt="headline" />
            <img src={`${basePath}/${personaFile}`} className="layer-man" alt="persona" />
            {resultTrait === 'Culinary Alchemist' && (
              <img src={`${basePath}/ingredients.webp`} className="layer-ingredients" alt="ingredients" />
            )}
            <img src={`${basePath}/product.webp`} className="layer-product" alt="product" />
            <img src={`${basePath}/motivation.webp`} className="layer-motivation" alt="motivation" />
          </div>
        </div>
      </div>

      {isExploding && (
        <ConfettiExplosion
          key={confettiKey}
          force={0.8}
          duration={10000}
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
