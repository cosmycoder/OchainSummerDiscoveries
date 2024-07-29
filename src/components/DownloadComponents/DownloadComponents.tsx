import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import styles from './DownloadPopup.module.css'

export default function DownloadComponents() {
  const { address } = useAccount();

  return (
    <div className="flex items-center space-x-4">
      {address ? (
      <p className={styles.warning} > Comming soon! </p>
      ) : ( 
    <p className={styles.warning} >Connect wallet to use Download components</p>
      )}
    </div>
  );
}