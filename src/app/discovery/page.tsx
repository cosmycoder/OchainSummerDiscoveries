'use client'
import RegistryGraph from '../../components/RegistryGraphWrapper'
import Navbar from '../../components/Navbar'
import '../../styles/Navbar.module.css';

const Home = () => {
  return (
    <div  >
      <Navbar />
      <RegistryGraph />
    </div>
  );
};

export default Home;
