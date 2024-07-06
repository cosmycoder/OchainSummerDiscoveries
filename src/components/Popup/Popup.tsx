// src/components/Popup/Popup.tsx
import React, { FC, ReactNode } from 'react';
import styles from './Popup.module.css';
import { deriveBase64DataFromCache, getNiceDomainDisplayFromUrl } from '@/lib/threeFunc';
import Image from 'next/image';
import FavoriteLabel from '../FavoriteLabel/FavoriteLabel';

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    popupValue: any;
    currentCache: any;
}

const Popup: FC<PopupProps> = ({ isOpen, onClose, popupValue, currentCache }) => {
    return (
        <div className={`${styles.popup} ${isOpen ? styles.popupOpen : styles.popupClose}`}>
            <div className={styles.closeButton} onClick={onClose}>
                &times;
            </div>
            <FavoriteLabel labelValue={popupValue}/>
            <div className="flex flex-row justify-center"> {/* Centering container */}
                <div>
                    <Image
                        src={deriveBase64DataFromCache(popupValue, currentCache) ?? "/logo.png"}
                        alt={`Logo of ${popupValue?.id}`}
                        width={100}  // Adjusted size (10% of 1000px width)
                        height={100} // Adjusted size (10% of 1000px width)
                        className="rounded-lg bg-white bg-opacity-30"
                    />
                </div>
            </div>
            <div className="text-center"> {/* Centering title and content */}
                <h2>{popupValue?.id}</h2>
                <span>{getNiceDomainDisplayFromUrl(popupValue?.url ?? "https://base.org")}</span>
                <p>{popupValue?.description}</p>
                <button className={styles.goToSiteButton} onClick={() => window.open(popupValue?.url, '_blank')}>
                    Go to Site
                </button>
            </div>
        </div>
    );
};

export default Popup;
