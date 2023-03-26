import React from 'react'
import styles from './NotFound.module.css'

const Notfound = () => {
  return (
  <div className={styles.site}>
    <div className={styles.sketch}>
      <div className={`${styles.beeSketch} ${styles.red}`}></div>
      <div className={`${styles.beeSketch} ${styles.blue}`}></div>
    </div>
    <h1 className={styles.h1}>404:
      <small className={styles.small}>Page Not Found</small></h1>
  </div>
  )
}

export default Notfound