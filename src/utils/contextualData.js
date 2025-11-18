// Fetch real-time contextual data to enhance tarot readings

// Crypto market data (free, no API key needed)
export async function getCryptoMarketData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
    if (!response.ok) return null;
    
    const data = await response.json();
    const btcChange = data.bitcoin?.usd_24h_change || 0;
    const ethChange = data.ethereum?.usd_24h_change || 0;
    const avgChange = (btcChange + ethChange) / 2;
    
    let sentiment = 'neutral';
    if (avgChange > 5) sentiment = 'bullish';
    else if (avgChange < -5) sentiment = 'bearish';
    
    return {
      btcChange: btcChange.toFixed(2),
      ethChange: ethChange.toFixed(2),
      sentiment,
      advice: getMarketAdvice(sentiment)
    };
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return null;
  }
}

function getMarketAdvice(sentiment) {
  const advice = {
    bullish: 'Current market shows positive momentum. Your cards combined with bullish trends suggest opportunities for growth.',
    bearish: 'Markets are experiencing downward pressure. Your reading emphasizes caution and strategic positioning.',
    neutral: 'Markets are consolidating. Your cards suggest patience and careful observation before major moves.'
  };
  return advice[sentiment];
}

// Economic/Financial sentiment (using a free news sentiment API)
export async function getFinancialSentiment() {
  try {
    // Using a free news API for financial sentiment
    const response = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/us.json');
    if (!response.ok) return null;
    
    const data = await response.json();
    const headlines = data.articles?.slice(0, 5).map(a => a.title) || [];
    
    // Simple sentiment analysis based on keywords
    const positiveWords = ['gain', 'rise', 'growth', 'success', 'profit', 'boom', 'surge'];
    const negativeWords = ['fall', 'loss', 'decline', 'crash', 'fear', 'crisis', 'drop'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    headlines.forEach(headline => {
      const lower = headline.toLowerCase();
      positiveWords.forEach(word => {
        if (lower.includes(word)) positiveCount++;
      });
      negativeWords.forEach(word => {
        if (lower.includes(word)) negativeCount++;
      });
    });
    
    let sentiment = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'cautious';
    
    return {
      sentiment,
      topHeadline: headlines[0] || 'No recent news',
      advice: getFinancialAdvice(sentiment)
    };
  } catch (error) {
    console.error('Error fetching financial sentiment:', error);
    return null;
  }
}

function getFinancialAdvice(sentiment) {
  const advice = {
    positive: 'Current financial news is optimistic. Your reading aligns with opportunities in the economic landscape.',
    cautious: 'Financial headlines suggest caution. Your cards echo the need for careful decision-making.',
    neutral: 'Economic outlook is mixed. Your reading suggests balanced approach to financial matters.'
  };
  return advice[sentiment];
}

// Astrological/Cosmic data (moon phase, etc.)
export async function getCosmicData() {
  try {
    // Get current moon phase (using date-based calculation)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // Simple moon phase calculation (approximate)
    const c = Math.floor(year / 100);
    const e = 2 - c + Math.floor(c / 4);
    const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + e - 1524.5;
    const daysSinceNew = (jd - 2451549.5) % 29.53;
    
    let phase = '';
    let phaseAdvice = '';
    
    if (daysSinceNew < 1.84566) {
      phase = 'New Moon';
      phaseAdvice = 'New beginnings and fresh starts. Perfect for setting intentions.';
    } else if (daysSinceNew < 7.38264) {
      phase = 'Waxing Crescent';
      phaseAdvice = 'Growth and building phase. Take action on your goals.';
    } else if (daysSinceNew < 9.22830) {
      phase = 'First Quarter';
      phaseAdvice = 'Decision time. Overcome obstacles and push forward.';
    } else if (daysSinceNew < 14.76532) {
      phase = 'Waxing Gibbous';
      phaseAdvice = 'Refinement phase. Perfect time to adjust and improve.';
    } else if (daysSinceNew < 16.61096) {
      phase = 'Full Moon';
      phaseAdvice = 'Illumination and revelation. Things come to light.';
    } else if (daysSinceNew < 22.14798) {
      phase = 'Waning Gibbous';
      phaseAdvice = 'Gratitude and sharing. Release what no longer serves.';
    } else if (daysSinceNew < 23.99362) {
      phase = 'Last Quarter';
      phaseAdvice = 'Release and let go. Clear space for new opportunities.';
    } else {
      phase = 'Waning Crescent';
      phaseAdvice = 'Rest and reflection. Prepare for new cycles.';
    }
    
    return {
      phase,
      advice: `The ${phase} energy supports your reading: ${phaseAdvice}`
    };
  } catch (error) {
    console.error('Error calculating cosmic data:', error);
    return null;
  }
}

// Love/Relationship general trends (using random "compatibility" calculation)
export async function getRelationshipInsight() {
  try {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    // Generate a "daily love energy" score based on day
    const loveEnergy = (dayOfYear % 10) + 1; // 1-10 scale
    
    let insight = '';
    if (loveEnergy >= 8) {
      insight = 'Today\'s energies are highly favorable for love and connection. Open your heart.';
    } else if (loveEnergy >= 5) {
      insight = 'Romantic energies are balanced today. Good for honest communication.';
    } else {
      insight = 'Love energies suggest introspection. Focus on self-love and clarity.';
    }
    
    return {
      energy: loveEnergy,
      advice: insight
    };
  } catch (error) {
    console.error('Error getting relationship insight:', error);
    return null;
  }
}

// General life wisdom (daily quote/affirmation)
export async function getDailyWisdom() {
  try {
    const response = await fetch('https://api.quotable.io/random?tags=wisdom|inspirational');
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      quote: data.content,
      author: data.author,
      advice: `Today's wisdom to complement your reading: "${data.content}" - ${data.author}`
    };
  } catch (error) {
    console.error('Error fetching daily wisdom:', error);
    return null;
  }
}

// Main function to get contextual data based on category
export async function getContextualData(category) {
  try {
    let data = null;
    
    switch (category) {
      case 'crypto':
        data = await getCryptoMarketData();
        break;
      case 'money':
        data = await getFinancialSentiment();
        break;
      case 'love':
        data = await getRelationshipInsight();
        break;
      case 'life':
        data = await getDailyWisdom();
        break;
      default:
        data = await getCosmicData();
    }
    
    // Always add cosmic data as supplementary info
    const cosmic = await getCosmicData();
    
    return {
      primary: data,
      cosmic: cosmic
    };
  } catch (error) {
    console.error('Error getting contextual data:', error);
    return null;
  }
}

// Generate personalized AI summary and action plan
export async function generatePersonalizedSummary(cards, category, question, vibe, contextData) {
  try {
    // Build context about the reading
    const cardsDescription = cards.map((card, i) => 
      `${i + 1}. ${card.name} (${card.isUpright ? 'Upright' : 'Reversed'})`
    ).join(', ');
    
    const contextInfo = contextData?.primary ? 
      `\nCurrent context: ${contextData.primary.advice}` : '';
    
    const cosmicInfo = contextData?.cosmic ? 
      `\n${contextData.cosmic.advice}` : '';
    
    // Use Hugging Face's free inference API
    const prompt = `As an expert tarot reader, provide a detailed, personalized 3-paragraph summary and action plan for this reading:

Question: "${question}"
Category: ${category}
Cards Drawn: ${cardsDescription}
Overall Energy: ${vibe}${contextInfo}${cosmicInfo}

Provide:
1. SYNTHESIS (2-3 sentences): How these specific cards work together to answer this question
2. PERSONALIZED INSIGHT (2-3 sentences): What this means specifically for the querent's situation
3. ACTION PLAN (3-4 concrete steps): Specific, actionable steps they should take based on these exact cards

Be specific, reference the actual cards, and make it feel personal and unique to this reading.`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 400,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data[0]?.generated_text || '';
    
    if (generatedText) {
      return generatedText.trim();
    }
    
    // Fallback to detailed template-based summary
    return generateTemplateSummary(cards, category, question, vibe);
  } catch (error) {
    console.error('Error generating personalized summary:', error);
    return generateTemplateSummary(cards, category, question, vibe);
  }
}

// Detailed fallback summary when AI is unavailable
function generateTemplateSummary(cards, category, question, vibe) {
  // Build engaging card-by-card breakdown with REAL interpretations from cards
  let cardBreakdown = '';
  
  cards.forEach((card, index) => {
    const emoji = ['1️⃣', '2️⃣', '3️⃣'][index];
    const orientation = card.isUpright ? 'Upright' : 'Reversed';
    
    // Extract the REAL interpretation that was fetched from the card
    const interpretation = card.interpretation || 'No interpretation available';
    
    cardBreakdown += `${emoji} **${card.name}** — *${orientation}*\n`;
    cardBreakdown += `${interpretation}\n\n`;
  });
  
  // Build summary table with card names
  let summaryTable = `📊 **Quick Read**\n\n`;
  summaryTable += `| Card | Orientation | Key Energy |\n`;
  summaryTable += `|------|-------------|------------|\n`;
  cards.forEach(card => {
    const orientation = card.isUpright ? '⬆️ Upright' : '⬇️ Reversed';
    const energy = getCardKeyword(card.name, card.isUpright);
    summaryTable += `| ${card.name} | ${orientation} | ${energy} |\n`;
  });
  summaryTable += '\n';
  
  // Generate category-specific final verdict based on actual cards drawn
  const finalVerdict = getFinalVerdict(cards, category, question, vibe);
  
  return `${cardBreakdown}---\n\n${summaryTable}${finalVerdict}`;
}

function getCardKeyword(cardName, isUpright) {
  const keywords = {
    'The Fool': isUpright ? 'New beginnings' : 'Recklessness',
    'The Magician': isUpright ? 'Manifestation' : 'Manipulation',
    'The High Priestess': isUpright ? 'Intuition' : 'Secrets',
    'The Hermit': isUpright ? 'Patience' : 'Isolation',
    'Wheel of Fortune': isUpright ? 'Cycles/Luck' : 'Bad timing',
    'The Tower': isUpright ? 'Disruption' : 'Denial',
    'The Sun': isUpright ? 'Success' : 'Temporary setback',
    'Death': isUpright ? 'Transformation' : 'Resistance',
    'The Emperor': isUpright ? 'Structure' : 'Control issues',
    'Strength': isUpright ? 'Courage' : 'Self-doubt',
    'The Lovers': isUpright ? 'Alignment' : 'Conflict',
    'The Empress': isUpright ? 'Abundance' : 'Excess',
    'The Hierophant': isUpright ? 'Tradition' : 'Rebellion',
    'The Chariot': isUpright ? 'Determination' : 'Lack of direction',
    'Justice': isUpright ? 'Fairness' : 'Injustice',
    'The Hanged Man': isUpright ? 'Sacrifice' : 'Stagnation',
    'Temperance': isUpright ? 'Balance' : 'Imbalance',
    'The Devil': isUpright ? 'Bondage' : 'Liberation',
    'The Star': isUpright ? 'Hope' : 'Despair',
    'The Moon': isUpright ? 'Illusion' : 'Clarity emerging',
    'Judgement': isUpright ? 'Awakening' : 'Self-doubt',
    'The World': isUpright ? 'Completion' : 'Unfinished',
  };
  return keywords[cardName] || (isUpright ? 'Positive energy' : 'Challenges');
}

function getFinalVerdict(cards, category, question, vibe) {
  const vibeEmoji = {
    'Positive': '✅',
    'Neutral': '⚖️', 
    'Caution': '⚠️'
  };
  
  let verdict = `🧭 **Final Verdict for: "${question}"**\n`;
  verdict += `${vibeEmoji[vibe]} **${vibe}** — `;
  
  if (category === 'crypto') {
    if (vibe === 'Positive') {
      verdict += `**Yes, but smart** — DCA in, don't full send. The cards say timing is decent, but stay disciplined.\n\n`;
      verdict += `> "Don't chase the candle — make the candle chase you." 🔥`;
    } else if (vibe === 'Caution') {
      verdict += `**Hell no** — or at least not yet. The cards are screaming patience. Wait for better setup.\n\n`;
      verdict += `> "The best trade is sometimes no trade." 🛡️`;
    } else {
      verdict += `**Neutral lean** — small position OK if you must, but don't bet the farm. Scale in carefully.\n\n`;
      verdict += `> "When in doubt, size down." ⚖️`;
    }
  } else if (category === 'love') {
    if (vibe === 'Positive') {
      verdict += `**Go for it** — the energy is aligned. Shoot your shot with confidence.\n\n`;
      verdict += `> "Fortune favors the bold in love." 💘`;
    } else if (vibe === 'Caution') {
      verdict += `**Pump the brakes** — work on yourself first. Timing isn't right yet.\n\n`;
      verdict += `> "Self-love first, then love finds you." 🌱`;
    } else {
      verdict += `**Proceed with awareness** — potential is there, but stay grounded.\n\n`;
      verdict += `> "Love smart, not just hard." 💭`;
    }
  } else if (category === 'money') {
    if (vibe === 'Positive') {
      verdict += `**Green light** — the opportunity looks solid. Take calculated action.\n\n`;
      verdict += `> "Preparation meets opportunity = success." 💰`;
    } else if (vibe === 'Caution') {
      verdict += `**Red flag territory** — more research needed before committing.\n\n`;
      verdict += `> "Protect your capital, opportunities come again." 🛡️`;
    } else {
      verdict += `**Yellow light** — could work with proper planning and patience.\n\n`;
      verdict += `> "Slow money is still money." 📈`;
    }
  } else {
    verdict += `The cards suggest ${vibe.toLowerCase()} energy. ${cards.map(c => c.name).join(', ')} are telling you to `;
    verdict += vibe === 'Positive' ? 'move forward with confidence.' : vibe === 'Caution' ? 'pause and reflect before acting.' : 'proceed with balanced awareness.';
    verdict += `\n\n> "Trust the journey, honor the process." 🌟`;
  }
  
  return verdict;
}
