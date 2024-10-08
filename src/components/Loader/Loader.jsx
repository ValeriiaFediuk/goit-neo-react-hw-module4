import React from 'react';
import { Oval } from 'react-loader-spinner';
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loader}>
      <Oval color="#3f51b5" height={50} width={50} />
    </div>
  );
};

export default Loader;
