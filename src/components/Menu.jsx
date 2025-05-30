import React, { useEffect, useContext, useState } from 'react';
import '../styles/Menu.css';
import { LanguageContext } from '../context/LanguageContext';
import Upgrades from './Upgrades';
import AboutMe from './AboutMe';

const Menu = ({ onStart, onSettings, highScore }) => {
    const { T } = useContext(LanguageContext);
    const [showUpgrades, setShowUpgrades] = useState(false);
    const [showAboutMe, setShowAboutMe] = useState(false);
    console.log("Hodnota highScore v Menu:", highScore);

    useEffect(() => {
        const createStars = () => {
            const starContainer = document.querySelector(".stars");
            if (!starContainer) return;
            starContainer.innerHTML = ''; // Vyčistíme stávající hvězdy
            for (let i = 0; i < 100; i++) {
                const star = document.createElement("div");
                star.classList.add("twinkle-star");
                star.style.top = Math.random() * 100 + "vh";
                star.style.left = Math.random() * 100 + "vw";
                star.style.animationDuration = (Math.random() * 2 + 1) + "s";
                starContainer.appendChild(star);
            }
        };

        createStars();

        // Interval pro asteroidy
        const asteroidIntervalId = setInterval(() => {
            const asteroid = document.createElement('div');
            asteroid.classList.add('asteroid');
            asteroid.style.left = Math.random() * window.innerWidth + "px";
            asteroid.style.top = Math.random() * window.innerHeight + "px";
            asteroid.style.animationDuration = (Math.random() * 5 + 3) + "s";
            document.body.appendChild(asteroid);
            // Zde vracíme setTimeout, aby se každý asteroid po své době odstranil
            setTimeout(() => asteroid.remove(), 8000); // Asteroidy zmizí po x sekundách
        }, 600); // Nová frekvence: každých 600 ms

        // Interval pro komety
        const cometIntervalId = setInterval(() => {
            const comet = document.createElement('div');
            comet.classList.add('comet');
            comet.style.left = "-50px";
            comet.style.top = Math.random() * window.innerHeight + "px";
            document.body.appendChild(comet);
            // Zde vracíme setTimeout, aby se každá kometa po své době odstranila
            setTimeout(() => comet.remove(), 10000); // Komety zmizí po x sekundách
        }, 15000); // Nová frekvence: každých 15000 ms

        // Cleanup funkce
        return () => {
            clearInterval(asteroidIntervalId);
            clearInterval(cometIntervalId);
            document.querySelectorAll('.asteroid').forEach(el => el.remove());
            document.querySelectorAll('.comet').forEach(el => el.remove());
            document.querySelectorAll('.twinkle-star').forEach(el => el.remove());
            const starContainer = document.querySelector(".stars");
            if (starContainer) {
                starContainer.innerHTML = '';
            }
        };
    }, []); // Efekt se spustí jen jednou při mountu a vyčistí při unmountu

    const handleUpgradesClick = () => {
        setShowUpgrades(true);
    };

    const handleCloseUpgrades = () => {
        setShowUpgrades(false);
    };

    const handleAboutMeClick = () => {
        setShowAboutMe(true);
    };

    const handleCloseAboutMe = () => {
        setShowAboutMe(false);
    };

    return (
        <>
            <div className="stars"></div>
            <div className="background-container">
                <div className="planet">
                    <div className="city-lights"></div>
                    <div className="moon"></div>
                </div>
                <div className="wormhole"></div>
                <div className="star"></div>
            </div>

            <div className="menu-container">
                <h1 className="menu-title">Project: Nebularis</h1>
                <div className="menu-buttons">
                    <button className="menu-button" onClick={onStart}>{T.start}</button>
                    <button className="menu-button" onClick={onSettings}>{T.settings}</button>
                    <button className="menu-button" onClick={handleUpgradesClick}>{T.upgrades}</button>
                </div>
                <p className="high-score">{T.highScore}: {highScore}</p>
                <button className="menu-button" onClick={handleAboutMeClick}>{T.aboutMe}</button>
            </div>

            {showUpgrades && <Upgrades onClose={handleCloseUpgrades} />}
            {showAboutMe && <AboutMe onClose={handleCloseAboutMe} />}
        </>
    );
};

export default Menu;