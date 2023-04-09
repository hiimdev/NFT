import React from 'react'

const ConnectButton = props => {
  const { isConnected, signerAddress, getSigner, provider, balance } = props
  const displayAddress = `${ signerAddress?.substring(0, 15) }...`
  const displayAddressInfo = signerAddress

  const logout = async () => {
    window.location.reload();
  }

  return (
    <>
      {isConnected ? (
        <>
          <button className="buttonContainer" data-toggle="modal" data-target="#exampleModal">
            {displayAddress}
          </button>
          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content modalContentInfo">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">{displayAddressInfo}</h5>
                </div>
                <div className="modal-body">
                  <p>Balance: {balance} ETH</p>
                </div>
                <div className="modal-footer">
                  <button onClick={() => logout()} type="button" className="btnLogout" data-dismiss="modal">logout</button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </>
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