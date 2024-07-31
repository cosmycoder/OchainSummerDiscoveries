import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useAccount, useSignMessage } from 'wagmi';
import { encryptData, signToKeccak256 } from '@/lib/encryption'; // Ensure this utility function is created
import styles from './FileUpload.module.css';
import { FaUpload } from "react-icons/fa";
import { MESSAGE } from '../../app.settings'


const LocalStorageUpload: React.FC = () => {
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const fetchDataFromLocalStorage = () => {
    const allData: { [key: string]: string } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes("FAVORITE#")) {
        const value = localStorage.getItem(key);
        if (value) {
          allData[key] = value;
        }
      }
    }
    return allData;
  };

  const handleUpload = async (allData: { [key: string]: string }) => {
    try {
      const signature = await signMessageAsync({ message: MESSAGE });
      const encryptedName = signToKeccak256(signature);
      const encryptedData = encryptData(JSON.stringify(allData), signature);

      const response = await axios.post('/api/upload', { data: { name: encryptedName, data: encryptedData } }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setIpfsHash(response.data.ipfsHash);
      setError(null); // Clear any previous error
    } catch (error) {
      setError('Error encrypting and uploading data!');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!address) {
      setError('No wallet connected!');
      return;
    }

    const allData = fetchDataFromLocalStorage();
    if (Object.keys(allData).length === 0) {
      setError('No data found in localStorage');
      return;
    }
    console.log("SIGN_KEY",process.env.SIGN_KEY)
    await handleUpload(allData);
  };

  return (
    <div className={styles.container}>
      <p className={styles.warning}>This feature is experimental.</p>
      <div className={styles.header}>
        <p>Encrypt and upload your favorite data to IPFS.</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <button type="submit" className={styles.button} disabled={!address}>
          Upload <FaUpload />
        </button>
      </form>
      {ipfsHash && <p className={styles.success}>Successfully uploaded! IPFS Hash: {ipfsHash}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default LocalStorageUpload;
