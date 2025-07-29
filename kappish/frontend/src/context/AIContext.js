import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDocuments } from './DocumentContext';
import { useAuth } from './AuthContext';

const AIContext = createContext();

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

export const AIProvider = ({ children }) => {
  const { currentDocument } = useDocuments();
  const [aiAnalysis, setAiAnalysis] = useState({
    argumentStrength: 0,
    factCheckStatus: 'pending',
    suggestions: [],
    sources: [],
    isAnalyzing: false
  });

  const [realTimeFeedback, setRealTimeFeedback] = useState({
    argumentStrength: 0,
    factCheckResults: [],
    suggestions: [],
    sources: []
  });

  const [auditSuggestions, setAuditSuggestions] = useState([]);
  const [highlightedText, setHighlightedText] = useState(null);
  const [plagiarismResults, setPlagiarismResults] = useState(null);

  // Generate citation in different formats
  const generateCitation = (source, style = 'APA') => {
    const citationFormats = {
      APA: {
        journal: `${source.author} (${source.year}). ${source.title}. ${source.journal}.`,
        website: `${source.author} (${source.year}). ${source.title}. Retrieved from ${source.url}`,
        book: `${source.author} (${source.year}). ${source.title}. ${source.publisher}.`
      },
      MLA: {
        journal: `${source.author}. "${source.title}." ${source.journal} ${source.year}.`,
        website: `${source.author}. "${source.title}." ${source.website}, ${source.year}, ${source.url}.`,
        book: `${source.author}. ${source.title}. ${source.publisher}, ${source.year}.`
      },
      Harvard: {
        journal: `${source.author} (${source.year}) '${source.title}', ${source.journal}.`,
        website: `${source.author} (${source.year}) '${source.title}' [Online]. Available at: ${source.url}`,
        book: `${source.author} (${source.year}) ${source.title}, ${source.publisher}.`
      }
    };

    const sourceType = source.journal ? 'journal' : source.url ? 'website' : 'book';
    return citationFormats[style][sourceType] || citationFormats.APA[sourceType];
  };

  // Check for plagiarism
  const checkPlagiarism = async (content) => {
    setPlagiarismResults({ isChecking: true, score: 0, issues: [] });
    
    // Simulate plagiarism check
    setTimeout(() => {
      const words = content.split(' ').length;
      const plagiarismScore = Math.max(0, Math.min(100, 100 - (words * 0.1)));
      
      const issues = [];
      if (plagiarismScore < 90) {
        issues.push({
          type: 'warning',
          message: 'Potential similarity detected in paragraph 2',
          position: { start: 150, end: 300 }
        });
      }
      if (plagiarismScore < 85) {
        issues.push({
          type: 'critical',
          message: 'High similarity with existing content detected',
          position: { start: 400, end: 550 }
        });
      }

      setPlagiarismResults({
        isChecking: false,
        score: plagiarismScore,
        issues,
        totalWords: words
      });
    }, 2000);
  };

  // Generate audit suggestions based on content
  const generateAuditSuggestions = (content) => {
    const suggestions = [];
    
    // Check for thesis statement
    if (!content.includes('thesis') && !content.includes('argument') && !content.includes('claim')) {
      suggestions.push({
        id: 'thesis-missing',
        type: 'critical',
        category: 'Structure',
        title: 'Missing Clear Thesis Statement',
        message: 'Origo recommends adding a clear thesis statement to strengthen your argument.',
        position: { start: 0, end: 50 },
        action: 'Add a thesis statement that clearly states your main argument'
      });
    }

    // Check for evidence
    if (!content.includes('evidence') && !content.includes('research') && !content.includes('study')) {
      suggestions.push({
        id: 'evidence-weak',
        type: 'warning',
        category: 'Evidence',
        title: 'Limited Supporting Evidence',
        message: 'Origo suggests including more research and evidence to support your claims.',
        position: { start: content.indexOf('However') || 0, end: (content.indexOf('However') || 0) + 100 },
        action: 'Add specific examples, statistics, or research findings'
      });
    }

    // Check for citations
    if (!content.includes('citation') && !content.includes('source') && !content.includes('according')) {
      suggestions.push({
        id: 'citations-missing',
        type: 'warning',
        category: 'Citations',
        title: 'Missing Citations',
        message: 'Origo recommends adding proper citations to improve credibility.',
        position: { start: content.length - 100, end: content.length },
        action: 'Include in-text citations and a reference list'
      });
    }

    // Check for logical connectors
    if (!content.includes('therefore') && !content.includes('thus') && !content.includes('consequently')) {
      suggestions.push({
        id: 'logic-weak',
        type: 'info',
        category: 'Logic',
        title: 'Improve Logical Flow',
        message: 'Origo suggests adding logical connectors to strengthen your reasoning.',
        position: { start: content.indexOf('The') || 0, end: (content.indexOf('The') || 0) + 80 },
        action: 'Use words like "therefore," "thus," or "consequently" to connect ideas'
      });
    }

    // Check for conclusion
    if (!content.includes('conclusion') && !content.includes('summary') && !content.includes('implications')) {
      suggestions.push({
        id: 'conclusion-weak',
        type: 'warning',
        category: 'Structure',
        title: 'Strengthen Conclusion',
        message: 'Origo recommends adding a stronger conclusion that summarizes key points.',
        position: { start: content.length - 150, end: content.length },
        action: 'Add a conclusion that restates your thesis and summarizes main points'
      });
    }

    // Check for critical analysis
    if (!content.includes('however') && !content.includes('although') && !content.includes('nevertheless')) {
      suggestions.push({
        id: 'analysis-weak',
        type: 'info',
        category: 'Analysis',
        title: 'Add Critical Analysis',
        message: 'Origo suggests including more critical analysis and counterarguments.',
        position: { start: content.indexOf('The') || 0, end: (content.indexOf('The') || 0) + 120 },
        action: 'Include counterarguments and critical analysis of different perspectives'
      });
    }

    return suggestions;
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setHighlightedText({
      suggestion,
      position: suggestion.position
    });
  };

  // Clear highlight
  const clearHighlight = () => {
    setHighlightedText(null);
  };

  // Simulate real-time AI analysis
  useEffect(() => {
    if (!currentDocument?.content) {
      setAiAnalysis(prev => ({ ...prev, isAnalyzing: false }));
      setAuditSuggestions([]);
      return;
    }

    setAiAnalysis(prev => ({ ...prev, isAnalyzing: true }));

    // Simulate AI processing delay
    const timer = setTimeout(() => {
      const content = currentDocument.content;
      const wordCount = content.split(' ').length;
      
      // Enhanced argument strength calculation
      let argumentStrength = Math.min(100, Math.max(0, 
        Math.floor((wordCount / 100) * 20) + 
        (content.includes('because') ? 15 : 0) +
        (content.includes('however') ? 10 : 0) +
        (content.includes('evidence') ? 20 : 0) +
        (content.includes('research') ? 15 : 0) +
        (content.includes('study') ? 10 : 0) +
        (content.includes('according') ? 10 : 0) +
        (content.includes('citation') ? 15 : 0)
      ));

      // Enhanced suggestions based on content
      const suggestions = [];
      if (wordCount < 100) {
        suggestions.push('Origo recommends expanding your content with more details and examples');
      }
      if (!content.includes('because') && !content.includes('therefore')) {
        suggestions.push('Origo suggests adding logical connectors like "because" or "therefore" to strengthen your reasoning');
      }
      if (!content.includes('evidence') && !content.includes('research')) {
        suggestions.push('Origo recommends including specific evidence and research to support your claims');
      }
      if (!content.includes('citation') && !content.includes('source')) {
        suggestions.push('Origo suggests adding citations and sources to improve credibility');
      }
      if (content.includes('claim') && !content.includes('evidence')) {
        suggestions.push('Origo recommends supporting your claims with specific evidence and examples');
      }

      // Enhanced source suggestions based on content
      const sources = [];
      if (content.includes('climate') || content.includes('environment')) {
        sources.push({ title: 'Climate Change Research Database', url: '#', relevance: 0.95 });
        sources.push({ title: 'Environmental Science Journal', url: '#', relevance: 0.88 });
      }
      if (content.includes('technology') || content.includes('AI')) {
        sources.push({ title: 'AI Research Papers', url: '#', relevance: 0.92 });
        sources.push({ title: 'Technology Trends Report', url: '#', relevance: 0.85 });
      }
      if (content.includes('health') || content.includes('medical')) {
        sources.push({ title: 'Medical Research Database', url: '#', relevance: 0.90 });
        sources.push({ title: 'Health Studies Journal', url: '#', relevance: 0.87 });
      }
      if (content.includes('education') || content.includes('learning')) {
        sources.push({ title: 'Educational Research Papers', url: '#', relevance: 0.89 });
        sources.push({ title: 'Learning Science Journal', url: '#', relevance: 0.83 });
      }

      // Generate audit suggestions
      const auditSuggestions = generateAuditSuggestions(content);

      setAiAnalysis({
        argumentStrength,
        factCheckStatus: content.includes('research') ? 'completed' : 'pending',
        suggestions,
        sources,
        isAnalyzing: false
      });

      setRealTimeFeedback({
        argumentStrength,
        factCheckResults: content.includes('research') ? [{ claim: 'Research mentioned', status: 'verified', confidence: 0.8 }] : [],
        suggestions,
        sources
      });

      setAuditSuggestions(auditSuggestions);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentDocument?.content]);

  const analyzeContent = async (content) => {
    // This would integrate with actual AI API
    setAiAnalysis(prev => ({ ...prev, isAnalyzing: true }));
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const analysis = {
          argumentStrength: Math.floor(Math.random() * 100),
          factCheckStatus: 'completed',
          suggestions: ['Add more evidence', 'Strengthen your conclusion'],
          sources: []
        };
        
        setAiAnalysis({ ...analysis, isAnalyzing: false });
        resolve(analysis);
      }, 1000);
    });
  };

  const getSourceSuggestions = async (topic) => {
    // This would call external APIs for source discovery
    return [
      { title: 'Academic Source 1', url: '#', relevance: 0.9 },
      { title: 'Research Paper 2', url: '#', relevance: 0.8 },
      { title: 'Expert Opinion 3', url: '#', relevance: 0.7 }
    ];
  };

  const factCheckClaim = async (claim) => {
    // This would integrate with fact-checking APIs
    return {
      status: Math.random() > 0.5 ? 'verified' : 'unverified',
      confidence: Math.random(),
      sources: []
    };
  };

  const value = {
    aiAnalysis,
    realTimeFeedback,
    auditSuggestions,
    highlightedText,
    handleSuggestionClick,
    clearHighlight,
    generateCitation,
    checkPlagiarism,
    plagiarismResults
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}; 