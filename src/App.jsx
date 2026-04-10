import React, { useState } from 'react';
import LandingScreen from './screens/LandingScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userData, setUserData] = useState(null);

  const handleStartGame = (data) => {
    setUserData(data);
    setCurrentScreen('questionnaire');
  };

  const bgClass = currentScreen === 'landing' ? 'bg-dark' : 'bg-yellow';

  return (
    <div className={`app-container ${bgClass}`}>
      {currentScreen === 'landing' && <LandingScreen onStart={handleStartGame} />}
      {currentScreen === 'questionnaire' && <QuestionnaireScreen userData={userData} />}
    </div>
  );
}

export default App;
