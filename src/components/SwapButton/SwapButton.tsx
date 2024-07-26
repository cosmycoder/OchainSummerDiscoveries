// components/FloatingFavoritesButton.tsx
import React, { FC, useState } from 'react';
import { RiTokenSwapLine } from "react-icons/ri";
import styles from './SwapButton.module.css';
import SwapPopup from '../SwapComponents/SwapPopup';



const SwapButton: FC= () => {

    const [isPopupOpen, setPopupOpen] = useState(false);

    const handleOpenPopup = () => {
        setPopupOpen(true);
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
    };
    return (
        <div>
            <button className={styles.floatingButton} onClick={isPopupOpen ?  handleClosePopup : handleOpenPopup }>
                <RiTokenSwapLine className={styles.heartIcon} />
            </button>
            <SwapPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
        </div>
    );
};
export default SwapButton;
