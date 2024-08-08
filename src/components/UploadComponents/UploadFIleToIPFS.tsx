import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import { useAccount, useSignMessage } from 'wagmi';
import { encryptData, signToKeccak256 } from '@/lib/encryption';
import styles from './Upload.module.css';
import { FaUpload } from "react-icons/fa";
import { MESSAGE } from '../../app.settings';
import DownloadingAnimation from '../DownloadComponents/DownloadingAnimation';

const UploadFileToIPFS: React.FC = () => {
  const { address } = useAccount();
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'progress'; content: string } | null>(null);
  const { signMessageAsync } = useSignMessage();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage({ type: 'progress', content: 'Uploading in progress' });

    if (!address) {
      setMessage({ type: 'error', content: 'No wallet connected. Please connect your wallet.' });
      return;
    }

    const fetchDataFromLocalStorage = (): Record<string, string> => {
      return Object.entries(localStorage)
        .filter(([key]) => key.includes("FAVORITE#"))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    };

    const uploadData = async (data: Record<string, string>): Promise<string> => {

      const signature = await signMessageAsync({ message: MESSAGE });
      const encryptedName = signToKeccak256(signature);
      const encryptedData = encryptData(JSON.stringify(data), signature);

      const response = await axios.post('/api/upload',
        { data: { name: encryptedName, data: encryptedData } },
        { headers: { 'Content-Type': 'application/json' } }
      );

      return response.data.ipfsHash;
    };

    try {
      const data = fetchDataFromLocalStorage();
      if (Object.keys(data).length === 0) {
        setMessage({ type: 'error', content: 'No data found in localStorage' });
        return;
      }
      const ipfsHash = await uploadData(data);
      console.log(`Successfully uploaded! IPFS Hash: ${ipfsHash}`)
      setMessage({ type: 'success', content: `Successfully uploaded!` });
    } catch (error) {
      console.log(`'Error encrypting and uploading data! ${error}`)
      setMessage({ type: 'error', content: 'Error encrypting and uploading data!' });
    }

  };

  return (
    <div className={styles.container}>
      <DownloadingAnimation message={message} />
      <div className={styles.header}>
        <p>Encrypt and upload your favorite data to IPFS.</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <button type="submit" className={styles.button} disabled={!address}>
          Upload <FaUpload />
        </button>
      </form>
    </div>
  );
};

export default UploadFileToIPFS;