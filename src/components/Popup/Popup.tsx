'use client';
import React, { FC, ReactNode, useMemo } from 'react';
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

const Popup: FC<PopupProps> = React.memo(({ isOpen, onClose, popupValue, currentCache }) => {
    const popupImage = useMemo(() => deriveBase64DataFromCache(popupValue, currentCache) ?? "/logo.png", [popupValue, currentCache]);
    const popupTitle = useMemo(() => popupValue?.id, [popupValue]);
    const popupDescription = useMemo(() => popupValue?.description, [popupValue]);
    const popupUrl = useMemo(() => popupValue?.url ?? "https://base.org", [popupValue]);
    const niceDomainDisplay = useMemo(() => getNiceDomainDisplayFromUrl(popupUrl), [popupUrl]);

    const handleGoToSite = () => window.open(popupUrl, '_blank');

    return isOpen ? (
        <div className={`${styles.popup} ${styles.popupOpen}`}>
            <div className={styles.closeButton} onClick={onClose}>
                &times;
            </div>
            <FavoriteLabel labelValue={popupValue} />
            <div className="flex flex-row justify-center">
                <div>
                    <Image
                        src={popupImage}
                        alt={`Logo of ${popupTitle}`}
                        width={100}
                        height={100}
                        className="rounded-lg bg-white bg-opacity-30"
                    />
                </div>
            </div>
            <div className="text-center">
                <h2>{popupTitle}</h2>
                <span>{niceDomainDisplay}</span>
                <p className={styles.description}>{popupDescription}</p>
                <button className={styles.goToSiteButton} onClick={handleGoToSite}>
                    Go to Site
                </button>
            </div>
        </div>
    ) : null;
});

export default Popup;
Popup.displayName = 'Popup';