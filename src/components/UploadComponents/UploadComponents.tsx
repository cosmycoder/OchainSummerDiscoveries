import { useAccount } from 'wagmi';
import styles from './UploadPopup.module.css'
import LocalStorageUpload from './FileUpload';

export default function UploadComponents() {
  const { address } = useAccount();

  return (
    <div className="flex items-center space-x-4">
      {address ? (
        <LocalStorageUpload />
      ) : (
        <p className={styles.warning} >Connect wallet to use Upload components</p>
      )}
    </div>
  );
}