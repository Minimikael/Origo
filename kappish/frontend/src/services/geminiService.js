import { supabase } from './supabase'
import { sanitizeForAIPrompt } from '../utils/sanitization'

class GeminiService {
  constructor() {
    this.baseUrl = `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/gemini-api`
  }

  async generateContent(prompt, options = {}) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('User not authenticated')
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt,
          model: options.model || 'gemini-1.5-flash',
          maxTokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
          documentId: options.documentId,
          userId: session.user.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate content')
      }

      return await response.json()
    } catch (error) {
      console.error('Gemini service error:', error)
      throw error
    }
  }

  // Writing suggestions based on content
  async getWritingSuggestions(content, documentId) {
    if (!content || content.length < 50) {
      return []
    }

    const sanitizedContent = sanitizeForAIPrompt(content, 2000)
    const prompt = `Analyze this text and provide 3-5 specific writing suggestions to improve it. Focus on clarity, structure, and engagement. Return only the suggestions as a JSON array of strings.

Text: ${sanitizedContent}`

    try {
      const result = await this.generateContent(prompt, {
        documentId,
        maxTokens: 500,
        temperature: 0.3,
      })

      // Try to parse as JSON, fallback to simple text parsing
      try {
        return JSON.parse(result.text)
      } catch {
        // If JSON parsing fails, split by lines and clean up
        return result.text
          .split('\n')
          .filter(line => line.trim() && !line.startsWith('```'))
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(line => line.length > 10)
      }
    } catch (error) {
      console.error('Error getting writing suggestions:', error)
      return []
    }
  }

  // Content analysis
  async analyzeContent(content, documentId) {
    if (!content || content.length < 20) {
      return null
    }

    const sanitizedContent = sanitizeForAIPrompt(content, 3000)
    const prompt = `Analyze this text and provide a brief analysis covering:
1. Overall tone and style
2. Key themes or arguments
3. Writing quality score (1-10)
4. Areas for improvement

Return as JSON: {"tone": "...", "themes": "...", "score": number, "improvements": "..."}

Text: ${sanitizedContent}`

    try {
      const result = await this.generateContent(prompt, {
        documentId,
        maxTokens: 400,
        temperature: 0.2,
      })

      try {
        return JSON.parse(result.text)
      } catch {
        return {
          tone: 'Neutral',
          themes: 'General content',
          score: 5,
          improvements: 'Consider adding more specific details and examples'
        }
      }
    } catch (error) {
      console.error('Error analyzing content:', error)
      return null
    }
  }

  // Generate content continuation
  async continueContent(content, documentId) {
    const sanitizedContent = sanitizeForAIPrompt(content, 500)
    const prompt = `Continue this text naturally, maintaining the same style and tone. Add 2-3 sentences that flow well from the existing content.

Current text: ${sanitizedContent}

Continue:`

    try {
      const result = await this.generateContent(prompt, {
        documentId,
        maxTokens: 200,
        temperature: 0.8,
      })

      return result.text.trim()
    } catch (error) {
      console.error('Error continuing content:', error)
      return ''
    }
  }

  // Summarize content
  async summarizeContent(content, documentId) {
    if (!content || content.length < 100) {
      return ''
    }

    const sanitizedContent = sanitizeForAIPrompt(content, 4000)
    const prompt = `Provide a concise summary (2-3 sentences) of this text, highlighting the main points and key insights.

Text: ${sanitizedContent}

Summary:`

    try {
      const result = await this.generateContent(prompt, {
        documentId,
        maxTokens: 150,
        temperature: 0.3,
      })

      return result.text.trim()
    } catch (error) {
      console.error('Error summarizing content:', error)
      return ''
    }
  }

  // Improve writing style
  async improveWriting(content, documentId) {
    if (!content || content.length < 50) {
      return content
    }

    const sanitizedContent = sanitizeForAIPrompt(content, 2000)
    const prompt = `Improve this text by enhancing clarity, flow, and engagement while maintaining the original meaning and tone. Return only the improved version.

Original: ${sanitizedContent}

Improved:`

    try {
      const result = await this.generateContent(prompt, {
        documentId,
        maxTokens: 2500,
        temperature: 0.4,
      })

      return result.text.trim()
    } catch (error) {
      console.error('Error improving writing:', error)
      return content
    }
  }

  // Generate title suggestions
  async generateTitles(content, documentId) {
    if (!content || content.length < 20) {
      return []
    }

    const sanitizedContent = sanitizeForAIPrompt(content, 1000)
    const prompt = `Generate 5 engaging title options for this text. Make them concise, compelling, and relevant to the content. Return as a JSON array of strings.

Text: ${sanitizedContent}

Titles:`

    try {
      const result = await this.generateContent(prompt, {
        documentId,
        maxTokens: 200,
        temperature: 0.7,
      })

      try {
        return JSON.parse(result.text)
      } catch {
        // Fallback parsing
        return result.text
          .split('\n')
          .filter(line => line.trim() && !line.startsWith('```'))
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(line => line.length > 5 && line.length < 100)
          .slice(0, 5)
      }
    } catch (error) {
      console.error('Error generating titles:', error)
      return []
    }
  }
}

export const geminiService = new GeminiService() 