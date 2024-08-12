import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import DownloadFileFromIPFS from './DownloadFileFromIPFS';
import styles from './DownloadPopup.module.css'

const DownloadComponents = () => {
  const { address } = useAccount();

  return (
    <div className="flex items-center space-x-4">
      {address ? (
        <DownloadFileFromIPFS />
      ) : (
        <p className={styles.warning} >Connect wallet to use Download components</p>
      )}
    </div>
  );
}

export default DownloadComponents;