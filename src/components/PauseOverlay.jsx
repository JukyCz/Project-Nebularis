// src/components/PauseOverlay.jsx

import React from 'react';
import '../styles/Overlay.css';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

function PauseOverlay({ onResume, onReturnToMenu }) {
    const { T } = useContext(LanguageContext);

    return (
        <div className="pause-overlay">
            <div className="pause-container">
                <h2 className="pause-title">{T.pause}</h2>
                <button className="pause-button" onClick={onResume}>{T.resume}</button>
                <button className="pause-button" onClick={onReturnToMenu}>{T.mainMenu}</button>
            </div>
        </div>
    );
}

export default PauseOverlay;