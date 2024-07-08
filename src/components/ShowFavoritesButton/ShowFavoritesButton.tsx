// components/FloatingFavoritesButton.tsx
import React, { FC } from 'react';
import { FaHeart } from 'react-icons/fa';
import styles from './ShowFavoritesButton.module.css';

interface FavoritesProps {
    onFavorites: () => void;
}

const ShowFavoritesButton: FC<FavoritesProps> = ({ onFavorites }) => {
    const handleClick = () => {
        onFavorites();
    }
    return (
        <button className={styles.floatingButton} onClick={handleClick}>
            <FaHeart className={styles.heartIcon} />
        </button>
    );
};
export default ShowFavoritesButton;
