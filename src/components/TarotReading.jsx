import React, { useState } from 'react';
import { tarotDeck } from '../utils/tarotDeck';
import { getAITarotInterpretation, getOverallVibeFromAI } from '../utils/tarotAI';
import { getContextualData, generatePersonalizedSummary } from '../utils/contextualData';

const TarotReading = () => {
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState(null);
  const [isReading, setIsReading] = useState(false);

  // Function to get a random card with orientation
  const getRandomCard = () => {
    const cardName = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    const isUpright = Math.random() > 0.5;
    return { name: cardName, isUpright };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !question) return;
    
    setIsReading(true);
    
    try {
      // Get contextual data from the web based on category
      const contextData = await getContextualData(category);
      
      // Get three random cards
      const selectedCards = [getRandomCard(), getRandomCard(), getRandomCard()];
      
      // Get AI interpretations for each card
      const cardsWithInterpretations = await Promise.all(
        selectedCards.map(async (card) => {
          const interpretation = await getAITarotInterpretation(
            card.name,
            card.isUpright,
            category,
            question
          );
          return {
            ...card,
            interpretation
          };
        })
      );
      
      // Get overall vibe from AI
      const vibe = await getOverallVibeFromAI(selectedCards, category, question);
      
      // Generate personalized summary and action plan
      const personalizedSummary = await generatePersonalizedSummary(
        selectedCards,
        category,
        question,
        vibe,
        contextData
      );
      
      const newReading = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        category,
        question,
        cards: cardsWithInterpretations,
        vibe,
        contextualData: contextData, // Add web-based context
        personalizedSummary: personalizedSummary // Add AI-generated summary
      };
      
      setReading(newReading);
      setIsReading(false);
      
      // Save to localStorage
      const savedReadings = JSON.parse(localStorage.getItem('tarotReadings') || '[]');
      const updatedReadings = [newReading, ...savedReadings.slice(0, 9)]; // Keep only last 10
      localStorage.setItem('tarotReadings', JSON.stringify(updatedReadings));
    } catch (error) {
      console.error('Error generating reading:', error);
      setIsReading(false);
      alert('Error generating reading. Please try again.');
    }
  };

  const resetReading = () => {
    setReading(null);
    setCategory('');
    setQuestion('');
  };

  return (
    <div className="tarot-reading">
      {!reading ? (
        <form onSubmit={handleSubmit}>
          <div className="card">
            <h2>Choose a Category</h2>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="love">Love & Relationships</option>
              <option value="money">Money & Career</option>
              <option value="crypto">Crypto & Trading</option>
              <option value="life">General Life</option>
            </select>
          </div>
          
          <div className="card">
            <h2>Your Question</h2>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              rows="3"
              required
            />
          </div>
          
          <button type="submit" disabled={isReading || !category || !question}>
            {isReading ? 'Consulting the Cards...' : 'Get My Reading'}
          </button>
        </form>
      ) : (
        <div className="reading-result">
          <div className="card">
            <h2>Your Reading</h2>
            <p><strong>Category:</strong> {category.charAt(0).toUpperCase() + category.slice(1)}</p>
            <p><strong>Question:</strong> "{question}"</p>
            
            {/* Display contextual data from the web */}
            {reading.contextualData && (
              <div className="context-box">
                <div className="context-title">
                  🌐 Live Context
                </div>
                {reading.contextualData.primary && (
                  <p style={{fontSize: '0.9rem', margin: '8px 0 0 0'}}>
                    {reading.contextualData.primary.advice}
                    {category === 'crypto' && reading.contextualData.primary.btcChange && (
                      <span style={{display: 'block', marginTop: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#6366f1'}}>
                        📊 BTC: {reading.contextualData.primary.btcChange > 0 ? '+' : ''}{reading.contextualData.primary.btcChange}% | 
                        ETH: {reading.contextualData.primary.ethChange > 0 ? '+' : ''}{reading.contextualData.primary.ethChange}%
                      </span>
                    )}
                  </p>
                )}
                {reading.contextualData.cosmic && (
                  <p style={{fontSize: '0.85rem', margin: '12px 0 0 0', fontStyle: 'italic', color: '#6366f1'}}>
                    🌙 {reading.contextualData.cosmic.advice}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="cards-display">
            {reading.cards.map((card, index) => (
              <div key={index} className={`visual-card ${!card.isUpright ? 'reversed' : ''}`}>
                <div className="card-header">
                  <div className="card-number">{['1️⃣', '2️⃣', '3️⃣'][index]}</div>
                  <div className="card-orientation">
                    {card.isUpright ? '⬆️ Upright' : '⬇️ Reversed'}
                  </div>
                </div>
                <div className="card-name">✨ {card.name}</div>
                <div className="card-interpretation">
                  {card.interpretation}
                </div>
              </div>
            ))}
          </div>
          
          <div className={`verdict-box ${reading.vibe.toLowerCase()}`}>
            <div className="verdict-title">
              🔮 Overall Vibe: <span className={`vibe-${reading.vibe.toLowerCase()}`}>{reading.vibe}</span>
            </div>
            
            {reading.personalizedSummary ? (
              <div className="summary-box" style={{marginTop: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <h3>📝 Personalized Reading Summary</h3>
                <div className="summary-content">
                  {reading.personalizedSummary}
                </div>
              </div>
            ) : (
              <div className="verdict-content">
                <p>This reading suggests the overall energy around your question is <strong>{reading.vibe.toLowerCase()}</strong>.</p>
                
                <div style={{marginTop: '16px'}}>
                  <strong>📋 Summary & Action Plan:</strong>
                  <p style={{marginTop: '8px'}}>
                    {reading.vibe === 'Positive' && (
                      <>The cards show favorable energy surrounding your situation. This is a good time to move forward with confidence. Trust the positive momentum and take decisive action while staying grounded.</>
                    )}
                    {reading.vibe === 'Neutral' && (
                      <>The cards indicate a balanced energy with both opportunities and challenges. Proceed with awareness and careful consideration. Stay flexible and adapt your approach as needed.</>
                    )}
                    {reading.vibe === 'Caution' && (
                      <>The cards suggest proceeding with care and reflection. This is a time to pause, reassess, and address any underlying issues before moving forward. Don't rush important decisions.</>
                    )}
                  </p>
                </div>
                
                <div className="verdict-quote">
                  💡 <strong>Key Takeaway:</strong> Review each card's guidance above and apply the clear directions to your specific situation. Remember, you have the power to shape your own path.
                </div>
              </div>
            )}
          </div>
          
          <div className="disclaimer">
            <p><strong>Disclaimer:</strong> This tarot reading is for entertainment purposes only and should not be considered financial, investment, or professional advice. Always do your own research before making financial decisions.</p>
          </div>
          
          <button onClick={resetReading}>Get Another Reading</button>
        </div>
      )}
    </div>
  );
};

export default TarotReading;
