import React, { useContext, useRef, useEffect, useState } from 'react';
import { LanguageContext, DEFAULT_COLORS } from '../context/LanguageContext';
import '../styles/Menu.css';

const Settings = ({ onBack }) => {
    const { language, setLanguage, T, gameColors, saveGameColors, resetGameColors } = useContext(LanguageContext);

    const languages = [
        { code: 'cs', label: 'Čeština' },
        { code: 'en', label: 'English' },
        { code: 'pl', label: 'Polski' },
    ];

    const [playerColor, setPlayerColor] = useState(gameColors.player);
    const [bulletColor, setBulletColor] = useState(gameColors.bullet);
    const [missileColor, setMissileColor] = useState(gameColors.missile);
    const [droneColor, setDroneColor] = useState(gameColors.drone);
    const [droneBulletColor, setDroneBulletColor] = useState(gameColors.droneBullet);

    const playerCanvasRef = useRef(null);
    const bulletCanvasRef = useRef(null);
    const missileCanvasRef = useRef(null);
    const droneCanvasRef = useRef(null);
    const droneBulletCanvasRef = useRef(null);

    useEffect(() => {
        setPlayerColor(gameColors.player);
        setBulletColor(gameColors.bullet);
        setMissileColor(gameColors.missile);
        setDroneColor(gameColors.drone);
        setDroneBulletColor(gameColors.droneBullet);
    }, [gameColors]);

    useEffect(() => {
        drawPreview(playerCanvasRef.current, 'player', playerColor);
    }, [playerColor]);

    useEffect(() => {
        drawPreview(bulletCanvasRef.current, 'bullet', bulletColor);
    }, [bulletColor]);

    useEffect(() => {
        drawPreview(missileCanvasRef.current, 'missile', missileColor);
    }, [missileColor]);

    useEffect(() => {
        drawPreview(droneCanvasRef.current, 'drone', droneColor);
    }, [droneColor]);

    useEffect(() => {
        drawPreview(droneBulletCanvasRef.current, 'droneBullet', droneBulletColor);
    }, [droneBulletColor]);


    // Funkce pro vykreslení miniatury lodi/projektilu/rakety/dronu/projektilu dronu na canvasu
    const drawPreview = (canvas, type, color) => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const previewWidth = 60;
        const previewHeight = 60;
        canvas.width = previewWidth;
        canvas.height = previewHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;

        // Scale by měla být stejná nebo podobná té ve GameCanvas pro konzistenci
        const scale = previewWidth / 25; // Ponecháme stejný scale pro referenci k původním rozměrům GameCanvas

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);


        if (type === 'player') {
            // Tělo lodi
            ctx.beginPath();
            ctx.moveTo(10 * scale, 0);
            ctx.lineTo(-10 * scale, -7 * scale);
            ctx.lineTo(-10 * scale, 7 * scale);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();

            // Plamen motoru
            ctx.beginPath();
            ctx.moveTo(-10 * scale, 0);
            ctx.lineTo(-15 * scale, -5 * scale * 0.7); // Kratší plamen pro náhled
            ctx.lineTo(-15 * scale, 5 * scale * 0.7);
            ctx.closePath();
            ctx.fillStyle = 'orange';
            ctx.shadowColor = 'orange';
            ctx.shadowBlur = 5; // Menší záře pro náhled
            ctx.fill();
            ctx.shadowBlur = 0; // Reset stínu
        } else if (type === 'bullet') {
            ctx.fillStyle = color;
            ctx.shadowColor = color; // Barva záře
            ctx.shadowBlur = 10; // Intenzita záře, menší než ve hře
            ctx.fillRect(-7.5 * scale, -2 * scale, 15 * scale, 4 * scale);
            ctx.shadowBlur = 0; // Reset stínu
        } else if (type === 'missile') {
            // Dým/stopa za raketou
            ctx.fillStyle = 'rgba(255, 165, 0, 0.3)'; // Oranžový dým s průhledností, méně intenzivní
            ctx.fillRect(-3 * scale - 5 * scale, -1.5 * scale, 5 * scale, 3 * scale); // Menší dým

            // Tělo rakety (špička)
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(4 * scale, 0); // Špička
            ctx.lineTo(-6 * scale, -3 * scale); // Levý roh základny
            ctx.lineTo(-6 * scale, 3 * scale);  // Pravý roh základny
            ctx.closePath();
            ctx.fill();

            // Malé plameny na konci rakety
            ctx.fillStyle = 'orange';
            ctx.shadowColor = 'orange';
            ctx.shadowBlur = 3; // Menší záře
            ctx.beginPath();
            ctx.moveTo(-6 * scale, -2 * scale);
            ctx.lineTo(-8 * scale, 0); // Menší plamen
            ctx.lineTo(-6 * scale, 2 * scale);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
        } else if (type === 'drone') {
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 5; // Menší záře pro drony

            // Vykreslení dronu
            ctx.beginPath();
            // Tělo dronu (malý čtverec)
            ctx.fillRect(-2.5 * scale, -2.5 * scale, 5 * scale, 5 * scale);
            // "Křídla" dronu
            ctx.fillRect(-6 * scale, -1 * scale, 12 * scale, 2 * scale); // Horizontální
            ctx.fillRect(-1 * scale, -6 * scale, 2 * scale, 12 * scale); // Vertikální
            ctx.fill();

            ctx.shadowBlur = 0; // Reset stínu
        } else if (type === 'droneBullet') {
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 7; // Intenzita záře, menší než ve hře
            ctx.fillRect(-5 * scale, -1 * scale, 10 * scale, 2 * scale); // Kratší a tenčí projektil
            ctx.shadowBlur = 0; // Reset stínu
        }
        ctx.restore();
    };


    const handleSaveColors = () => {
        saveGameColors({
            player: playerColor,
            bullet: bulletColor,
            missile: missileColor,
            drone: droneColor,
            droneBullet: droneBulletColor,
        });
        alert(T.colorsSaved);
    };

    const handleResetColors = () => {
        resetGameColors();
        alert(T.colorsReset);
    };


    return (
        <div className="menu-container">
            <div className="menu-box">
                <h1 className="menu-title">{T.settings}</h1>

                {/* Sekce pro výběr jazyka */}
                <div className="settings-section">
                    <h2>{T.language}</h2>
                    <div className="language-selector">
                        {languages.map(({ code, label }) => (
                            <button
                                key={code}
                                className={`menu-button ${language === code ? 'selected' : ''}`}
                                onClick={() => setLanguage(code)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sekce pro customizaci barev */}
                <div className="settings-section color-customization">
                    <h2>{T.customizeColors}</h2>
                    <div className="color-grid">
                        {/* Loď */}
                        <div className="color-item">
                            <h3>{T.playerShip}</h3>
                            <canvas ref={playerCanvasRef} width="60" height="60"></canvas>
                            <input
                                type="color"
                                value={playerColor}
                                onChange={(e) => setPlayerColor(e.target.value)}
                            />
                        </div>

                        {/* Projektil */}
                        <div className="color-item">
                            <h3>{T.bullet}</h3>
                            <canvas ref={bulletCanvasRef} width="60" height="60"></canvas>
                            <input
                                type="color"
                                value={bulletColor}
                                onChange={(e) => setBulletColor(e.target.value)}
                            />
                        </div>

                        {/* Raketa */}
                        <div className="color-item">
                            <h3>{T.missile}</h3>
                            <canvas ref={missileCanvasRef} width="60" height="60"></canvas>
                            <input
                                type="color"
                                value={missileColor}
                                onChange={(e) => setMissileColor(e.target.value)}
                            />
                        </div>

                        {/* NOVÉ: Dron */}
                        <div className="color-item">
                            <h3>{T.droneColor}</h3>
                            <canvas ref={droneCanvasRef} width="60" height="60"></canvas>
                            <input
                                type="color"
                                value={droneColor}
                                onChange={(e) => setDroneColor(e.target.value)}
                            />
                        </div>

                        {/* NOVÉ: Projektil Dronu */}
                        <div className="color-item">
                            <h3>{T.droneBulletColor}</h3>
                            <canvas ref={droneBulletCanvasRef} width="60" height="60"></canvas>
                            <input
                                type="color"
                                value={droneBulletColor}
                                onChange={(e) => setDroneBulletColor(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="color-actions">
                        <button className="color-action-button" onClick={handleSaveColors}>{T.saveColors}</button>
                        <button className="color-action-button" onClick={handleResetColors}>{T.resetColors}</button>
                    </div>
                </div>

                {/* Tlačítko Zpět do Menu */}
                <button className="back-to-menu-button" onClick={onBack}>{T.backToMenu}</button>
            </div>
        </div>
    );
};

export default Settings;