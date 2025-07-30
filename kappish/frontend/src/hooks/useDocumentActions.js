import { useState } from 'react';
import { useDocuments } from '../context/DocumentContext';

export const useDocumentActions = () => {
  const { createDocument, deleteDocument, archiveDocument, restoreDocument, markAsCompleted } = useDocuments();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateDocument = async (title, content = '') => {
    setIsCreating(true);
    setError(null);
    
    try {
      const newDoc = await createDocument(title, content);
      return { success: true, document: newDoc };
    } catch (error) {
      console.error('Error creating document:', error);
      setError('Failed to create document. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await deleteDocument(documentId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Failed to delete document. Please try again.');
      return { success: false, error: error.message };
    }
  };

  const handleArchiveDocument = async (documentId) => {
    try {
      await archiveDocument(documentId);
      return { success: true };
    } catch (error) {
      console.error('Error archiving document:', error);
      setError('Failed to archive document. Please try again.');
      return { success: false, error: error.message };
    }
  };

  const handleRestoreDocument = async (documentId) => {
    try {
      await restoreDocument(documentId);
      return { success: true };
    } catch (error) {
      console.error('Error restoring document:', error);
      setError('Failed to restore document. Please try again.');
      return { success: false, error: error.message };
    }
  };

  const handleMarkAsCompleted = async (documentId) => {
    try {
      await markAsCompleted(documentId);
      return { success: true };
    } catch (error) {
      console.error('Error marking document as completed:', error);
      setError('Failed to mark document as completed. Please try again.');
      return { success: false, error: error.message };
    }
  };

  return {
    isCreating,
    error,
    setError,
    handleCreateDocument,
    handleDeleteDocument,
    handleArchiveDocument,
    handleRestoreDocument,
    handleMarkAsCompleted
  };
}; 