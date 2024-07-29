import { useAccount } from 'wagmi';
import styles from './UploadPopup.module.css'

export default function UploadComponents() {
  const { address } = useAccount();

  return (
    <div className="flex items-center space-x-4">
      {address ? (
        <p className={styles.warning} >Comming soon!</p>
      ) : (
        <p className={styles.warning} >Connect wallet to use Upload components</p>
      )}
    </div>
  );
}