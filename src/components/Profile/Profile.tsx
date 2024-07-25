// components/Avatar.tsx
'use client';

import React, { ReactNode } from 'react';
import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { formatEther } from 'viem';
import AvatarView from '../Avator/AvatorView';
import styles from './Profile.module.css';  // Import the CSS module

type Props = {
  children: ReactNode
};

const Profile = ({ children }: Props) => {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { data: ensName } = useEnsName({ address, chainId: mainnet.id });
  const { data: avatar } = useEnsAvatar({ name: ensName ?? 'coinbase.eth', chainId: mainnet.id });

  const formatBalance = (value: bigint, decimals: number = 4): string => {
    const formatted = Number(formatEther(value)).toFixed(decimals);
    return parseFloat(formatted).toString();
  };

  const formattedBalance = balanceData ? `${formatBalance(balanceData.value, 4)} ${balanceData.symbol}` : '-';

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <AvatarView imgSrc={avatar ?? '/baselogo.png'} />
        <div className={styles.name}>{ensName ? ensName
          : address ? address
            : 'Not connected!'}</div>
      </div>
      {children}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>Address</div>
          <div className={`${styles.infoValue} ${styles.addressValue}`}>{address ?? '-'}</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>Balance</div>
          <div className={styles.infoValue}>{formattedBalance}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
