/**
 * URL validation and citation utilities
 */

/**
 * Validates if a URL is properly formatted
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Extracts domain from URL for display
 * @param {string} url - The URL to extract domain from
 * @returns {string} - The domain name
 */
export const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return 'Invalid URL';
  }
};

/**
 * Generates citation in different formats
 * @param {Object} source - The source object
 * @param {string} style - Citation style (APA, MLA, Harvard)
 * @returns {string} - Formatted citation
 */
export const generateCitation = (source, style = 'APA') => {
  const { title, url, author, year, journal, publisher } = source;
  
  const citationFormats = {
    APA: {
      website: `${author || 'Unknown'} (${year || 'n.d.'}). ${title}. Retrieved from ${url}`,
      journal: `${author || 'Unknown'} (${year || 'n.d.'}). ${title}. ${journal || 'Unknown Journal'}.`,
      book: `${author || 'Unknown'} (${year || 'n.d.'}). ${title}. ${publisher || 'Unknown Publisher'}.`
    },
    MLA: {
      website: `${author || 'Unknown'}. "${title}." ${extractDomain(url)}, ${year || 'n.d.'}, ${url}.`,
      journal: `${author || 'Unknown'}. "${title}." ${journal || 'Unknown Journal'} ${year || 'n.d.'}.`,
      book: `${author || 'Unknown'}. ${title}. ${publisher || 'Unknown Publisher'}, ${year || 'n.d.'}.`
    },
    Harvard: {
      website: `${author || 'Unknown'} (${year || 'n.d.'}) '${title}' [Online]. Available at: ${url}`,
      journal: `${author || 'Unknown'} (${year || 'n.d.'}) '${title}', ${journal || 'Unknown Journal'}.`,
      book: `${author || 'Unknown'} (${year || 'n.d.'}) ${title}, ${publisher || 'Unknown Publisher'}.`
    }
  };

  // Determine source type
  let sourceType = 'website';
  if (journal) sourceType = 'journal';
  else if (publisher) sourceType = 'book';

  return citationFormats[style][sourceType] || citationFormats.APA[sourceType];
};

/**
 * Inserts citation at cursor position in editor
 * @param {string} citation - The citation text to insert
 * @param {HTMLElement} editor - The editor element
 */
export const insertCitationAtCursor = (citation, editor) => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const citationNode = document.createElement('span');
  citationNode.className = 'citation';
  citationNode.style.backgroundColor = '#f0f8ff';
  citationNode.style.padding = '2px 4px';
  citationNode.style.borderRadius = '3px';
  citationNode.style.fontSize = '0.9em';
  citationNode.style.color = '#0066cc';
  citationNode.textContent = citation;

  range.deleteContents();
  range.insertNode(citationNode);
  
  // Move cursor after citation
  range.setStartAfter(citationNode);
  range.setEndAfter(citationNode);
  selection.removeAllRanges();
  selection.addRange(range);
};

/**
 * Fetches metadata from a URL (title, description, etc.)
 * @param {string} url - The URL to fetch metadata from
 * @returns {Promise<Object>} - Metadata object
 */
export const fetchUrlMetadata = async (url) => {
  try {
    // This would typically be done server-side to avoid CORS issues
    // For now, we'll return basic metadata
    const domain = extractDomain(url);
    return {
      title: `Page from ${domain}`,
      description: `Content from ${domain}`,
      domain: domain,
      url: url
    };
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    return {
      title: 'Unknown Title',
      description: 'Unable to fetch metadata',
      domain: extractDomain(url),
      url: url
    };
  }
};

/**
 * Validates and formats a source object
 * @param {Object} sourceData - Raw source data
 * @returns {Object} - Validated and formatted source
 */
export const validateAndFormatSource = (sourceData) => {
  const { title, url, author, year, journal, publisher } = sourceData;
  
  if (!title || !url) {
    throw new Error('Title and URL are required');
  }

  if (!validateUrl(url)) {
    throw new Error('Invalid URL format');
  }

  return {
    title: title.trim(),
    url: url.trim(),
    author: author?.trim() || null,
    year: year || null,
    journal: journal?.trim() || null,
    publisher: publisher?.trim() || null,
    domain: extractDomain(url),
    source_type: journal ? 'journal' : publisher ? 'book' : 'website'
  };
}; 