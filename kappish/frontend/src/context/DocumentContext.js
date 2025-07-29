import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../services/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  addDoc
} from 'firebase/firestore';

const DocumentContext = createContext();

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

export const DocumentProvider = ({ children }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user's documents
  useEffect(() => {
    if (!user) {
      setDocuments([]);
      return;
    }

    // Mock documents for demonstration
    const mockDocuments = [
      {
        id: 'doc-1',
        title: 'The Future of Renewable Energy',
        content: `The transition to renewable energy sources represents one of the most critical challenges facing humanity in the 21st century. As climate change accelerates and fossil fuel reserves diminish, the urgency to adopt sustainable energy solutions has never been greater. Solar power, wind energy, and hydroelectric systems offer promising alternatives that could revolutionize how we power our world.

However, the implementation of renewable energy technologies faces significant obstacles. Infrastructure development requires substantial investment, and existing energy grids must be modernized to accommodate intermittent power sources. Additionally, public resistance to large-scale projects, such as wind farms or solar installations, often delays progress despite overwhelming scientific consensus on their benefits.

The economic implications of renewable energy adoption are complex but ultimately positive. While initial costs may be higher than traditional energy sources, long-term savings in healthcare costs, environmental damage, and energy security make renewable energy a sound investment. Countries that lead in renewable energy development will likely gain competitive advantages in the global economy.

Technological innovation continues to drive down costs and improve efficiency. Battery storage technology, smart grid systems, and advanced materials science are creating new possibilities for renewable energy integration. These advancements suggest that renewable energy could become the dominant power source within the next few decades, fundamentally transforming our relationship with energy consumption and environmental stewardship.`,
        userId: user.uid,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        collaborators: [],
        aiAnalysis: {
          argumentStrength: 75,
          factCheckStatus: 'completed',
          suggestions: ['Add more evidence', 'Strengthen conclusion']
        }
      },
      {
        id: 'doc-2',
        title: 'Digital Transformation in Education',
        content: `The integration of technology in educational systems has fundamentally altered how students learn and teachers instruct. Digital transformation in education encompasses everything from online learning platforms to artificial intelligence-powered tutoring systems. This shift has accelerated dramatically in recent years, particularly following global events that necessitated remote learning solutions.

Traditional classroom models are being supplemented and sometimes replaced by hybrid learning environments that combine in-person and digital instruction. Learning management systems, virtual reality simulations, and adaptive learning algorithms are creating personalized educational experiences that cater to individual student needs and learning styles. These technologies enable educators to track progress more effectively and identify areas where students require additional support.

Despite these advancements, significant challenges remain in ensuring equitable access to digital educational resources. The digital divide continues to affect students from lower-income backgrounds, rural areas, and developing regions. Infrastructure limitations, device availability, and internet connectivity issues create barriers that must be addressed to prevent educational inequality from widening.

The role of educators is evolving alongside these technological changes. Teachers must now develop digital literacy skills alongside their subject matter expertise. Professional development programs are increasingly focused on technology integration, data analysis, and online pedagogy. This transformation requires ongoing support and training to ensure educators can effectively leverage new tools while maintaining the human elements of teaching that technology cannot replicate.`,
        userId: user.uid,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
        collaborators: [],
        aiAnalysis: {
          argumentStrength: 60,
          factCheckStatus: 'pending',
          suggestions: ['Include more citations', 'Expand methodology section']
        }
      }
    ];

    setDocuments(mockDocuments);
  }, [user]);

  const createDocument = async (title = 'Untitled Document') => {
    if (!user) return null;

    const newDoc = {
      id: `doc-${Date.now()}`,
      title,
      content: '',
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      collaborators: [],
      aiAnalysis: {
        argumentStrength: 0,
        factCheckStatus: 'pending',
        suggestions: []
      }
    };

    // Add to mock documents
    setDocuments(prev => [newDoc, ...prev]);
    return newDoc.id;
  };

  const updateDocument = async (documentId, updates) => {
    if (!user) return false;

    try {
      // Update document in mock documents
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, ...updates, updatedAt: new Date() }
          : doc
      ));
      
      // Update current document if it's the one being updated
      setCurrentDocument(prev => 
        prev?.id === documentId 
          ? { ...prev, ...updates, updatedAt: new Date() }
          : prev
      );
      
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      return false;
    }
  };

  const loadDocument = async (documentId) => {
    if (!user) return null;

    setLoading(true);
    try {
      // Find document in mock documents
      const document = documents.find(doc => doc.id === documentId);
      
      if (document) {
        setCurrentDocument(document);
        return document;
      } else {
        console.log('Document not found');
        return null;
      }
    } catch (error) {
      console.error('Error loading document:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    documents,
    currentDocument,
    loading,
    createDocument,
    updateDocument,
    loadDocument,
    setCurrentDocument
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}; 