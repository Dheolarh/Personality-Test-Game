import React, { useState, useEffect, useRef } from 'react';
import LandingScreen from './screens/LandingScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import ResultScreen from './screens/ResultScreen';
import { questionsData, resultImages } from './data/questions';

const IS_DEBUG = true;

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userData, setUserData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [debugTrait, setDebugTrait] = useState(null);
  const bgAudioRef = useRef(null);

  // Background Audio Initialization & Loop Logic
  useEffect(() => {
    const audio = new Audio('/assets/sound/background.mp3');
    audio.volume = 0.5;
    
    const handleEnded = () => {
      setTimeout(() => {
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(e => console.log('Background audio loop failed:', e));
        }
      }, 10000); // 10-second delay after end
    };

    audio.addEventListener('ended', handleEnded);
    bgAudioRef.current = audio;

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  // Trigger play when moving to questionnaire
  useEffect(() => {
    if ((currentScreen === 'questionnaire' || currentScreen === 'result') && bgAudioRef.current) {
      bgAudioRef.current.play().catch(e => console.log('Background audio start failed:', e));
    }
  }, [currentScreen]);

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

  const handleTestResult = (trait) => {
    setUserData({ name: 'TEST USER', phone: '00000000000', location: 'DEBUG' });
    setDebugTrait(trait);
    setCurrentScreen('result');
  };

  const handleQuestionnaireComplete = (finalAnswers) => {
    setAnswers(finalAnswers);
    setCurrentScreen('result');
  };

  return (
    <div className={`app-root ${currentScreen === 'questionnaire' ? 'bg-yellow' : 'bg-dark'}`}>
      {currentScreen === 'landing' && (
        <LandingScreen 
          onStart={handleStartGame} 
          onTest={handleTestResult}
          isDebug={IS_DEBUG}
        />
      )}
      {currentScreen === 'questionnaire' && (
        <QuestionnaireScreen 
          userData={userData} 
          onComplete={handleQuestionnaireComplete} 
        />
      )}
      {currentScreen === 'result' && (
        <ResultScreen 
          userData={userData} 
          answers={answers} 
          debugTrait={debugTrait}
          setDebugTrait={setDebugTrait}
          isDebug={IS_DEBUG}
          onRestart={() => {
            setDebugTrait(null);
            setCurrentScreen('landing');
          }}
        />
      )}
    </div>
  );
}

export default App;
