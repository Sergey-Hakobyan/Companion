import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()

const apiKey = process.env.GEMINI_API_KEY
const app = express()

const genAI = new GoogleGenerativeAI(apiKey)

app.use(cors())
app.use(express.json())

const SYSTEM_PROMPT = `
You are a study assistant.

Make explanations clean and easy to understand.

Create notes STRICTLY in this format:

1. WHAT THE EXCERPT IS ABOUT
2. IMPORTANT NUANCES
3. TOPIC INTRODUCTION
4. TOPIC EXPLANATION
5. LIKELY QUESTIONS
6. ULTRA-SHORT SUMMARY
`

app.post('/conspect', async (req, res) => {
  const { text } = req.body

  if (!text) {
    return res.status(400).json({
      error: 'Text not provided'
    })
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    })

    const result = await model.generateContent(`
${SYSTEM_PROMPT}

Text:

${text}
`)

    const answer = result.response.text()

    res.send(answer)

  } catch (err) {
  console.error(err)

  res.status(500).json({
    error: err.message
  })
}
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})