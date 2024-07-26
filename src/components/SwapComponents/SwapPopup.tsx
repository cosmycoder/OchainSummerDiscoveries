import React, { FC } from 'react';
import styles from './SwapPopup.module.css';
import SwapComponents from './SwapComponents';

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const SwapPopup: FC<PopupProps> = React.memo(({ isOpen, onClose }) => {
    return isOpen ? (
        <div className={`${styles.swapPopup} ${styles.popupOpen}`}>
            <div className={styles.closeButton} onClick={onClose}>
                &times;
            </div>
            <div className="text-center">
                <SwapComponents />
            </div>
        </div>
    ) : null;
});

export default SwapPopup;
SwapPopup.displayName = 'SwapPopup';