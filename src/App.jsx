import React, { useState, useEffect } from 'react';
import LandingScreen from './screens/LandingScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import ResultScreen from './screens/ResultScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userData, setUserData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [scale, setScale] = useState(1);

  // Lock proportion aspect-ratio scaling mapping natively
  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 430;
      const scaleY = window.innerHeight / 932;
      setScale(Math.min(scaleX, scaleY)); 
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
        width: '430px',
        height: '932px',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        flexShrink: 0
      }}>
        {currentScreen === 'landing' && <LandingScreen onStart={handleStartGame} />}
        {currentScreen === 'questionnaire' && <QuestionnaireScreen userData={userData} onComplete={handleQuestionnaireComplete} />}
        {currentScreen === 'result' && <ResultScreen userData={userData} answers={answers} />}
      </div>
    </div>
  );
}

export default App;
