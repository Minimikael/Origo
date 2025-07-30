import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://origo-ezdnbrg62-minimikaels-projects.vercel.app' 
    : 'http://localhost:3000',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GeminiRequest {
  prompt: string
  model?: string
  maxTokens?: number
  temperature?: number
  documentId?: string
  userId?: string
}

interface GeminiResponse {
  text: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify Supabase JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { prompt, model = 'gemini-1.5-flash', maxTokens = 1000, temperature = 0.7, documentId, userId }: GeminiRequest = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user owns the document if documentId is provided
    if (documentId) {
      const { data: document, error: docError } = await supabaseClient
        .from('documents')
        .select('user_id')
        .eq('id', documentId)
        .single()

      if (docError || !document || document.user_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Document not found or access denied' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Get Gemini API key from environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: temperature,
          }
        })
      }
    )

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json()
      console.error('Gemini API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to generate content from Gemini API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const geminiData = await geminiResponse.json()
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Log usage for analytics (optional)
    if (documentId) {
      await supabaseClient
        .from('ai_analysis')
        .insert({
          document_id: documentId,
          analysis_type: 'gemini_generation',
          results: { prompt, response: generatedText },
          score: null,
          suggestions: null
        })
        .then(() => console.log('AI analysis logged'))
        .catch(err => console.error('Failed to log AI analysis:', err))
    }

    const response: GeminiResponse = {
      text: generatedText,
      usage: geminiData.usageMetadata ? {
        promptTokens: geminiData.usageMetadata.promptTokenCount || 0,
        completionTokens: geminiData.usageMetadata.candidatesTokenCount || 0,
        totalTokens: geminiData.usageMetadata.totalTokenCount || 0
      } : undefined
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 