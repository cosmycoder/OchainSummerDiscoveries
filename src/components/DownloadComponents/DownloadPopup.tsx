import React, { FC } from 'react';
import styles from './DownloadPopup.module.css';
import DownloadComponents from './DownloadComponents';
import Image from 'next/image';
import { SiIpfs } from "react-icons/si";

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const DownloadPopup: FC<PopupProps> = React.memo(({ isOpen, onClose }) => {
    return isOpen ? (
        <div className={`${styles.swapPopup} ${styles.popupOpen}`}>
            <div className={styles.closeButton} onClick={onClose}>
                &times;
            </div>
            <div className="text-center">
                <h2 className={styles.logoTextContainer}>
                    <SiIpfs
                        width={24}
                        height={24}
                        className={styles.logo}
                    />
                    Download Favorites
                </h2>
                <DownloadComponents />
            </div>
        </div>
    ) : null;
});

export default DownloadPopup;
DownloadPopup.displayName = 'DownloadPopup';