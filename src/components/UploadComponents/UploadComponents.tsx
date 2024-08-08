import { useAccount } from 'wagmi';
import styles from './UploadPopup.module.css'
import UploadFileToIPFS from './UploadFIleToIPFS';

export default function UploadComponents() {
  const { address } = useAccount();

  return (
    <div className="flex items-center space-x-4">
      {address ? (
        <UploadFileToIPFS />
      ) : (
        <p className={styles.warning} >Connect wallet to use Upload components</p>
      )}
    </div>
  );
}