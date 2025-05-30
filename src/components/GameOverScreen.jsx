import React, { useContext } from 'react';
import '../styles/GameOverScreen.css';
import { LanguageContext } from '../context/LanguageContext';

function GameOverScreen({ score, onMainMenu }) {
    const { T } = useContext(LanguageContext);

    return (
        <div className="game-over-overlay">
            <div className="game-over-box">
                <h2 className="game-over-title">{T.gameOver}</h2>
                <p className="game-over-score">{T.score}: {score}</p>
                <button className="game-over-button" onClick={onMainMenu}>{T.mainMenu}</button>
            </div>
        </div>
    );
}

export default GameOverScreen;