import React, { useContext, useState, useEffect } from 'react';
import '../styles/AboutMe.css';
import { LanguageContext } from '../context/LanguageContext';

const AboutMe = ({ onClose }) => {
    const { T, isDuckyMode, toggleDuckyMode } = useContext(LanguageContext);

    const [duckyMessage, setDuckyMessage] = useState('');

    const handleDuckClick = () => {
        toggleDuckyMode();
        // isDuckyMode v tomto momentě stále drží PŘEDCHOZÍ stav.
        if (!isDuckyMode) { // Pokud PŘED kliknutím nebyl aktivní, teď se AKTIVOVAL
            setDuckyMessage(T.duckModeActivated);
        } else { // Pokud PŘED kliknutím byl aktivní, teď se DEAKTIVOVAL
            setDuckyMessage(T.duckModeDeactivated);
        }
        setTimeout(() => setDuckyMessage(''), 3000); // Skryje zprávu po 3 sekundách
    };

    return (
        <div className="about-me-overlay">
            <div className="about-me-container">
                <h2 className="about-me-title">{T.aboutMeTitle}</h2>
                <div className="about-me-content" dangerouslySetInnerHTML={{ __html: T.aboutMeTextPlaceholder }}>
                </div>

                {duckyMessage && (
                    <div className="ducky-message-container">
                        <p className="ducky-message">{duckyMessage}</p>
                    </div>
                )}

                <div className="about-me-footer">
                    <button
                        className={`duck-button ${isDuckyMode ? 'active-ducky-mode' : ''}`}
                        onClick={handleDuckClick}
                        title={T.duckButton}
                    >
                        🦆
                    </button>

                    <button className="back-to-menu-button" onClick={onClose}>
                        {T.backToMenu}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutMe;