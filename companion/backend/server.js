const express = require('express')
const Anthropic = require('@anthropic-ai/sdk')
const cors = require('cors')

const app = express()
const anthropic = new Anthropic({ apiKey: 'ТВОЙ_КЛЮЧ' })

app.use(cors())
app.use(express.json())

const SYSTEM_PROMPT = `Ты помощник для студентов. Сделай конспект строго в таком формате:

1. О ЧЁМ ОТРЫВОК
2. ВАЖНЫЕ НЮАНСЫ
3. ВХОД В ТЕМУ
4. ОБЪЯСНЕНИЕ ТЕМЫ
5. ВЕРОЯТНЫЕ ВОПРОСЫ
6. СУПЕР КОРОТКИЙ ПЕРЕСКАЗ`

app.post('/conspect', async (req, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'Текст не передан' })

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Текст:\n\n${text}` }]
    })

    for await (const chunk of stream) {
      const chunkText = chunk.delta?.text
      if (chunkText) res.write(chunkText)
    }
  } catch (err) {
    console.error(err)
    res.write('\n[Ошибка]')
  }

  res.end()
})

app.listen(3000, () => console.log('Сервер на http://localhost:3000'))