import React, { useState, useEffect } from 'react';

const History = () => {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    const savedReadings = JSON.parse(localStorage.getItem('tarotReadings') || '[]');
    setReadings(savedReadings);
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your reading history?')) {
      localStorage.removeItem('tarotReadings');
      setReadings([]);
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'love': return 'Love & Relationships';
      case 'money': return 'Money & Career';
      case 'crypto': return 'Crypto & Trading';
      case 'life': return 'General Life';
      default: return category;
    }
  };

  if (readings.length === 0) {
    return (
      <div className="history">
        <div className="card">
          <p>No reading history yet. Complete your first tarot reading to see it here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Reading History</h2>
          <button onClick={clearHistory} style={{ backgroundColor: '#ef4444', padding: '8px 12px' }}>
            Clear History
          </button>
        </div>
        <p>Recent readings ({readings.length} total)</p>
      </div>
      
      {readings.map((reading) => (
        <div key={reading.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3>{getCategoryName(reading.category)}</h3>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              {new Date(reading.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p style={{ fontStyle: 'italic', marginBottom: '12px' }}>"{reading.question}"</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {reading.cards.slice(0, 3).map((card, index) => (
                <span key={index} style={{ marginRight: '8px', fontSize: '0.8rem' }}>
                  {card.name} ({card.isUpright ? 'U' : 'R'})
                </span>
              ))}
            </div>
            <span className={`vibe-${reading.vibe.toLowerCase()}`}>
              {reading.vibe}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;