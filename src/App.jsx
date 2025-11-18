import React, { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import './index.css';
import TarotReading from './components/TarotReading';
import History from './components/History';

function App() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  
  // Mock wallet address for local development
  const mockAddress = '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4';
  const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const displayAddress = isLocalDevelopment ? mockAddress : address;
  const displayIsConnected = isLocalDevelopment ? true : isConnected;
  const [activeTab, setActiveTab] = useState('reading');
  const [isReady, setIsReady] = useState(false);

  // Hide splash screen when app is ready
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Try to call the SDK ready action, but don't wait indefinitely
        const timeout = new Promise((resolve) => {
          setTimeout(() => resolve(), 3000); // 3 second timeout
        });
        
        // Race between SDK ready and timeout
        await Promise.race([
          sdk.actions.ready().catch(() => console.log('SDK ready failed, continuing anyway')),
          timeout
        ]);
        
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        // Still set ready to true to show the app even if SDK fails
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  const handleConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (!isReady) {
    return <div className="app-container">Loading...</div>;
  }

  return (
    <div className="app-container">
      <h1>🔮 Fate @ Base</h1>
      
      {!displayIsConnected ? (
        <div className="card">
          <h2>Connect Your Wallet</h2>
          <p>To use this tarot reading miniapp, please connect your wallet.</p>
          <button onClick={handleConnect}>
            Connect Wallet
          </button>
          {error && <p className="error">Error: {error.message}</p>}
        </div>
      ) : (
        <>
          <div className="wallet-info card">
            <p>Connected: {displayAddress?.substring(0, 6)}...{displayAddress?.substring(displayAddress.length - 4)}</p>
            {isLocalDevelopment && <p style={{fontSize: '0.8rem', color: '#666', marginTop: '4px'}}>(Local development mode - using mock wallet)</p>}
            <button onClick={handleDisconnect}>Disconnect</button>
          </div>
          
          <div className="tabs">
            <div 
              className={`tab ${activeTab === 'reading' ? 'active' : ''}`}
              onClick={() => setActiveTab('reading')}
            >
              Reading
            </div>
            <div 
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </div>
          </div>
          
          {activeTab === 'reading' ? <TarotReading /> : <History />}
        </>
      )}
    </div>
  );
}

export default App;