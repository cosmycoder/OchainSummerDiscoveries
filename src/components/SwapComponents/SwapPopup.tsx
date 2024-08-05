import React, { FC } from 'react';
import styles from './SwapPopup.module.css';
import SwapComponents from './SwapComponents';
import Image from 'next/image';

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const SwapPopup: FC<PopupProps> = React.memo(({ isOpen, onClose }) => isOpen ? (
    <div className={`${styles.swapPopup} ${styles.popupOpen}`}>
        <div className={styles.closeButton} onClick={onClose}>
            &times;
        </div>
        <div className="text-center">
            <h2 className={styles.logoTextContainer}>
                <Image
                    src="/baselogo.png"
                    alt="baselogo"
                    width={24}
                    height={24}
                    className={styles.logo}
                />
                Base
            </h2>
            <SwapComponents />
        </div>
    </div>
) : null
);

export default SwapPopup;
SwapPopup.displayName = 'SwapPopup';