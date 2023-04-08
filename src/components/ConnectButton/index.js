import React, { useState, useEffect } from 'react'
import web3 from 'web3';

const ConnectButton = props => {
  const { isConnected, signerAddress, getSigner, provider } = props
  const displayAddress = `${ signerAddress?.substring(0, 15) }...`
  const displayAddressInfo = signerAddress

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const getBalance = async () => {
      // Kiểm tra nếu trình duyệt không hỗ trợ Web3
      if (typeof window.ethereum === 'undefined') return;

      // Tạo instance của Web3
      const Web3 = new web3(window.ethereum);

      // Lấy địa chỉ tài khoản hiện tại
      const accounts = await Web3.eth.getAccounts();
      const currentAccount = accounts[0];

      // Lấy số dư của tài khoản hiện tại
      const balance = await Web3.eth.getBalance(currentAccount);

      // Chuyển đổi đơn vị từ wei sang ether và cập nhật state
      setBalance(Web3.utils.fromWei(balance, 'ether'));
    };

    getBalance();
  }, []);

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
          <div class="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content modalContentInfo">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">{displayAddressInfo}</h5>
                </div>
                <div class="modal-body">
                  <p>Balance: {balance} ETH</p>
                </div>
                <div class="modal-footer">
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