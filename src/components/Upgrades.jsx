import React, { useContext } from 'react';
import '../styles/Upgrades.css';
import { LanguageContext } from '../context/LanguageContext';

const Upgrades = ({ onClose }) => {
    const { T } = useContext(LanguageContext);

    return (
        <div className="upgrades-overlay">
            <div className="upgrades-container">
                <h2 className="upgrades-title">{T.upgradeMenuTitle}</h2>
                <table className="upgrades-table">
                    <tbody>
                    <tr className="upgrade-row">
                        <td className="upgrade-name">{T.dron}</td>
                        <td className="upgrade-description" title={T.dronDescription}>
                            {T.dronDescription}
                        </td>
                    </tr>
                    <tr className="upgrade-row">
                        <td className="upgrade-name">{T.laserSpread}</td>
                        <td className="upgrade-description" title={T.laserSpreadDescription}>
                            {T.laserSpreadDescription}
                        </td>
                    </tr>
                    <tr className="upgrade-row">
                        <td className="upgrade-name">{T.shield}</td>
                        <td className="upgrade-description" title={T.shieldDescription}>
                            {T.shieldDescription}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button className="back-to-menu-button" onClick={onClose}>{T.backToMenu}</button>
            </div>
        </div>
    );
};

export default Upgrades;