import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

const defaultLang = localStorage.getItem('lang') || 'en';

// Defaultní barvy
export const DEFAULT_COLORS = {
    player: '#FFFFFF', // Bílá
    bullet: '#FF0000', // Červená
    missile: '#00FFFF', // Azurová
    drone: '#00FF00', // Zelená pro drona
    droneBullet: '#F56BF5', // Žůžová pro projektily dronů
};

export const translations = {
    en: {
        start: 'Start Game',
        settings: 'Settings',
        mainMenu: 'Main Menu',
        pause: 'Game Paused',
        resume: 'Resume',
        gameOver: 'Game Over',
        score: 'Score',
        lives: 'Lives',
        language: 'Language',
        upgrades: 'Upgrades',
        highScore: 'High Score',

        upgradeMenuTitle: 'Available Upgrades',
        backToMenu: 'Back to Menu',
        dron: 'Drone',
        dronDescription: 'This drone will orbit the player and shoot at nearby asteroids.',
        laserSpread: 'Wider Laser Spread',
        laserSpreadDescription: 'Increases the spread angle of the main laser, hitting more enemies at once.',
        shield: 'Shield',
        shieldDescription: 'Automatically regenerates every 10 seconds, providing short-term protection.',
        shieldCooldown: 'Shield regenerating...',
        shieldActive: '⚡ Shield Active ⚡',

        dronesDisplay: 'Drones',

        aboutMe: 'About Me',
        aboutMeTitle: 'About The Game',
        duckButton: 'Ducky Mode',
        duckModeActivated: 'Ducky Mode Activated! Quack Quack!',
        duckModeDeactivated: 'Ducky Mode Deactivated!',
        aboutMeTextPlaceholder: `
            <p>Welcome to our modern interpretation of the classic arcade game Asteroids! This game is lovingly crafted as a tribute to the original title, but with a range of enhancements designed to improve gameplay and add new strategic elements. You'll discover new shooting options, intelligent drones to assist you in battle, and a dynamic scoring system that rewards your skill. Get ready for fast-paced action and endless fun!</p>
            <hr />
            <p><strong>Ship Controls:</strong></p>
            <ul>
                <li><strong>W:</strong> Move forward (accelerate)</li>
                <li><strong>A:</strong> Rotate left</li>
                <li><strong>D:</strong> Rotate right</li>
                <li><strong>S:</strong> Brake (rapid deceleration)</li>
                <li><strong>Spacebar:</strong> Fire laser</li>
                <li><strong>R:</strong> Fire guided missile (if available)</li>
                <li><strong>ESC:</strong> Pause game / Return to menu</li>
            </ul>
            <hr />
            <p><strong>A little riddle at the end:</strong></p>
            <p>Do you know the best way to enhance a good old game without changing its essence? Sometimes, all it takes is adding something small, but cute and unexpected. Try to find and press the button that at first glance seems to be just a decorative element. Perhaps you will discover a whole new (and fluffy) perspective on space travel!</p>
            <hr />
            <p><strong>Author:</strong> Jan Unger<br />
            <strong>Student ID:</strong> A24B0078P</p>
        `,

        customizeColors: 'Customize Colors',
        playerShip: 'Player Ship',
        bullet: 'Bullet',
        missile: 'Missile',
        droneColor: 'Drone Color',
        droneBulletColor: 'Drone Bullet Color',
        saveColors: 'Save Colors',
        resetColors: 'Default Colors',
        colorsSaved: 'Colors saved successfully!',
        colorsReset: 'Colors reset to default!',
    },
    cs: {
        start: 'Spustit hru',
        settings: 'Nastavení',
        mainMenu: 'Hlavní menu',
        pause: 'Hra pozastavena',
        resume: 'Pokračovat',
        gameOver: 'Konec hry',
        score: 'Skóre',
        lives: 'Životy',
        language: 'Jazyk',
        upgrades: 'Vylepšení',
        highScore: 'Nejvyšší skóre',

        upgradeMenuTitle: 'Dostupná Vylepšení',
        backToMenu: 'Zpět do Menu',
        dron: 'Dron',
        dronDescription: 'Tento dron bude orbitovat kolem hráče a střílet na blízké asteroidy.',
        laserSpread: 'Větší Rozptyl Laseru',
        laserSpreadDescription: 'Zvyšuje úhel rozptylu hlavního laseru, čímž zasáhne více nepřátel najednou.',
        shield: 'Štít',
        shieldDescription: 'Každých 10 sekund se automaticky obnoví, čímž poskytuje krátkodobou ochranu.',
        shieldCooldown: 'Štít se obnovuje...',
        shieldActive: '⚡ Štít aktivní ⚡',

        dronesDisplay: 'Droni',

        aboutMe: 'O Mně',
        aboutMeTitle: 'O Hře',
        duckButton: 'Kachničkový Mód',
        duckModeActivated: 'Kachničkový Mód Aktivován! Kvák Kvák!',
        duckModeDeactivated: 'Kachničkový Mód Vypnut!',
        aboutMeTextPlaceholder: `
            <p>Vítejte v naší moderní interpretaci klasické arkádové hry Asteroids! Tato hra je s láskou vytvořena jako pocta původnímu titulu, avšak s řadou vylepšení navržených pro zlepšení hratelnosti a přidání nových strategických prvků. Odhalíte nové možnosti střelby, inteligentní drony, které vám pomohou v boji, a dynamický systém skóre, který odměňuje vaše dovednosti. Připravte se na rychlou akci a nekonečnou zábavu!</p>
            <hr />
            <p><strong>Ovládání lodi:</strong></p>
            <ul>
                <li><strong>W:</strong> Pohyb vpřed (zrychlení)</li>
                <li><strong>A:</strong> Otáčení doleva</li>
                <li><strong>D:</strong> Otáčení doprava</li>
                <li><strong>S:</strong> Brzda (rychlé zpomalení)</li>
                <li><strong>Mezerník:</strong> Střelba laserem</li>
                <li><strong>R:</strong> Vystřelení naváděné rakety (pokud je k dispozici)</li>
                <li><strong>ESC:</strong> Pozastavení hry / Návrat do menu</li>
            </ul>
            <hr />
            <p><strong>Malá hádanka na závěr:</strong></p>
            <p>Víte, jaký je ten nejlepší způsob, jak vylepšit starou, dobrou hru, aniž byste museli měnit její podstatu? Někdy stačí přidat něco malého, ale roztomilého a nečekaného. Zkuste najít a stisknout tlačítko, které se na první pohled zdá být jen dekoračním prvkem. Možná se vám otevře zcela nový (a huňatý) pohled na vesmírné cestování!</p>
            <hr />
            <p><strong>Autor:</strong> Jan Unger<br />
            <strong>Studijní číslo:</strong> A24B0078P</p>
        `,

        customizeColors: 'Nastavit barvy',
        playerShip: 'Hráčská loď',
        bullet: 'Projektil',
        missile: 'Raketa',
        droneColor: 'Barva Dronu',
        droneBulletColor: 'Barva Projektilu Dronu',
        saveColors: 'Uložit barvy',
        resetColors: 'Výchozí barvy',
        colorsSaved: 'Barvy úspěšně uloženy!',
        colorsReset: 'Barvy resetovány na výchozí!',
    },
    pl: {
        start: 'Start gry',
        settings: 'Ustawienia',
        mainMenu: 'Menu główne',
        pause: 'Gra zatrzymana',
        resume: 'Wznów',
        gameOver: 'Koniec gry',
        score: 'Wynik',
        lives: 'Życia',
        language: 'Język',
        upgrades: 'Ulepszenia',
        highScore: 'Najwyższy wynik',

        upgradeMenuTitle: 'Dostępne Ulepszenia',
        backToMenu: 'Powrót do Menu',
        dron: 'Dron',
        dronDescription: 'Ten dron będzie orbitował wokół gracza i strzelał do pobliskich asteroid.',
        laserSpread: 'Większy Rozrzut Lasera',
        laserSpreadDescription: 'Zwiększa kąt rozrzutu głównego lasera, trafiając więcej wrogów naraz.',
        shield: 'Tarcza',
        shieldDescription: 'Automatycznie regeneruje się co 10 sekund, zapewniając krótkotrwałą ochronę.',
        shieldCooldown: 'Tarcza się regeneruje...',
        shieldActive: '⚡ Tarcza aktywna ⚡',

        dronesDisplay: 'Drony',

        aboutMe: 'O Mnie',
        aboutMeTitle: 'O Grze',
        duckButton: 'Tryb Kaczki',
        duckModeActivated: 'Tryb Kaczki Aktywowany! Kwa Kwa!',
        duckModeDeactivated: 'Tryb Kaczki Wyłączony!',
        aboutMeTextPlaceholder: `
            <p>Witaj w naszej nowoczesnej interpretacji klasycznej gry zręcznościowej Asteroids! Ta gra została z miłością stworzona jako hołd dla oryginalnego tytułu, ale z szeregiem ulepszeń zaprojektowanych w celu poprawy rozgrywki i dodania nowych elementów strategicznych. Odkryjesz nowe opcje strzelania, inteligentne drony, które pomogą ci w walce, oraz dynamiczny system punktacji, który nagradza twoje umiejętności. Przygotuj się na szybką akcję i niekończącą się zabawę!</p>
            <hr />
            <p><strong>Sterowanie statkiem:</strong></p>
            <ul>
                <li><strong>W:</strong> Ruch do przodu (przyspieszenie)</li>
                <li><strong>A:</strong> Obrót w lewo</li>
                <li><strong>D:</strong> Obrót w prawo</li>
                <li><strong>S:</strong> Hamulec (szybkie spowolnienie)</li>
                <li><strong>Spacja:</strong> Strzał laserem</li>
                <li><strong>R:</strong> Wystrzelenie rakiety naprowadzanej (jeśli dostępna)</li>
                <li><strong>ESC:</strong> Pauza gry / Powrót do menu</li>
            </ul>
            <hr />
            <p><strong>Mała zagadka na koniec:</strong></p>
            <p>Czy wiesz, jaki jest ten najlepszy sposób na ulepszenie starej, dobrej gry, aniżbyś musiał zmieniać jej istotę? Czasem wystarczy dodać coś małego, ale uroczego i nieoczekiwanego. Spróbuj znaleźć i nacisnąć przycisk, który na pierwszy rzut oka wydaje się tylko elementem dekoracyjnym. Być może odkryjesz zupełnie nową (i puszystą) perspektyvę na podróże kosmiczne!</p>
            <hr />
            <p><strong>Autor:</strong> Jan Unger<br />
            <strong>Numer albumu:</strong> A24B0078P</p>
        `,

        customizeColors: 'Dostosuj kolory',
        playerShip: 'Statek gracza',
        bullet: 'Pocisk',
        missile: 'Pocisk kierowany',
        droneColor: 'Kolor drona',
        droneBulletColor: 'Kolor pocisku drona',
        saveColors: 'Zapisz kolory',
        resetColors: 'Domyślne kolory',
        colorsSaved: 'Kolory zapisano pomyślnie!',
        colorsReset: 'Kolory zresetowano do domyślnych!',
    },
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(defaultLang);
    const [gameColors, setGameColors] = useState(() => {
        const storedColors = localStorage.getItem('gameColors');
        if (storedColors) {
            try {
                const parsedColors = JSON.parse(storedColors);
                return {
                    ...DEFAULT_COLORS,
                    ...parsedColors,
                };
            } catch (e) {
                console.error("Failed to parse gameColors from localStorage", e);
                return DEFAULT_COLORS;
            }
        }
        return DEFAULT_COLORS;
    });

    const [isDuckyMode, setIsDuckyMode] = useState(() => {
        const storedDuckyMode = localStorage.getItem('isDuckyMode');
        return storedDuckyMode ? JSON.parse(storedDuckyMode) : false;
    });

    const T = translations[language];

    const changeLang = (lang) => {
        localStorage.setItem('lang', lang);
        setLanguage(lang);
    };

    const saveGameColors = (colors) => {
        setGameColors(colors);
        localStorage.setItem('gameColors', JSON.stringify(colors));
    };

    const resetGameColors = () => {
        setGameColors(DEFAULT_COLORS);
        localStorage.setItem('gameColors', JSON.stringify(DEFAULT_COLORS));
    };

    const toggleDuckyMode = () => {
        setIsDuckyMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('isDuckyMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage: changeLang,
            T,
            gameColors,
            saveGameColors,
            resetGameColors,
            DEFAULT_COLORS,
            isDuckyMode,
            toggleDuckyMode
        }}>
            {children}
        </LanguageContext.Provider>
    );
};