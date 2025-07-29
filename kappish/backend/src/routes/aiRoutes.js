const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../services/firebaseAdmin');

const router = express.Router();

// Middleware to authenticate requests
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const result = await verifyToken(token);
    if (!result.success) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = result.user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Validation middleware
const validateAnalysisRequest = [
  body('content').isString().isLength({ min: 10 }),
  body('analysisType').isIn(['argument-strength', 'fact-check', 'general'])
];

const validateSourceRequest = [
  body('topic').isString().isLength({ min: 3 }),
  body('content').optional().isString()
];

const validateFactCheckRequest = [
  body('claims').isArray().isLength({ min: 1 }),
  body('claims.*').isString().isLength({ min: 10 })
];

// Analyze content for argument strength
router.post('/analyze', validateAnalysisRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { content, analysisType } = req.body;
    const userId = req.user.uid;

    // Simulate AI analysis processing
    const analysis = await performAIAnalysis(content, analysisType);

    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message 
    });
  }
});

// Find relevant sources
router.post('/sources', validateSourceRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { topic, content } = req.body;
    const userId = req.user.uid;

    // Simulate source discovery
    const sources = await findRelevantSources(topic, content);

    res.json({
      success: true,
      sources,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Source discovery error:', error);
    res.status(500).json({ 
      error: 'Source discovery failed',
      message: error.message 
    });
  }
});

// Fact check claims
router.post('/fact-check', validateFactCheckRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { claims } = req.body;
    const userId = req.user.uid;

    // Simulate fact checking
    const results = await factCheckClaims(claims);

    res.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Fact check error:', error);
    res.status(500).json({ 
      error: 'Fact checking failed',
      message: error.message 
    });
  }
});

// Get writing suggestions
router.post('/suggestions', async (req, res) => {
  try {
    const { content, context } = req.body;
    const userId = req.user.uid;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Simulate AI suggestions
    const suggestions = await generateWritingSuggestions(content, context);

    res.json({
      success: true,
      suggestions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ 
      error: 'Failed to generate suggestions',
      message: error.message 
    });
  }
});

// Get AI insights summary
router.post('/insights', async (req, res) => {
  try {
    const { content, documentId } = req.body;
    const userId = req.user.uid;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Generate comprehensive AI insights
    const insights = await generateAIInsights(content, documentId);

    res.json({
      success: true,
      insights,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ 
      error: 'Failed to generate insights',
      message: error.message 
    });
  }
});

// Mock AI analysis function
const performAIAnalysis = async (content, type) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const wordCount = content.split(' ').length;
  
  switch (type) {
    case 'argument-strength':
      return {
        strength: Math.min(100, Math.max(0, 
          Math.floor((wordCount / 100) * 30) + 
          (content.includes('because') ? 20 : 0) +
          (content.includes('however') ? 15 : 0) +
          (content.includes('evidence') ? 25 : 0)
        )),
        suggestions: wordCount < 50 ? ['Add more detail to strengthen your argument'] : [],
        confidence: 0.85
      };
    
    case 'fact-check':
      return {
        verifiedClaims: content.includes('research') ? 1 : 0,
        unverifiedClaims: content.includes('claim') ? 1 : 0,
        suggestions: ['Add citations for your claims'],
        confidence: 0.78
      };
    
    default:
      return {
        analysis: 'Content analyzed successfully',
        confidence: 0.8,
        wordCount,
        readability: 'Good'
      };
  }
};

// Mock source discovery function
const findRelevantSources = async (topic, content) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const sources = [
    {
      title: 'Academic Research Paper on ' + topic,
      url: 'https://example.com/paper1',
      relevance: 0.9,
      type: 'academic',
      year: 2023
    },
    {
      title: 'Expert Opinion Article',
      url: 'https://example.com/article1',
      relevance: 0.8,
      type: 'expert',
      year: 2023
    },
    {
      title: 'Statistical Report',
      url: 'https://example.com/report1',
      relevance: 0.7,
      type: 'statistical',
      year: 2022
    }
  ];
  
  return sources.filter(source => source.relevance > 0.6);
};

// Mock fact checking function
const factCheckClaims = async (claims) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return claims.map(claim => ({
    claim,
    status: Math.random() > 0.5 ? 'verified' : 'unverified',
    confidence: Math.random(),
    sources: [],
    explanation: 'This claim requires additional verification'
  }));
};

// Mock writing suggestions function
const generateWritingSuggestions = async (content, context) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const suggestions = [];
  const wordCount = content.split(' ').length;
  
  if (wordCount < 100) {
    suggestions.push('Consider expanding your content with more details');
  }
  
  if (!content.includes('because')) {
    suggestions.push('Add reasoning with "because" to strengthen your arguments');
  }
  
  if (!content.includes('evidence')) {
    suggestions.push('Include specific evidence to support your claims');
  }
  
  if (!content.includes('however') && !content.includes('but')) {
    suggestions.push('Consider addressing counterarguments to strengthen your position');
  }
  
  return suggestions;
};

// Mock AI insights function
const generateAIInsights = async (content, documentId) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const wordCount = content.split(' ').length;
  
  return {
    argumentStrength: Math.min(100, Math.max(0, 
      Math.floor((wordCount / 100) * 30) + 
      (content.includes('because') ? 20 : 0) +
      (content.includes('however') ? 15 : 0) +
      (content.includes('evidence') ? 25 : 0)
    )),
    factCheckStatus: content.includes('research') ? 'completed' : 'pending',
    suggestions: wordCount < 50 ? ['Add more detail to strengthen your argument'] : [],
    sources: content.includes('climate') ? [
      { title: 'Climate Change Research', url: '#', relevance: 0.9 }
    ] : [],
    wordCount,
    estimatedReadingTime: Math.ceil(wordCount / 200),
    complexity: wordCount > 500 ? 'High' : wordCount > 200 ? 'Medium' : 'Low'
  };
};

module.exports = router; 