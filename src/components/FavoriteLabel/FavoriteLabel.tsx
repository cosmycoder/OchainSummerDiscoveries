import React, { useState, useEffect, useCallback } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import styles from './FavoriteLabel.module.css';

interface LabelProps {
    labelValue: { id?: string };
}

const FavoriteLabel: React.FC<LabelProps> = ({ labelValue }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        if (labelValue?.id) {
            const favoriteState = localStorage.getItem(labelValue.id);
            if (favoriteState) {
                setIsFavorite(JSON.parse(favoriteState));
            } else {
                setIsFavorite(false);
            }
        }
    }, [labelValue]);

    const toggleFavorite = useCallback(() => {
        const newFavoriteState = !isFavorite;
        setIsFavorite(newFavoriteState);
        setIsClicked(true);

        setTimeout(() => setIsClicked(false), 300); // Duration of the animation

        if (labelValue?.id) {
            localStorage.setItem(labelValue.id, JSON.stringify(newFavoriteState));
        }
    }, [isFavorite, labelValue]);

    return (
        <div className={styles.favoriteLabel} onClick={toggleFavorite}>
            {isFavorite ? (
                <AiFillHeart className={`${styles.heartIcon} ${isClicked ? styles.scale : ''}`} />
            ) : (
                <AiOutlineHeart className={`${styles.heartIcon} ${isClicked ? styles.scale : ''}`} />
            )}
            <span className={styles.labelText}>Favorite</span>
        </div>
    );
};

export default FavoriteLabel;
