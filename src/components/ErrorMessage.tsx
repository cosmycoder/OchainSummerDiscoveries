// components/ErrorMessage.tsx
import React, { FC } from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div className={styles.errorContainer}>
            <div className={styles.glitchWrapper}>
                <div className={styles.glitch} data-text="Error">Error</div>
            </div>
            <p className={styles.errorMessage}>{message}</p>
            <button className={styles.retryButton} onClick={() => window.location.reload()}>
                Try Again
            </button>
        </div>
    );
};

export default ErrorMessage;