import React, { useState } from 'react';
import axios from 'axios';
import { useAccount, useSignMessage } from 'wagmi';
import { encryptData, signToKeccak256 } from '@/lib/encryption';
import styles from './FileUpload.module.css';
import { FaUpload } from "react-icons/fa";
import { MESSAGE } from '../../app.settings';

interface UploadResult {
  ipfsHash: string | null;
  error: string | null;
}

const useLocalStorageUpload = () => {
  const [result, setResult] = useState<UploadResult>({ ipfsHash: null, error: null });
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

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

  const handleUpload = async () => {
    if (!address) {
      setResult({ ipfsHash: null, error: 'No wallet connected!' });
      return;
    }

    const data = fetchDataFromLocalStorage();
    if (Object.keys(data).length === 0) {
      setResult({ ipfsHash: null, error: 'No data found in localStorage' });
      return;
    }

    try {
      const ipfsHash = await uploadData(data);
      setResult({ ipfsHash, error: null });
    } catch (error) {
      setResult({ ipfsHash: null, error: 'Error encrypting and uploading data!' });
    }
  };

  return { ...result, handleUpload, isWalletConnected: !!address };
};

const LocalStorageUpload: React.FC = () => {
  const { ipfsHash, error, handleUpload, isWalletConnected } = useLocalStorageUpload();

  return (
    <div className={styles.container}>
      <p className={styles.warning}>This feature is experimental.</p>
      <div className={styles.header}>
        <p>Encrypt and upload your favorite data to IPFS.</p>
      </div>
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
        <button type="submit" className={styles.button} disabled={!isWalletConnected}>
          Upload <FaUpload />
        </button>
      </form>
      {ipfsHash && <p className={styles.success}>Successfully uploaded! IPFS Hash: {ipfsHash}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default LocalStorageUpload;