import React from 'react';
import Navbar from '../components/navbar/Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: 100 }}>
        { children }
      </div>
    </>
  );
};

export default Layout;
