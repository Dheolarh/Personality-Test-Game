import React, { useState, useEffect } from 'react';
import LandingScreen from './screens/LandingScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import ResultScreen from './screens/ResultScreen';
import { questionsData, resultImages } from './data/questions';

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userData, setUserData] = useState(null);
  const [answers, setAnswers] = useState({});

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
          img.onerror = resolve;
        });
      }
    };
    preloadSequentially();
  }, []);

  const handleStartGame = (data) => {
    setUserData(data);
    setCurrentScreen('questionnaire');
  };

  const handleQuestionnaireComplete = (finalAnswers) => {
    setAnswers(finalAnswers);
    setCurrentScreen('result');
  };

  return (
    <div className={`app-root ${currentScreen === 'questionnaire' ? 'bg-yellow' : 'bg-dark'}`}>
      {currentScreen === 'landing' && <LandingScreen onStart={handleStartGame} />}
      {currentScreen === 'questionnaire' && <QuestionnaireScreen userData={userData} onComplete={handleQuestionnaireComplete} />}
      {currentScreen === 'result' && <ResultScreen userData={userData} answers={answers} />}
    </div>
  );
}

export default App;
