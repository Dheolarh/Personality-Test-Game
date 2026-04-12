import React from 'react';
import Header from '../components/Header';

function ResultScreen({ userData, answers }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
      <Header />
      
      <div style={{ color: 'white', marginTop: '40px', padding: '0 20px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>ANALYSIS COMPLETE</h1>
        <p style={{ marginTop: '20px', fontSize: '18px' }}>
          Great job, {userData?.name || 'Player'}!
        </p>
        <p style={{ marginTop: '10px' }}>
          We've recorded your {Object.keys(answers || {}).length} answers.
        </p>
        <p style={{ marginTop: '30px', color: 'var(--color-yellow)' }}>
          (Still working on this part)
        </p>
      </div>

    </div>
  );
}

export default ResultScreen;
