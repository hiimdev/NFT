import './App.css';
import Layout from './layout/Layout';
import Home from './pages/home/Home';
import Swap from './pages/swap/Swap';
import Pools from './pages/pools/Pools';
import Tokens from './pages/tokens/Tokens';
import Nfts from './pages/nfts/Nfts';
import Notfound from './pages/NotFound/NotFound';
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/" element={ <Home/> } />
          <Route path="swap" element={ <Swap/> } />
          <Route path="pools" element={ <Pools/> } />
          <Route path="tokens" element={ <Tokens/> } />
          <Route path="nfts" element={<Nfts />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
