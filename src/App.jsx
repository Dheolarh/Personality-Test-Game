import React, { useState, useEffect } from 'react';
import LandingScreen from './screens/LandingScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import ResultScreen from './screens/ResultScreen';
import { questionsData, resultImages } from './data/questions';

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userData, setUserData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [scale, setScale] = useState(1);

  // Background Preloading Sequence
  useEffect(() => {
    const preloadSequentially = async () => {
      const allPaths = [
        ...questionsData.map(q => q.image),
        ...resultImages
      ];

      for (const path of allPaths) {
        if (!path) continue;
        await new Promise((resolve) => {
          const img = new Image();
          img.src = path;
          img.onload = resolve;
          img.onerror = resolve; // Continue even if one fails
        });
      }
    };

    preloadSequentially();
  }, []);

  const [internalHeight, setInternalHeight] = useState(932);

  // Lock proportion aspect-ratio scaling based on width
  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 430;
      setScale(scaleX); 
      // Calculate how many "internal pixels" high the screen is at this scale
      setInternalHeight(window.innerHeight / scaleX);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartGame = (data) => {
    setUserData(data);
    setCurrentScreen('questionnaire');
  };

  const handleQuestionnaireComplete = (finalAnswers) => {
    setAnswers(finalAnswers);
    setCurrentScreen('result');
  };

  const bgClass = currentScreen === 'landing' || currentScreen === 'result' ? 'bg-dark' : 'bg-yellow';

  return (
    <div style={{ 
      width: '100vw', 
      height: '100dvh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: currentScreen === 'landing' || currentScreen === 'result' ? '#1c1c1c' : '#fbbc05',
      overflow: 'hidden'
    }}>
      <div className={`app-container ${bgClass}`} style={{
        width: currentScreen === 'result' ? '100vw' : '430px',
        height: currentScreen === 'result' ? '100dvh' : `${internalHeight}px`,
        transform: currentScreen === 'result' ? 'none' : `scale(${scale})`,
        transformOrigin: 'top center', // Scale from top to fill downwards
        flexShrink: 0,
        position: currentScreen === 'result' ? 'fixed' : 'relative',
        zIndex: currentScreen === 'result' ? 2000 : 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {currentScreen === 'landing' && <LandingScreen onStart={handleStartGame} />}
        {currentScreen === 'questionnaire' && <QuestionnaireScreen userData={userData} onComplete={handleQuestionnaireComplete} />}
        {currentScreen === 'result' && <ResultScreen userData={userData} answers={answers} />}
      </div>
    </div>
  );
}

export default App;
