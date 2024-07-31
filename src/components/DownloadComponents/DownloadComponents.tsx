import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import LocalStorageDownload from './FileDownload';
import styles from './DownloadPopup.module.css'

export default function DownloadComponents() {
  const { address } = useAccount();

  return (
    <div className="flex items-center space-x-4">
      {address ? (
      <LocalStorageDownload />
      ) : ( 
    <p className={styles.warning} >Connect wallet to use Download components</p>
      )}
    </div>
  );
}