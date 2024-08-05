// components/FloatingFavoritesButton.tsx
import React, { FC, useState } from 'react';
import { FaUpload } from "react-icons/fa";
import styles from './UploadButton.module.css';
import UploadPopup from '../UploadComponents/UploadPopup';



const UploadButton: FC = () => {

    const [isPopupOpen, setPopupOpen] = useState(false);

    const handleOpenPopup = () => {
        setPopupOpen(true);
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
    };

    return (
        <div>
            <button className={styles.floatingButton} onClick={isPopupOpen ? handleClosePopup : handleOpenPopup}>
                <FaUpload className={styles.heartIcon} />
            </button>
            <UploadPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
        </div>
    );
};
export default UploadButton;
