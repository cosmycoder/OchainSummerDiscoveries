'use client'

import { FC } from 'react';
import RegistryGraph from '../../components/RegistryGraph/RegistryGraphWrapper';
import Navbar from '../../components/Navbar/Navbar';
import styles from './page.module.css';


const App: FC = () => {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <main>
        <RegistryGraph />
      </main>
    </div>
  );
};

export default App;