import React, { FC } from 'react';
import styles from './UploadPopup.module.css';
import UploadComponents from './UploadComponents';
import Image from 'next/image';
import { SiIpfs } from "react-icons/si";
interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const UploadPopup: FC<PopupProps> = React.memo(({ isOpen, onClose }) =>
    isOpen ? (
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
                    Upload Favorites
                </h2>
                <UploadComponents />
            </div>
        </div>
    ) : null
);

export default UploadPopup;
UploadPopup.displayName = 'UploadPopup';