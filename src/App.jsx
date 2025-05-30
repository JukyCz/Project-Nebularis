import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import GameCanvas from './components/GameCanvas';
import GameOverScreen from './components/GameOverScreen';
import Settings from './components/Settings';
import { LanguageProvider } from './context/LanguageContext';

function App() {
    const [screen, setScreen] = useState('menu');
    const [finalScore, setFinalScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const storedHighScore = localStorage.getItem('highScore');
        return storedHighScore ? parseInt(storedHighScore) : 0;
    });

    useEffect(() => {
        if (localStorage.getItem('highScore') === null) {
            localStorage.setItem('highScore', '0');
        }
    }, []);

    const handleStartGame = () => {
        setScreen('game');
    };

    const handleGoToMainMenu = () => {
        setScreen('menu');
    };

    const handleGoToSettings = () => {
        setScreen('settings');
    };

    const handleGameOver = (score) => {
        setFinalScore(score);
        let newHighScore = highScore;
        if (score > highScore) {
            newHighScore = score;
            localStorage.setItem('highScore', score);
            setHighScore(newHighScore);
        }
        setScreen('gameover');
    };

    return (
        <LanguageProvider>
            {screen === 'menu' && (
                <Menu onStart={handleStartGame} onSettings={handleGoToSettings} highScore={highScore} />
            )}

            {screen === 'game' && (

                <GameCanvas

                    onGameOver={handleGameOver}
                    onReturnToMainMenu={handleGoToMainMenu}
                />
            )}

            {screen === 'gameover' && (
                <GameOverScreen
                    score={finalScore}
                    onMainMenu={handleGoToMainMenu}
                />
            )}

            {screen === 'settings' && (
                <Settings
                    onBack={handleGoToMainMenu}
                />
            )}
        </LanguageProvider>
    );
}

export default App;