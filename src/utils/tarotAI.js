// Tarot reading using multiple API endpoints for richer content
const TAROT_API_URL = 'https://tarot-api-3hv5.onrender.com';
const BACKUP_API_URL = 'https://rws-cards-api.herokuapp.com';

console.log('Using free Tarot API for readings');

export async function getAITarotInterpretation(cardName, isUpright, category, question) {
  try {
    // Try primary API first
    let response = await fetch(`${TAROT_API_URL}/api/v1/cards/search?name=${encodeURIComponent(cardName)}`);
    
    if (!response.ok) {
      // Try backup API
      const cardSlug = cardName.toLowerCase().replace(/\s+/g, '-').replace(/the-/, '');
      response = await fetch(`${BACKUP_API_URL}/api/v1/cards/${cardSlug}`);
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    let card = data.cards ? data.cards[0] : data;
    
    if (!card) {
      throw new Error('Card not found');
    }
    
    // Extract all available meanings
    const uprightMeaning = card.meaning_up || card.meanings?.light || card.fortune_telling?.[0] || card.desc || '';
    const reversedMeaning = card.meaning_rev || card.meanings?.shadow || 'This card reversed suggests challenges or delays in the area you\'re asking about.';
    const keywords = card.keywords || [];
    const fortuneTelling = card.fortune_telling || [];
    
    // Build rich, unique interpretation
    let interpretation = '';
    
    // Category-specific framing
    const categoryFraming = {
      love: {
        icon: '💕',
        context: 'Love & Relationships',
        questions: [
          'What does this mean for my romantic life?',
          'How should I approach my relationship?',
          'What energy surrounds my love situation?'
        ]
      },
      money: {
        icon: '💼',
        context: 'Career & Finance',
        questions: [
          'What does this mean for my career?',
          'How should I handle my finances?',
          'What opportunities are coming my way?'
        ]
      },
      crypto: {
        icon: '🚀',
        context: 'Crypto & Trading',
        questions: [
          'What does this mean for my investments?',
          'Should I be cautious or bold?',
          'What market energy is indicated?'
        ]
      },
      life: {
        icon: '🌟',
        context: 'Life Path',
        questions: [
          'What does this mean for my journey?',
          'What lesson is being presented?',
          'How can I grow from this?'
        ]
      }
    };
    
    const frame = categoryFraming[category] || categoryFraming.life;
    const baseMeaning = isUpright ? uprightMeaning : reversedMeaning;
    
    interpretation = `${frame.icon} **${frame.context}**\n\n`;
    
    // Add keywords if available
    if (keywords.length > 0) {
      const selectedKeywords = keywords.slice(0, 3).join(', ');
      interpretation += `**Key Themes:** ${selectedKeywords}\n\n`;
    }
    
    // Main meaning
    interpretation += `**Meaning:** ${baseMeaning}\n\n`;
    
    // Add fortune telling elements if available
    if (fortuneTelling.length > 0 && isUpright) {
      const fortune = fortuneTelling[Math.floor(Math.random() * fortuneTelling.length)];
      interpretation += `**Insight:** ${fortune}\n\n`;
    }
    
    // Category-specific actionable advice
    const advice = generateCategoryAdvice(cardName, isUpright, category, keywords);
    interpretation += `**Action Step:** ${advice}`;
    
    return interpretation;
  } catch (error) {
    console.error('Error getting tarot interpretation:', error);
    return generateFallbackInterpretation(cardName, isUpright, category);
  }
}

// Generate unique advice based on card name and context
function generateCategoryAdvice(cardName, isUpright, category, keywords = []) {
  // Extract card number or archetype
  const cardLower = cardName.toLowerCase();
  
  // Specific advice based on major arcana
  const cardAdvice = {
    'fool': {
      love_up: 'Take a leap of faith in love - be spontaneous and open to new romantic adventures',
      love_rev: 'Slow down and think before making romantic commitments - avoid reckless decisions',
      money_up: 'Embrace new career opportunities with optimism - fresh starts can lead to success',
      money_rev: 'Postpone major financial risks until you have a clearer plan',
      crypto_up: 'Consider exploring new crypto projects, but do your research first',
      crypto_rev: 'Avoid impulsive trades - the market may be unpredictable right now',
      life_up: 'Start that new adventure you\'ve been dreaming about - trust your journey',
      life_rev: 'Pause and reflect before making major life changes'
    },
    'magician': {
      love_up: 'Use your charm and communication skills to manifest the relationship you desire',
      love_rev: 'Watch out for manipulation or deception in relationships - be authentic',
      money_up: 'Leverage your skills and resources - you have everything you need to succeed',
      money_rev: 'Avoid using shortcuts or questionable tactics in business',
      crypto_up: 'Apply your knowledge strategically - timing is everything in trading',
      crypto_rev: 'Don\'t fall for get-rich-quick schemes or unrealistic promises',
      life_up: 'Manifest your goals through focused action and willpower',
      life_rev: 'Realign your intentions with your actions - stay honest with yourself'
    },
    'high priestess': {
      love_up: 'Trust your intuition about this person or situation - your instincts are correct',
      love_rev: 'Hidden aspects may be revealed soon - pay attention to what\'s unsaid',
      money_up: 'Listen to your gut about financial opportunities - your inner wisdom knows best',
      money_rev: 'Dig deeper before making decisions - not everything is as it appears',
      crypto_up: 'Your research and intuition will guide profitable decisions',
      crypto_rev: 'Beware of information manipulation - verify sources independently',
      life_up: 'Meditation and reflection will reveal the answers you seek',
      life_rev: 'Stop ignoring your inner voice - reconnect with your intuition'
    },
    'empress': {
      love_up: 'Nurture your relationship with care and affection - abundance in love awaits',
      love_rev: 'Avoid smothering or being overly dependent - maintain healthy boundaries',
      money_up: 'Invest in growth and abundance - your efforts will bear fruit',
      money_rev: 'Cut back on excessive spending - practice financial moderation',
      crypto_up: 'Focus on steady growth strategies rather than volatile plays',
      crypto_rev: 'Don\'t over-invest emotionally or financially in a single position',
      life_up: 'Create and nurture what matters most - abundance flows through creativity',
      life_rev: 'Address creative blocks and find balance between giving and receiving'
    },
    'emperor': {
      love_up: 'Provide stability and leadership in your relationship - create structure',
      love_rev: 'Release control issues - love requires flexibility, not dominance',
      money_up: 'Take charge of your finances with discipline and strategic planning',
      money_rev: 'Rigid approaches won\'t work - adapt your financial strategy',
      crypto_up: 'Implement strict risk management rules and stick to your trading plan',
      crypto_rev: 'Your over-controlling approach is limiting opportunities - loosen up',
      life_up: 'Establish clear boundaries and take authoritative action on your goals',
      life_rev: 'Release the need to control everything - allow life to flow'
    },
    'hierophant': {
      love_up: 'Consider traditional commitment or seek relationship counseling if needed',
      love_rev: 'Break free from conventional expectations - forge your own path in love',
      money_up: 'Follow established procedures and seek mentorship from experienced professionals',
      money_rev: 'Think outside the box - unconventional approaches may serve you better',
      crypto_up: 'Stick to established protocols and proven trading strategies',
      crypto_rev: 'Question mainstream narratives - explore alternative perspectives',
      life_up: 'Seek wisdom from teachers or traditional spiritual practices',
      life_rev: 'Create your own belief system rather than following dogma'
    },
    'lovers': {
      love_up: 'This is a powerful time for deep connection and important relationship choices',
      love_rev: 'Address misalignments in values before committing further',
      money_up: 'Partnerships and collaborations will be profitable - choose allies wisely',
      money_rev: 'Reconsider business partnerships that don\'t align with your values',
      crypto_up: 'Collaborative investment opportunities look promising',
      crypto_rev: 'Conflicting strategies with partners may lead to losses',
      life_up: 'Make choices aligned with your deepest values and truest self',
      life_rev: 'Resolve internal conflicts before making major decisions'
    },
    'chariot': {
      love_up: 'Move forward with determination - victory in love requires focused effort',
      love_rev: 'Regain control of relationship direction before proceeding',
      money_up: 'Drive towards your financial goals with unwavering determination',
      money_rev: 'Lack of focus is hindering progress - realign your efforts',
      crypto_up: 'Stay disciplined through market volatility - your strategy will pay off',
      crypto_rev: 'Scattered approach to trading is causing losses - refocus',
      life_up: 'Overcome obstacles through willpower and strategic action',
      life_rev: 'Restore balance before charging ahead - scattered energy leads nowhere'
    },
    'strength': {
      love_up: 'Approach relationship challenges with gentle patience and inner courage',
      love_rev: 'Build self-confidence before seeking validation from others',
      money_up: 'Inner strength and patience will overcome financial obstacles',
      money_rev: 'Self-doubt is sabotaging opportunities - believe in your abilities',
      crypto_up: 'Maintain emotional discipline during market swings - strength wins',
      crypto_rev: 'Fear-based decisions are hurting returns - develop resilience',
      life_up: 'Face challenges with compassionate strength and self-mastery',
      life_rev: 'Rebuild your confidence through small, consistent victories'
    },
    'hermit': {
      love_up: 'Take time for self-reflection before pursuing new relationships',
      love_rev: 'Isolation is preventing connection - cautiously open up to others',
      money_up: 'Research and analysis will reveal the best financial path forward',
      money_rev: 'Over-analysis is causing paralysis - trust your research and act',
      crypto_up: 'Deep market analysis and patient observation will guide you',
      crypto_rev: 'Stop over-thinking and missing opportunities - find balance',
      life_up: 'Solitude and introspection will provide the answers you need',
      life_rev: 'End excessive isolation - wisdom comes through engagement too'
    },
    'wheel': {
      love_up: 'Embrace the natural cycles of relationships - positive change is coming',
      love_rev: 'Bad timing is affecting romance - be patient as cycles shift',
      money_up: 'Luck is on your side financially - seize favorable opportunities',
      money_rev: 'Ride out current financial downturns - better times are ahead',
      crypto_up: 'Market cycles favor your positions - capitalize on momentum',
      crypto_rev: 'Accept bear market reality and adjust strategy accordingly',
      life_up: 'Positive karma is manifesting - embrace fortunate turns of events',
      life_rev: 'Learn from setbacks - cycles always turn upward eventually'
    },
    'justice': {
      love_up: 'Fairness and honest communication will strengthen your relationship',
      love_rev: 'Address imbalances or injustices in your relationship dynamics',
      money_up: 'Legal or contractual matters will resolve in your favor',
      money_rev: 'Review contracts carefully - unfair terms may exist',
      crypto_up: 'Fair market value assessments will guide smart investments',
      crypto_rev: 'Market manipulation may affect your positions - stay vigilant',
      life_up: 'Karma is working in your favor - ethical actions bring rewards',
      life_rev: 'Face consequences honestly and restore balance through accountability'
    },
    'hanged': {
      love_up: 'Sacrifice and new perspectives will deepen your relationship',
      love_rev: 'Release martyrdom - healthy relationships require mutual give and take',
      money_up: 'Short-term sacrifice will lead to long-term financial gain',
      money_rev: 'Stop waiting passively - take action to change your situation',
      crypto_up: 'HODLing through dips will be rewarded - maintain perspective',
      crypto_rev: 'Forced holding isn\'t strategy - cut losses if needed',
      life_up: 'Surrender control and gain spiritual insight through release',
      life_rev: 'End pointless suffering - stagnation serves no purpose'
    },
    'death': {
      love_up: 'Embrace transformation - endings create space for new love',
      love_rev: 'Resistance to change is prolonging unhealthy patterns',
      money_up: 'Major financial transformation is necessary and beneficial',
      money_rev: 'Clinging to old financial models is preventing growth',
      crypto_up: 'Portfolio rebalancing and strategic exits are wise now',
      crypto_rev: 'Refusing to adapt to market changes will cause losses',
      life_up: 'Welcome profound transformation - rebirth follows endings',
      life_rev: 'Stop resisting necessary change - evolution requires letting go'
    },
    'temperance': {
      love_up: 'Balance and moderation will create harmony in relationships',
      love_rev: 'Extremes are causing relationship stress - find middle ground',
      money_up: 'Balanced approach to spending and saving brings stability',
      money_rev: 'Financial excess or restriction needs correction',
      crypto_up: 'Diversified, balanced portfolio approach minimizes risk',
      crypto_rev: 'Over-trading or extreme positions are risky - moderate your approach',
      life_up: 'Blend opposing forces in your life to achieve inner peace',
      life_rev: 'Restore balance between work, play, and spiritual growth'
    },
    'devil': {
      love_up: 'Recognize unhealthy attachments or toxic patterns in relationships',
      love_rev: 'You\'re breaking free from limiting relationship patterns - continue',
      money_up: 'Be aware of materialistic traps or financial addictions',
      money_rev: 'Release yourself from debt or financial bondage - freedom awaits',
      crypto_up: 'Avoid addictive trading behavior or FOMO - stay disciplined',
      crypto_rev: 'You\'re overcoming compulsive trading habits - maintain progress',
      life_up: 'Acknowledge shadow aspects and limiting beliefs holding you back',
      life_rev: 'Breaking chains of addiction or limitation - liberation is near'
    },
    'tower': {
      love_up: 'Sudden revelations will shake foundations but lead to truth',
      love_rev: 'Avoiding necessary relationship breakdowns prolongs pain',
      money_up: 'Unexpected financial disruption will reveal new opportunities',
      money_rev: 'Denying financial reality will worsen the situation',
      crypto_up: 'Market crashes clear the way for rebuilding stronger positions',
      crypto_rev: 'Ignoring warning signs of collapse serves no one',
      life_up: 'Embrace sudden change as liberation from false structures',
      life_rev: 'Stop delaying inevitable transformation - acceptance brings peace'
    },
    'star': {
      love_up: 'Hope and healing are returning to your romantic life',
      love_rev: 'Restore faith in love - disappointment is temporary',
      money_up: 'Optimistic outlook is justified - financial recovery is underway',
      money_rev: 'Rebuild confidence after setbacks - better times are coming',
      crypto_up: 'Market recovery and gains align with your hopeful outlook',
      crypto_rev: 'Don\'t lose faith despite current market pessimism',
      life_up: 'Renewed hope and spiritual connection guide you forward',
      life_rev: 'Reconnect with your dreams and aspirations - don\'t give up'
    },
    'moon': {
      love_up: 'Trust your intuition about hidden relationship dynamics',
      love_rev: 'Illusions are clearing - see your relationship situation clearly',
      money_up: 'Navigate uncertainty with intuition - not everything is visible yet',
      money_rev: 'Hidden financial information is coming to light',
      crypto_up: 'Market uncertainty requires intuitive risk management',
      crypto_rev: 'See through market manipulation and FUD - trust your analysis',
      life_up: 'Explore your subconscious - dreams and intuition hold answers',
      life_rev: 'Release fears and illusions - clarity is emerging'
    },
    'sun': {
      love_up: 'Pure joy and success in love - celebrate this positive time',
      love_rev: 'Temporary clouds don\'t block the sun - stay optimistic',
      money_up: 'Financial success and abundance are shining on you',
      money_rev: 'Look for the silver lining in current financial situations',
      crypto_up: 'Bright outlook for profitable trades and portfolio growth',
      crypto_rev: 'Short-term dips don\'t change fundamentally positive outlook',
      life_up: 'Radiate confidence and joy - success in all endeavors',
      life_rev: 'Shift focus to what\'s working - abundance mindset returns'
    },
    'judgement': {
      love_up: 'Past relationship karma is resolving - embrace fresh starts',
      love_rev: 'Self-judgment is blocking relationship growth - practice self-compassion',
      money_up: 'Past financial efforts are being rewarded - recognition comes',
      money_rev: 'Release regret about past money decisions - focus forward',
      crypto_up: 'Reassess your entire portfolio strategy - awakening to better approach',
      crypto_rev: 'Stop beating yourself up over past trades - learn and move on',
      life_up: 'Spiritual awakening and rebirth - answer your higher calling',
      life_rev: 'Release self-criticism - forgive yourself and rise renewed'
    },
    'world': {
      love_up: 'Completion and fulfillment in love - celebrate achievements',
      love_rev: 'Almost there - tie up loose ends to reach relationship goals',
      money_up: 'Financial goals achieved - celebrate success and completion',
      money_rev: 'Identify what\'s preventing completion and address it',
      crypto_up: 'Investment cycle completing successfully - achievement unlocked',
      crypto_rev: 'Final steps needed to realize full potential of positions',
      life_up: 'Wholeness and integration achieved - one cycle ends, another begins',
      life_rev: 'Complete unfinished business to move into next life chapter'
    }
  };
  
  // Find matching card
  for (const [key, advice] of Object.entries(cardAdvice)) {
    if (cardLower.includes(key)) {
      const orientation = isUpright ? 'up' : 'rev';
      const adviceKey = `${category}_${orientation}`;
      return advice[adviceKey] || advice[`life_${orientation}`];
    }
  }
  
  // Generic fallback
  return isUpright ? 
    'Move forward with confidence and trust in your abilities' :
    'Take time to reflect and address underlying challenges before proceeding';
}

function generateFallbackInterpretation(cardName, isUpright, category) {
  const orientation = isUpright ? 'Upright' : 'Reversed';
  const advice = generateCategoryAdvice(cardName, isUpright, category);
  
  return `**${cardName}** (${orientation})

Unable to fetch detailed interpretation from the database, but here's guidance:

**Action Step:** ${advice}`;
}

export async function getOverallVibeFromAI(cards, category, question) {
  // Simple logic based on upright vs reversed cards
  const uprightCount = cards.filter(c => c.isUpright).length;
  
  if (uprightCount >= 2) return 'Positive';
  if (uprightCount === 0) return 'Caution';
  return 'Neutral';
}