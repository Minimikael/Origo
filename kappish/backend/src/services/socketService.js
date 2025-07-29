const { verifyToken } = require('./firebaseAdmin');

const setupSocketHandlers = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const result = await verifyToken(token);
      if (!result.success) {
        return next(new Error('Invalid token'));
      }

      socket.user = result.user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.uid}`);

    // Join document room for real-time collaboration
    socket.on('join-document', (documentId) => {
      socket.join(`document-${documentId}`);
      socket.to(`document-${documentId}`).emit('user-joined', {
        userId: socket.user.uid,
        email: socket.user.email
      });
      console.log(`📄 User ${socket.user.uid} joined document ${documentId}`);
    });

    // Leave document room
    socket.on('leave-document', (documentId) => {
      socket.leave(`document-${documentId}`);
      socket.to(`document-${documentId}`).emit('user-left', {
        userId: socket.user.uid,
        email: socket.user.email
      });
      console.log(`📄 User ${socket.user.uid} left document ${documentId}`);
    });

    // Real-time document updates
    socket.on('document-update', (data) => {
      const { documentId, content, selection, timestamp } = data;
      
      // Broadcast to other users in the same document
      socket.to(`document-${documentId}`).emit('document-updated', {
        userId: socket.user.uid,
        email: socket.user.email,
        content,
        selection,
        timestamp
      });
    });

    // AI analysis requests
    socket.on('request-ai-analysis', async (data) => {
      const { documentId, content, analysisType } = data;
      
      try {
        // Simulate AI processing delay
        setTimeout(() => {
          const analysis = generateMockAnalysis(content, analysisType);
          
          // Send analysis back to the requesting user
          socket.emit('ai-analysis-complete', {
            documentId,
            analysis,
            timestamp: new Date().toISOString()
          });
          
          // Broadcast to other users in the document
          socket.to(`document-${documentId}`).emit('ai-analysis-updated', {
            documentId,
            analysis,
            timestamp: new Date().toISOString()
          });
        }, 2000);
        
      } catch (error) {
        socket.emit('ai-analysis-error', {
          error: 'Failed to analyze content',
          message: error.message
        });
      }
    });

    // Source suggestions
    socket.on('request-sources', async (data) => {
      const { documentId, topic, content } = data;
      
      try {
        // Simulate source discovery
        setTimeout(() => {
          const sources = generateMockSources(topic, content);
          
          socket.emit('sources-found', {
            documentId,
            sources,
            timestamp: new Date().toISOString()
          });
        }, 1500);
        
      } catch (error) {
        socket.emit('sources-error', {
          error: 'Failed to find sources',
          message: error.message
        });
      }
    });

    // Fact checking requests
    socket.on('request-fact-check', async (data) => {
      const { documentId, claims } = data;
      
      try {
        // Simulate fact checking
        setTimeout(() => {
          const results = generateMockFactCheck(claims);
          
          socket.emit('fact-check-complete', {
            documentId,
            results,
            timestamp: new Date().toISOString()
          });
        }, 3000);
        
      } catch (error) {
        socket.emit('fact-check-error', {
          error: 'Failed to fact check',
          message: error.message
        });
      }
    });

    // Typing indicators
    socket.on('typing-start', (documentId) => {
      socket.to(`document-${documentId}`).emit('user-typing', {
        userId: socket.user.uid,
        email: socket.user.email,
        isTyping: true
      });
    });

    socket.on('typing-stop', (documentId) => {
      socket.to(`document-${documentId}`).emit('user-typing', {
        userId: socket.user.uid,
        email: socket.user.email,
        isTyping: false
      });
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.user.uid}`);
    });
  });
};

// Mock AI analysis function
const generateMockAnalysis = (content, type) => {
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
        suggestions: wordCount < 50 ? ['Add more detail to strengthen your argument'] : []
      };
    
    case 'fact-check':
      return {
        verifiedClaims: content.includes('research') ? 1 : 0,
        unverifiedClaims: content.includes('claim') ? 1 : 0,
        suggestions: ['Add citations for your claims']
      };
    
    default:
      return {
        analysis: 'Content analyzed successfully',
        confidence: 0.8
      };
  }
};

// Mock source discovery function
const generateMockSources = (topic, content) => {
  const sources = [
    {
      title: 'Academic Research Paper',
      url: 'https://example.com/paper1',
      relevance: 0.9,
      type: 'academic'
    },
    {
      title: 'Expert Opinion Article',
      url: 'https://example.com/article1',
      relevance: 0.8,
      type: 'expert'
    },
    {
      title: 'Statistical Report',
      url: 'https://example.com/report1',
      relevance: 0.7,
      type: 'statistical'
    }
  ];
  
  return sources.filter(source => 
    source.relevance > 0.6
  );
};

// Mock fact checking function
const generateMockFactCheck = (claims) => {
  return claims.map(claim => ({
    claim,
    status: Math.random() > 0.5 ? 'verified' : 'unverified',
    confidence: Math.random(),
    sources: []
  }));
};

module.exports = {
  setupSocketHandlers
}; 