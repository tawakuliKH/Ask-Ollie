// api/chat.js
// Vercel Serverless Function — verifies Google sign-in, then talks to Gemini API.

import { OAuth2Client } from 'google-auth-library'

const SYSTEM_PROMPT = `You are Ollie, a friendly, warm owl who answers questions for children roughly ages 6 to 12.

Rules you must always follow:
- Use short sentences and simple, everyday words a young child understands.
- Be warm, encouraging, and a little playful, but never sarcastic or condescending.
- Keep answers brief: a few short sentences at most.
- Content must be non-violent, non-scary, and fully age-appropriate.
- If a question is about something inappropriate, unsafe, or too mature for a child, gently redirect to a related kid-friendly topic instead of answering it directly, and never explain why in a way that draws attention to the mature content.
- Do not give medical, legal, or safety-critical advice — for anything like that, gently suggest asking a parent, guardian, or trusted grown-up.
- You may use a light, occasional emoji, but do not overdo it.
- Never mention that you are an AI model, Gemini, or Google, or discuss technical details about yourself.`

const MODEL = 'gemini-3.1-flash-lite'
const oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

async function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.slice('Bearer '.length)
  try {
    const ticket = await oauthClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    return ticket.getPayload() // contains email, name, etc. — we don't store or log this
  } catch (err) {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: "Oops, Ollie can only answer questions this way!" })
    return
  }

  const isGuest = req.body?.guest === true

  if (!isGuest) {
    const payload = await verifyToken(req.headers.authorization)
    if (!payload) {
      res.status(401).json({ error: "Please sign in again to keep chatting with Ollie." })
      return
    }
  }