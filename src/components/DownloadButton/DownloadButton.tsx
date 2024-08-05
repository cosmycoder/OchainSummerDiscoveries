// components/FloatingFavoritesButton.tsx
import React, { FC, useState } from 'react';
import { FaDownload } from "react-icons/fa";
import styles from './DownloadButton.module.css';
import DownloadPopup from '../DownloadComponents/DownloadPopup';

const DownloadButton: FC= () => {

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
                <FaDownload className={styles.heartIcon} />
            </button>
            <DownloadPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
        </div>
    );
};
export default DownloadButton;
