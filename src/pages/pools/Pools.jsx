import React from 'react'
import styles from './Pools.module.css'

const Pools = () => {
  return (
    <div className={styles.wrapPools}>
      <div className={styles.poolsHeader}>
        <h3 className={styles.poolsHeaderTitle}>Pools</h3>
        <div className={styles.poolsHeaderOption}>
          <button className={styles.btnMore}>More</button>
          <button className={styles.btnNewPosition}>+ New Position</button>
        </div>
      </div>
      <div className={styles.poolsBody}>
        <p>Your active V3 liquidity positions will appear here.</p>
        <button className={styles.btnConnect}>Connect a wallet</button>
      </div>
      <div className={styles.poolsFooter}>
        <a className={styles.poolsFooterAbout} href="https://support.uniswap.org/hc/en-us/categories/8122334631437-Providing-Liquidity-" target="_blank" rel="noreferrer">
          <p className={styles.poolsFooterAboutTitle}>Learn about providing liquidity</p>
          <p className={styles.poolsFooterAboutDesc}>Check out our v3 LP walkthrough and migration guides.</p>     
        </a>
        <a className={styles.poolsFooterTopPools} href="https://info.uniswap.org/#/pools" target="_blank" rel="noreferrer">
          <p className={styles.poolsFooterAboutTitle}>Top pools</p>
          <p className={styles.poolsFooterAboutDesc}>Explore Uniswap Analytics.</p>
        </a>
      </div>
    </div>
  )
}

export default Pools