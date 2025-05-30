import React, {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
    useContext
} from 'react';
import '../styles/GameCanvas.css';
import { LanguageContext } from '../context/LanguageContext';

import PauseOverlay from './PauseOverlay';

import asteroidImage from '../assets/Asteroid 01 - Base.png';
import duckySpritesheet from '../assets/ducky_2_spritesheet.png';

const getRandom = (min, max) => Math.random() * (max - min) + min;

const ASTEROID_SIZES = {
    large: { radius: 80, speed: 0.2, score: 400, split: 'medium' },
    medium: { radius: 45, speed: 0.35, score: 200, split: 'small' },
    small: { radius: 25, speed: 1, score: 100, split: null }, // Zvýšena rychlost pro malé asteroidy
};

// Konstanty pro střelbu hráče
const BULLET_COOLDOWN = 200; // Cooldown mezi jednotlivými výstřely hráče v ms
const MAX_BULLETS_ON_SCREEN = 40; // Maximální počet projektilů hráče na obrazovce
const BULLET_SPEED = 8; // Rychlost projektilů hráče
const BULLET_LENGTH = 15; // Délka projektilů hráče

// Konstanty pro hvězdy
const NUM_STARS = 200;
const STAR_SPEED_MULTIPLIER = 0.05;

// Konstanty pro štít
const SHIELD_COOLDOWN_TIME = 10000; // x sekund v milisekundách

// Maximální povolený počet asteroidů/kačenek na obrazovce
const MAX_ASTEROIDS = 65;

// Konstanty pro upgrady střelby hráče
const LASER_UPGRADE_1_SCORE = 5000;
const LASER_UPGRADE_2_SCORE = 15000;
const LASER_UPGRADE_3_SCORE = 45000;

const LASER_FRONT_SPREAD_ANGLE_RAD = 8 * (Math.PI / 180);
const LASER_SIDE_ANGLE_RAD = 45 * (Math.PI / 180);

// NOVÉ KONSTANTY PRO DRONY
const DRONE_RADIUS = 10; // Poloměr dronu pro vykreslení a kolize
const DRONE_ORBIT_DISTANCE = 60; // Vzdálenost dronu od středu hráče
const DRONE_BASE_COOLDOWN = 2000; // Základní cooldown pro střelbu dronu (2 sekundy)
const DRONE_COOLDOWN_REDUCTION_PER_DRONE = 100; // Snížení cooldownu za každý další dron
const MAX_DRONES = 6; // Maximální počet dronů
const DRONE_INITIAL_SCORE_UNLOCK = 4000; // Skóre pro získání prvního dronu
const DRONE_SCORE_PER_ADDITIONAL_DRONE = 4000; // Skóre pro získání každého dalšího dronu
const DRONE_BULLET_SPEED = 5; // Rychlost projektilů dronů
const DRONE_BULLET_LENGTH = 10; // Délka projektilů dronů

// NOVÉ KONSTANTY PRO RAKETY
const MISSILE_SPEED = 4.0; // Rychlost rakety
const MISSILE_RADIUS = 8; // Poloměr rakety (mírně zvětšeno)
const MISSILE_TRAIL_LENGTH = 15; // Délka "dýmu" za raketou
const MISSILE_TRAIL_WIDTH = 4; // Šířka "dýmu" za raketou

const GameCanvas = forwardRef(({ onGameOver, onReturnToMainMenu }, ref) => {
    const { T, gameColors, isDuckyMode } = useContext(LanguageContext);
    const canvasRef = useRef(null);
    const asteroidsRef = useRef([]);
    const [score, setScore] = useState(0);
    const [lastLifeScore, setLastLifeScore] = useState(0);
    const keys = useRef({});
    const lastDamageTime = useRef(0);
    const damageCooldown = 1000;
    const [isPaused, setIsPaused] = useState(false);

    const asteroidImageElementRef = useRef(new Image());
    const [isAsteroidImageLoaded, setIsAsteroidImageLoaded] = useState(false);

    const duckyImageElementRef = useRef(new Image());
    const [isDuckyImageLoaded, setIsDuckyImageLoaded] = useState(false);

    const lastBulletFireTime = useRef(0);
    const spacebarPressedOnce = useRef(false);

    const starsRef = useRef([]);

    const playerRef = useRef({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        angle: 0,
        velocityX: 0,
        velocityY: 0,
        rotation: 0,
        bullets: [],
        missiles: [],
        isThrusting: false,
        health: 4,
        hasShield: true,
        lastShieldDestroyedTime: 0,
        drones: [],
        nextDroneUnlockScore: DRONE_INITIAL_SCORE_UNLOCK,
    });

    const asteroidIntervalRef = useRef(null);

    const generateStars = (width, height) => {
        const newStars = [];
        for (let i = 0; i < NUM_STARS; i++) {
            newStars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: getRandom(0.5, 2),
                speed: getRandom(0.1, 0.5)
            });
        }
        return newStars;
    };

    const spawnAsteroid = () => {
        if (asteroidsRef.current.length >= MAX_ASTEROIDS) {
            return;
        }

        const types = Object.keys(ASTEROID_SIZES);
        const type = types[Math.floor(Math.random() * types.length)];
        const { radius, speed } = ASTEROID_SIZES[type];
        const angle = getRandom(0, Math.PI * 2);
        const edge = Math.floor(Math.random() * 4);
        let x = 0, y = 0;
        if (edge === 0) { x = 0; y = Math.random() * window.innerHeight; }
        if (edge === 1) { x = window.innerWidth; y = Math.random() * window.innerHeight; }
        if (edge === 2) { y = 0; x = Math.random() * window.innerWidth; }
        if (edge === 3) { y = window.innerHeight; x = Math.random() * window.innerHeight; }

        asteroidsRef.current.push({ x, y, radius, speed, type, hp: 1, angle, rotationAngle: getRandom(0, Math.PI * 2), rotationSpeed: getRandom(-0.02, 0.02) });
    };

    useImperativeHandle(ref, () => ({
        resume: () => {
            setIsPaused(false);
        },
        pauseGame: () => {
            setIsPaused(true);
        },
        restart: () => {
            asteroidsRef.current = [];
            setScore(0);
            setLastLifeScore(0);
            playerRef.current = {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                angle: 0,
                velocityX: 0,
                velocityY: 0,
                rotation: 0,
                bullets: [],
                missiles: [],
                isThrusting: false,
                health: 4,
                hasShield: true,
                lastShieldDestroyedTime: 0,
                drones: [],
                nextDroneUnlockScore: DRONE_INITIAL_SCORE_UNLOCK,
            };
            setIsPaused(false);
            clearInterval(asteroidIntervalRef.current);
            asteroidIntervalRef.current = setInterval(spawnAsteroid, 750);
            const canvas = canvasRef.current;
            if (canvas) {
                starsRef.current = generateStars(canvas.width, canvas.height);
            }
        }
    }));

    useEffect(() => {
        asteroidImageElementRef.current.src = asteroidImage;
        asteroidImageElementRef.current.onload = () => {
            setIsAsteroidImageLoaded(true);
        };
        if (asteroidImageElementRef.current.complete && asteroidImageElementRef.current.naturalWidth > 0) {
            setIsAsteroidImageLoaded(true);
        }

        duckyImageElementRef.current.src = duckySpritesheet;
        duckyImageElementRef.current.onload = () => {
            setIsDuckyImageLoaded(true);
        };
        if (duckyImageElementRef.current.complete && duckyImageElementRef.current.naturalWidth > 0) {
            setIsDuckyImageLoaded(true);
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsPaused(prev => !prev);
            }
            if (e.key === ' ' && !keys.current[' ']) {
                spacebarPressedOnce.current = true;
            }
            keys.current[e.key.toLowerCase()] = true;
        };
        const handleKeyUp = (e) => {
            keys.current[e.key.toLowerCase()] = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            starsRef.current = generateStars(canvas.width, canvas.height);
        }

        if (!isPaused) {
            const intervalId = setInterval(spawnAsteroid, 750);
            asteroidIntervalRef.current = intervalId;
            return () => clearInterval(intervalId);
        } else {
            clearInterval(asteroidIntervalRef.current);
        }
    }, [isPaused]);


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas ? canvas.getContext('2d') : null;

        if (canvas && ctx) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            let animationFrameId;

            const update = () => {
                const p = playerRef.current;
                const accel = 0.02;
                const friction = keys.current['s'] ? 0.9 : 0.998;
                const now = Date.now();

                // Logika regenerace štítu
                if (!p.hasShield && (now - p.lastShieldDestroyedTime >= SHIELD_COOLDOWN_TIME)) {
                    p.hasShield = true;
                }

                // Aktualizace pozic hvězd
                starsRef.current.forEach(star => {
                    star.y += star.speed * STAR_SPEED_MULTIPLIER;
                    if (star.y > canvas.height) {
                        star.y = 0;
                        star.x = Math.random() * canvas.width;
                    }
                });

                if (keys.current['a']) p.rotation = -0.012;
                else if (keys.current['d']) p.rotation = 0.012;
                else p.rotation = 0;

                p.angle += p.rotation;

                if (keys.current['w']) {
                    p.velocityX += Math.cos(p.angle) * accel;
                    p.velocityY += Math.sin(p.angle) * accel;
                    p.isThrusting = true;
                } else {
                    p.isThrusting = false;
                }

                // Logika pro více střel hráče na základě skóre
                if (keys.current[' '] && !isPaused) {
                    if (p.bullets.length < MAX_BULLETS_ON_SCREEN &&
                        (spacebarPressedOnce.current || (now - lastBulletFireTime.current > BULLET_COOLDOWN))) {

                        let bulletAngles = [p.angle];
                        const currentScore = score;

                        // Ponecháme stejnou logiku pro úhly střel jako předtím
                        if (currentScore >= LASER_UPGRADE_1_SCORE) {
                            bulletAngles = [p.angle - LASER_FRONT_SPREAD_ANGLE_RAD, p.angle + LASER_FRONT_SPREAD_ANGLE_RAD];
                        }
                        if (currentScore >= LASER_UPGRADE_2_SCORE) {
                            bulletAngles = [p.angle, p.angle - LASER_FRONT_SPREAD_ANGLE_RAD, p.angle + LASER_FRONT_SPREAD_ANGLE_RAD];
                        }
                        if (currentScore >= LASER_UPGRADE_3_SCORE) {
                            bulletAngles = [
                                p.angle,
                                p.angle - LASER_FRONT_SPREAD_ANGLE_RAD,
                                p.angle + LASER_FRONT_SPREAD_ANGLE_RAD,
                                p.angle - LASER_SIDE_ANGLE_RAD,
                                p.angle + LASER_SIDE_ANGLE_RAD
                            ];
                        }

                        bulletAngles = [...new Set(bulletAngles)];

                        bulletAngles.forEach(angle => {
                            p.bullets.push({
                                x: p.x,
                                y: p.y,
                                angle: angle,
                                speed: BULLET_SPEED, // Použijeme konstantu
                                length: BULLET_LENGTH, // Použijeme konstantu
                                type: 'player'
                            });
                        });

                        lastBulletFireTime.current = now;
                        spacebarPressedOnce.current = false;
                    }
                } else {
                    spacebarPressedOnce.current = false;
                }

                // Logika pro rakety
                if (keys.current['r'] && p.missiles.length < 2 && !isPaused) {
                    const targetAsteroids = asteroidsRef.current;
                    const target = targetAsteroids.length > 0 ? targetAsteroids[0] : null;
                    if (target) {
                        const angleTo = Math.atan2(target.y - p.y, target.x - p.x);
                        p.missiles.push({
                            x: p.x,
                            y: p.y,
                            angle: angleTo,
                            speed: MISSILE_SPEED, // Použijeme konstantu
                            target,
                            locked: true
                        });
                    }
                }

                p.x += p.velocityX;
                p.y += p.velocityY;
                p.velocityX *= friction;
                p.velocityY *= friction;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.width) p.y = 0;
                if (p.y > canvas.height) p.y = 0;

                // Aktualizace projektilů hráče
                p.bullets = p.bullets.map(b => ({
                    ...b,
                    x: b.x + Math.cos(b.angle) * b.speed,
                    y: b.y + Math.sin(b.angle) * b.speed,
                })).filter(b => b.x > -20 && b.x < canvas.width + 20 && b.y > -20 && b.y < canvas.height + 20); // Rozšířený filtr pro trail efekty

                // Aktualizace projektilů dronů
                playerRef.current.drones.forEach(drone => {
                    drone.bullets = drone.bullets.map(b => ({
                        ...b,
                        x: b.x + Math.cos(b.angle) * b.speed,
                        y: b.y + Math.sin(b.angle) * b.speed,
                    })).filter(b => b.x > -20 && b.x < canvas.width + 20 && b.y > -20 && b.y < canvas.height + 20); // Rozšířený filtr
                });

                p.missiles = p.missiles.filter(m => m.target).map((m) => {
                    // Kontrola existence cíle před výpočtem
                    if (!m.target || !asteroidsRef.current.includes(m.target)) {
                        return { ...m, target: null }; // Zrušit zamknutí, pokud cíl zmizel
                    }

                    const dx = m.target.x - m.x;
                    const dy = m.target.y - m.y;
                    const desired = Math.atan2(dy, dx);
                    let delta = desired - m.angle;

                    // Normalizace úhlu delta pro nejkratší otočení
                    if (delta > Math.PI) delta -= 2 * Math.PI;
                    if (delta < -Math.PI) delta += 2 * Math.PI;

                    const turnSpeed = 0.05; // Rychlost otáčení rakety
                    m.angle += Math.sign(delta) * Math.min(Math.abs(delta), turnSpeed);


                    const newX = m.x + Math.cos(m.angle) * m.speed;
                    const newY = m.y + Math.sin(m.angle) * m.speed;

                    return { ...m, x: newX, y: newY };
                }).filter(m => m.target && m.x > -20 && m.x < canvas.width + 20 && m.y > -20 && m.y < canvas.height + 20);


                // Logika pro Drony
                while (score >= p.nextDroneUnlockScore && p.drones.length < MAX_DRONES) {
                    p.drones.push({
                        id: p.drones.length,
                        x: p.x,
                        y: p.y,
                        orbitAngle: (p.drones.length / (MAX_DRONES + 1)) * (Math.PI * 2),
                        lastShotTime: now,
                        bullets: [],
                    });
                    p.nextDroneUnlockScore = DRONE_INITIAL_SCORE_UNLOCK + (p.drones.length) * DRONE_SCORE_PER_ADDITIONAL_DRONE;

                    // Pokud skóre, které hráč má, již přesahuje nově vypočítané nextDroneUnlockScore,
                    // a hráč ztratil více dronů najednou, je potřeba posunout nextDroneUnlockScore
                    // ještě více dopředu, aby se drony přidávaly postupně a ne všechny najednou.
                    if (score >= p.nextDroneUnlockScore && p.drones.length < MAX_DRONES) {
                        p.nextDroneUnlockScore = score + DRONE_SCORE_PER_ADDITIONAL_DRONE;
                    }
                }

                const droneCount = playerRef.current.drones.length;
                const droneShootCooldown = DRONE_BASE_COOLDOWN - (droneCount * DRONE_COOLDOWN_REDUCTION_PER_DRONE);

                playerRef.current.drones.forEach((drone, index) => {
                    // Orbitování
                    const orbitSpeed = 0.02;
                    drone.orbitAngle += orbitSpeed;
                    if (drone.orbitAngle > Math.PI * 2) drone.orbitAngle -= Math.PI * 2;

                    drone.x = p.x + DRONE_ORBIT_DISTANCE * Math.cos(drone.orbitAngle);
                    drone.y = p.y + DRONE_ORBIT_DISTANCE * Math.sin(drone.orbitAngle);

                    // Střelba dronů
                    if (now - drone.lastShotTime > droneShootCooldown && asteroidsRef.current.length > 0) {
                        let closestAsteroid = null;
                        let minDistSq = Infinity;

                        asteroidsRef.current.forEach(ast => {
                            const distSq = Math.pow(drone.x - ast.x, 2) + Math.pow(drone.y - ast.y, 2);
                            if (distSq < minDistSq) {
                                minDistSq = distSq;
                                closestAsteroid = ast;
                            }
                        });

                        if (closestAsteroid) {
                            const angleToTarget = Math.atan2(closestAsteroid.y - drone.y, closestAsteroid.x - drone.x);
                            drone.bullets.push({
                                x: drone.x,
                                y: drone.y,
                                angle: angleToTarget,
                                speed: DRONE_BULLET_SPEED,
                                length: DRONE_BULLET_LENGTH,
                                type: 'drone'
                            });
                            drone.lastShotTime = now;
                        }
                    }
                });

                let remainingAsteroids = [];
                const collidedDrones = new Set();

                asteroidsRef.current.forEach(ast => {
                    ast.x += Math.cos(ast.angle) * ast.speed;
                    ast.y += Math.sin(ast.angle) * ast.speed;
                    ast.rotationAngle += ast.rotationSpeed;
                    if (ast.rotationAngle > Math.PI * 2) ast.rotationAngle -= Math.PI * 2;
                    if (ast.rotationAngle < 0) ast.rotationAngle += Math.PI * 2;

                    if (ast.x < 0) ast.x = canvas.width;
                    if (ast.x > canvas.width) ast.x = 0;
                    if (ast.y < 0) ast.y = canvas.height;
                    if (ast.y > canvas.height) ast.y = 0;

                    let asteroidHit = false; // Jedna proměnná, zda asteroid byl zasažen
                    let bulletScoreMultiplier = 1; // Pro rozlišení, zda se skóre přidává (hráč vs. dron)

                    playerRef.current.bullets = playerRef.current.bullets.filter(b => {
                        const bulletHitboxRadius = b.length / 2;
                        if (Math.hypot(b.x - ast.x, b.y - ast.y) < ast.radius + bulletHitboxRadius) {
                            asteroidHit = true;
                            bulletScoreMultiplier = 1; // Hráčova střela přidává skóre
                            return false;
                        }
                        return true;
                    });

                    playerRef.current.drones.forEach(drone => {
                        drone.bullets = drone.bullets.filter(b => {
                            const bulletHitboxRadius = b.length / 2;
                            if (Math.hypot(b.x - ast.x, b.y - ast.y) < ast.radius + bulletHitboxRadius) {
                                asteroidHit = true;
                                bulletScoreMultiplier = 0.5; // Dronova střela přidává méně skóre
                                return false;
                            }
                            return true;
                        });
                    });

                    playerRef.current.missiles = playerRef.current.missiles.filter((m) => {
                        if (m.target && Math.hypot(m.x - ast.x, m.y - ast.y) < ast.radius + MISSILE_RADIUS) { // Větší detekce kolize
                            asteroidHit = true;
                            bulletScoreMultiplier = 1.5; // Raketa přidává více skóre
                            return false;
                        }
                        return true;
                    });

                    playerRef.current.drones.forEach(drone => {
                        const distDroneAst = Math.hypot(drone.x - ast.x, drone.y - ast.y);
                        if (distDroneAst < ast.radius + DRONE_RADIUS) {
                            collidedDrones.add(drone.id);
                            asteroidHit = true; // Kolidovaný dron také zničí asteroid
                            bulletScoreMultiplier = 0; // Kolidovaný dron nepřidává skóre (jen ničí asteroid)
                        }
                    });


                    if (asteroidHit) {
                        const data = ASTEROID_SIZES[ast.type];
                        if (bulletScoreMultiplier > 0) { // Přidáme skóre jen pokud byl zasažen střelou/raketou, ne dronem
                            setScore(s => {
                                const newScore = s + data.score * bulletScoreMultiplier; // Aplikujeme multiplier
                                if (newScore - lastLifeScore >= 8000 && playerRef.current.health < 4) {
                                    playerRef.current.health++;
                                    setLastLifeScore(newScore);
                                }
                                return newScore;
                            });
                        }

                        if (data.split) {
                            for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
                                const sub = ASTEROID_SIZES[data.split];
                                remainingAsteroids.push({
                                    x: ast.x,
                                    y: ast.y,
                                    radius: sub.radius,
                                    speed: sub.speed,
                                    type: data.split,
                                    hp: 1,
                                    angle: getRandom(0, Math.PI * 2),
                                    rotationAngle: getRandom(0, Math.PI * 2),
                                    rotationSpeed: getRandom(-0.02, 0.02)
                                });
                            }
                        }
                    } else {
                        remainingAsteroids.push(ast);
                    }
                });
                asteroidsRef.current = remainingAsteroids;

                // Logika pro zničení dronů
                if (collidedDrones.size > 0) {
                    const originalDroneCount = playerRef.current.drones.length;
                    playerRef.current.drones = playerRef.current.drones.filter(drone => !collidedDrones.has(drone.id));

                    if (playerRef.current.drones.length < originalDroneCount) {
                        const dronesCurrentlyActive = playerRef.current.drones.length;
                        const requiredScoreForNextDrone = DRONE_INITIAL_SCORE_UNLOCK + (dronesCurrentlyActive) * DRONE_SCORE_PER_ADDITIONAL_DRONE;

                        if (score >= requiredScoreForNextDrone) {
                            playerRef.current.nextDroneUnlockScore = score + DRONE_SCORE_PER_ADDITIONAL_DRONE;
                        } else {
                            playerRef.current.nextDroneUnlockScore = requiredScoreForNextDrone;
                        }
                    }
                }

                asteroidsRef.current.forEach(ast => {
                    const dist = Math.hypot(ast.x - playerRef.current.x, ast.y - playerRef.current.y);
                    if (dist < ast.radius + 10 && now - lastDamageTime.current > damageCooldown) {
                        const p = playerRef.current;

                        if (p.hasShield) {
                            p.hasShield = false;
                            p.lastShieldDestroyedTime = now;
                        } else {
                            p.health--;
                            if (p.health <= 0) onGameOver(score);
                        }
                        lastDamageTime.current = now;
                    }
                });
            };

            const draw = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = 'white';
                starsRef.current.forEach(star => {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                    ctx.fill();
                });

                // Vykreslení hráče
                ctx.save();
                ctx.translate(playerRef.current.x, playerRef.current.y);
                ctx.rotate(playerRef.current.angle);

                // Tělo lodi
                ctx.fillStyle = gameColors.player;
                ctx.beginPath();
                ctx.moveTo(10, 0);
                ctx.lineTo(-10, -7);
                ctx.lineTo(-10, 7);
                ctx.closePath();
                ctx.fill();

                // Plamen motoru
                if (playerRef.current.isThrusting) {
                    ctx.beginPath();
                    ctx.moveTo(-10, 0);
                    ctx.lineTo(-20, -5); // Delší plamen
                    ctx.lineTo(-20, 5);
                    ctx.closePath();
                    ctx.fillStyle = 'orange';
                    ctx.shadowColor = 'orange'; // Záře plamene
                    ctx.shadowBlur = 10;
                    ctx.fill();
                    ctx.shadowBlur = 0; // Reset stínu
                }
                ctx.restore();

                // Vykreslení dronů
                playerRef.current.drones.forEach(drone => {
                    ctx.save();
                    ctx.translate(drone.x, drone.y);
                    ctx.fillStyle = gameColors.drone || '#00FF00'; // Výchozí zelená
                    ctx.shadowColor = gameColors.drone || '#00FF00';
                    ctx.shadowBlur = 8; // Menší záře pro drony

                    // Vykreslení dronu jako stylizovaného křížku/čtverce
                    ctx.beginPath();
                    // Tělo dronu (malý čtverec)
                    ctx.fillRect(-5, -5, 10, 10);
                    // "Křídla" dronu
                    ctx.fillRect(-12, -2, 24, 4); // Horizontální
                    ctx.fillRect(-2, -12, 4, 24); // Vertikální
                    ctx.fill();

                    ctx.shadowBlur = 0; // Reset stínu
                    ctx.restore();
                });


                // Vykreslení projektilů hráče s efektem světélkování
                playerRef.current.bullets.forEach(b => {
                    ctx.save();
                    ctx.translate(b.x, b.y);
                    ctx.rotate(b.angle);
                    ctx.fillStyle = gameColors.bullet;
                    ctx.shadowColor = gameColors.bullet; // Barva záře
                    ctx.shadowBlur = 15; // Intenzita záře
                    ctx.fillRect(0, -2, b.length, 4);
                    ctx.shadowBlur = 0; // Reset stínu
                    ctx.restore();
                });

                // Vykreslení projektilů dronů s efektem světélkování
                playerRef.current.drones.forEach(drone => {
                    drone.bullets.forEach(b => {
                        ctx.save();
                        ctx.translate(b.x, b.y);
                        ctx.rotate(b.angle);
                        ctx.fillStyle = gameColors.droneBullet || '#800080';
                        ctx.shadowColor = gameColors.droneBullet || '#800080';
                        ctx.shadowBlur = 10; // Intenzita záře
                        ctx.fillRect(0, -1, b.length, 2);
                        ctx.shadowBlur = 0; // Reset stínu
                        ctx.restore();
                    });
                });


                // Vykreslení raket s detailem a dýmem
                playerRef.current.missiles.forEach(m => {
                    ctx.save();
                    ctx.translate(m.x, m.y);
                    ctx.rotate(m.angle);

                    // Dým/stopa za raketou
                    ctx.fillStyle = 'rgba(255, 165, 0, 0.4)'; // Oranžový dým s průhledností
                    ctx.fillRect(-MISSILE_RADIUS - MISSILE_TRAIL_LENGTH, -MISSILE_TRAIL_WIDTH / 2, MISSILE_TRAIL_LENGTH, MISSILE_TRAIL_WIDTH);

                    // Tělo rakety (špička)
                    ctx.fillStyle = gameColors.missile;
                    ctx.beginPath();
                    ctx.moveTo(MISSILE_RADIUS, 0); // Špička
                    ctx.lineTo(-MISSILE_RADIUS * 1.5, -MISSILE_RADIUS); // Levý roh základny
                    ctx.lineTo(-MISSILE_RADIUS * 1.5, MISSILE_RADIUS);  // Pravý roh základny
                    ctx.closePath();
                    ctx.fill();

                    // Malé plameny na konci rakety
                    ctx.fillStyle = 'orange';
                    ctx.shadowColor = 'orange';
                    ctx.shadowBlur = 5;
                    ctx.beginPath();
                    ctx.moveTo(-MISSILE_RADIUS * 1.5, -MISSILE_RADIUS * 0.5);
                    ctx.lineTo(-MISSILE_RADIUS * 2.5, 0);
                    ctx.lineTo(-MISSILE_RADIUS * 1.5, MISSILE_RADIUS * 0.5);
                    ctx.closePath();
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    ctx.restore();
                });

                // Asteroidy nebo kachničky
                asteroidsRef.current.forEach(ast => {
                    ctx.save();
                    ctx.translate(ast.x, ast.y);
                    ctx.rotate(ast.rotationAngle);
                    const drawSize = ast.radius * 2 * 1.8;

                    if (isDuckyMode && isDuckyImageLoaded) {
                        const spriteWidth = 30;
                        const spriteHeight = 30;
                        const sourceX = 0;
                        const sourceY = 0;

                        ctx.drawImage(
                            duckyImageElementRef.current,
                            sourceX,
                            sourceY,
                            spriteWidth,
                            spriteHeight,
                            -drawSize / 2,
                            -drawSize / 2,
                            drawSize,
                            drawSize
                        );
                    } else if (isAsteroidImageLoaded) {
                        ctx.drawImage(
                            asteroidImageElementRef.current,
                            -drawSize / 2,
                            -drawSize / 2,
                            drawSize,
                            drawSize
                        );
                    } else {
                        ctx.beginPath();
                        ctx.arc(0, 0, ast.radius, 0, Math.PI * 2);
                        ctx.fillStyle = 'gray';
                        ctx.fill();
                    }
                    ctx.restore();
                });

                // SKÓRE, ŽIVOTY, ŠTÍT A DRONY
                ctx.font = '20px "Press Start 2P", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
                ctx.fillStyle = '#00ff7f';
                ctx.fillText(`${T.score}: ${score}`, 20, 40);
                ctx.fillText(`${T.lives}: ${'♥'.repeat(playerRef.current.health)}`, 20, 80);

                if (playerRef.current.hasShield) {
                    ctx.fillText(T.shieldActive, 20, 120);
                } else {
                    const now = Date.now();
                    const timeLeft = Math.max(0, Math.ceil((SHIELD_COOLDOWN_TIME - (now - playerRef.current.lastShieldDestroyedTime)) / 1000));
                    if (timeLeft > 0) {
                        ctx.fillText(`${T.shieldCooldown} (${timeLeft}s)`, 20, 120);
                    }
                }
                ctx.fillText(`${T.dronesDisplay}: ${playerRef.current.drones.length} / ${MAX_DRONES}`, 20, 160);
            };

            const gameLoop = () => {
                if (!isPaused) {
                    update();
                }
                draw();
                animationFrameId = requestAnimationFrame(gameLoop);
            };

            animationFrameId = requestAnimationFrame(gameLoop);

            return () => cancelAnimationFrame(animationFrameId);
        }
    }, [isPaused, score, onGameOver, lastLifeScore, T, isAsteroidImageLoaded, isDuckyImageLoaded, isDuckyMode, gameColors]);

    return (
        <>
            <canvas ref={canvasRef} className="game-canvas" />

            {isPaused && (
                <PauseOverlay
                    onResume={() => setIsPaused(false)}
                    onReturnToMenu={onReturnToMainMenu}
                />
            )}
        </>
    );
});

export default GameCanvas;