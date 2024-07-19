'use client';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Badge,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import styles from './WalletComponents.module.css';
import { FC } from 'react';

const WalletComponents: FC = () => (
  <Wallet >
    <ConnectWallet withWalletAggregator className={styles.coolButton}>
      <Avatar className="h-6 w-6" />
      <Name className={styles.name} />
    </ConnectWallet>
    <WalletDropdown className={styles.dropdown}>
      <Identity schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9" className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
        <Avatar />
        <Name>
          <Badge />
        </Name>
        <Address />
        <EthBalance />
      </Identity>
      <WalletDropdownLink
        icon="wallet"
        href="https://wallet.coinbase.com"
      >
        Go to Wallet Dashboard
      </WalletDropdownLink>
      <WalletDropdownDisconnect />
    </WalletDropdown>
  </Wallet>

);

export default WalletComponents;