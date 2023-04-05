import React from 'react'

const ConnectButton = props => {
  const { isConnected, signerAddress, getSigner, provider } = props
  const displayAddress = `${signerAddress?.substring(0,15)}...`

  return (
    <>
      {isConnected ? (
        <div className="buttonContainer">
          {displayAddress}
        </div>
      ) : (
        <div
          className="btn my-2 connectButton"
          onClick={() => getSigner(provider)}
        >
          Connect Wallet
        </div>
      )}
    </>
  )
}

export default ConnectButton