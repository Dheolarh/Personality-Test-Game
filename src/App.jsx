import React, { useState } from 'react';
import LandingScreen from './screens/LandingScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import ResultScreen from './screens/ResultScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userData, setUserData] = useState(null);
  const [answers, setAnswers] = useState({});

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
    <div className={`app-container ${bgClass}`}>
      {currentScreen === 'landing' && <LandingScreen onStart={handleStartGame} />}
      {currentScreen === 'questionnaire' && <QuestionnaireScreen userData={userData} onComplete={handleQuestionnaireComplete} />}
      {currentScreen === 'result' && <ResultScreen userData={userData} answers={answers} />}
    </div>
  );
}

export default App;
