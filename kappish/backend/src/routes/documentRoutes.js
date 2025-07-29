const express = require('express');
const { body, validationResult } = require('express-validator');
const { getFirestore } = require('../services/firebaseAdmin');
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
const validateDocument = [
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('content').optional().isString(),
  body('collaborators').optional().isArray()
];

// Get all documents for the authenticated user
router.get('/', async (req, res) => {
  try {
    const db = getFirestore();
    const userId = req.user.uid;

    const documentsRef = db.collection('documents');
    const snapshot = await documentsRef
      .where('userId', '==', userId)
      .orderBy('updatedAt', 'desc')
      .get();

    const documents = [];
    snapshot.forEach(doc => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      documents
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ 
      error: 'Failed to fetch documents',
      message: error.message 
    });
  }
});

// Get a specific document
router.get('/:documentId', async (req, res) => {
  try {
    const db = getFirestore();
    const { documentId } = req.params;
    const userId = req.user.uid;

    const docRef = db.collection('documents').doc(documentId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const documentData = doc.data();
    
    // Check if user has access to this document
    if (documentData.userId !== userId && !documentData.collaborators?.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      document: {
        id: doc.id,
        ...documentData
      }
    });

  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ 
      error: 'Failed to fetch document',
      message: error.message 
    });
  }
});

// Create a new document
router.post('/', validateDocument, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const db = getFirestore();
    const userId = req.user.uid;
    const { title = 'Untitled Document', content = '', collaborators = [] } = req.body;

    const newDocument = {
      title,
      content,
      userId,
      collaborators,
      createdAt: new Date(),
      updatedAt: new Date(),
      aiAnalysis: {
        argumentStrength: 0,
        factCheckStatus: 'pending',
        suggestions: []
      }
    };

    const docRef = await db.collection('documents').add(newDocument);

    res.status(201).json({
      success: true,
      document: {
        id: docRef.id,
        ...newDocument
      }
    });

  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ 
      error: 'Failed to create document',
      message: error.message 
    });
  }
});

// Update a document
router.put('/:documentId', validateDocument, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const db = getFirestore();
    const { documentId } = req.params;
    const userId = req.user.uid;
    const updates = req.body;

    const docRef = db.collection('documents').doc(documentId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const documentData = doc.data();
    
    // Check if user has access to this document
    if (documentData.userId !== userId && !documentData.collaborators?.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update the document
    await docRef.update({
      ...updates,
      updatedAt: new Date()
    });

    // Get the updated document
    const updatedDoc = await docRef.get();

    res.json({
      success: true,
      document: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    });

  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ 
      error: 'Failed to update document',
      message: error.message 
    });
  }
});

// Delete a document
router.delete('/:documentId', async (req, res) => {
  try {
    const db = getFirestore();
    const { documentId } = req.params;
    const userId = req.user.uid;

    const docRef = db.collection('documents').doc(documentId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const documentData = doc.data();
    
    // Only the owner can delete the document
    if (documentData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await docRef.delete();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ 
      error: 'Failed to delete document',
      message: error.message 
    });
  }
});

// Add collaborator to document
router.post('/:documentId/collaborators', async (req, res) => {
  try {
    const db = getFirestore();
    const { documentId } = req.params;
    const userId = req.user.uid;
    const { collaboratorEmail } = req.body;

    if (!collaboratorEmail) {
      return res.status(400).json({ error: 'Collaborator email is required' });
    }

    const docRef = db.collection('documents').doc(documentId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const documentData = doc.data();
    
    // Only the owner can add collaborators
    if (documentData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get collaborator user ID by email (simplified)
    const collaboratorId = `collaborator-${Date.now()}`;

    // Update document with new collaborator
    await docRef.update({
      collaborators: admin.firestore.FieldValue.arrayUnion(collaboratorId),
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Collaborator added successfully'
    });

  } catch (error) {
    console.error('Error adding collaborator:', error);
    res.status(500).json({ 
      error: 'Failed to add collaborator',
      message: error.message 
    });
  }
});

module.exports = router; 