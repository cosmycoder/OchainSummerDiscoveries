import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useAccount, useSignMessage } from 'wagmi';
import { decryptData, signToKeccak256 } from '@/lib/encryption'; // Ensure this utility function is correctly implemented and imported
import styles from '../UploadComponents/FileUpload.module.css';
import { FaDownload } from 'react-icons/fa';
import { MESSAGE } from '../../app.settings'

const LocalStorageDownload: React.FC = () => {
    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);

        if (!address) {
            setMessage({ type: 'error', content: 'No wallet connected. Please connect your wallet.' });
            return;
        }

        try {
            const signature = await signMessageAsync({ message: MESSAGE });

            const encryptedName = signToKeccak256(signature);

            const response = await axios.get('/api/download', { params: { name: encryptedName } });
            const downloadResponse = await axios.get(response.data.downloadUrl);

            const favoriteJsonData = decryptData(downloadResponse.data.data, signature);
            const favoriteData = JSON.parse(favoriteJsonData);

            Object.entries(favoriteData).forEach(([key, value]) => {
                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            });

            setMessage({ type: 'success', content: 'Successfully downloaded and decrypted.' });
        } catch (error) {
            console.error('Error downloading and decrypting data:', error);
            setMessage({ type: 'error', content: 'Error downloading and decrypting data!' });
        }
    };

    return (
        <div className={styles.container}>
            <p className={styles.warning}>This feature is experimental.</p>
            <div className={styles.header}>
                <p>Download and decrypt your favorite data from IPFS.</p>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <button type="submit" className={styles.button} disabled={!address}>
                    Download <FaDownload />
                </button>
            </form>
            {message && (
                <p className={message.type === 'error' ? styles.error : styles.success}>
                    {message.content}
                </p>
            )}
        </div>
    );
};

export default LocalStorageDownload;
