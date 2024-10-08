import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useAccount, useSignMessage } from 'wagmi';
import { decryptData, signToKeccak256 } from '@/lib/encryption';
import styles from '../UploadComponents/Upload.module.css';
import { FaDownload } from 'react-icons/fa';
import { MESSAGE } from '../../app.settings';
import DownloadingAnimation from './DownloadingAnimation';

const DownloadFileFromIPFS: React.FC = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'progress'; content: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage({ type: 'progress', content: 'Downloading in progress' });
    if (!address) {
      setMessage({ type: 'error', content: 'No wallet connected. Please connect your wallet.' });
      return;
    }

    try {
      const signature = await signMessageAsync({ message: MESSAGE });
      const encryptedName = signToKeccak256(signature);

      const response = await axios.post('/api/download', { data: { name: encryptedName } });
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
      <DownloadingAnimation message={message} />
      <div className={styles.header}>
        Download and decrypt your favorite data from IPFS.
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <button type="submit" className={styles.button} disabled={!address}>
          Download <FaDownload />
        </button>
      </form>
    </div>
  );
};

export default DownloadFileFromIPFS;
