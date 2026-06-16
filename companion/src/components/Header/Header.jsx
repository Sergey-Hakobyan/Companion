import { useState } from 'react'
import styles from './header.module.css'

const Header = () => {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function getConspect() {
    if (!text.trim()) return

    setResult('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/conspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      setLoading(false)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setResult(prev => prev + chunk)
      }

    } catch (err) {
      setResult('Ошибка соединения с сервером')
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Конспект AI</h1>
      <p className={styles.subtitle}>Вставь текст — получи конспект</p>

      <textarea
        className={styles.textarea}
        placeholder="Вставь текст из книги..."
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <button
        className={styles.button}
        onClick={getConspect}
        disabled={loading}
      >
        {loading ? 'Генерирую...' : 'Сгенерировать конспект'}
      </button>

      {result && (
        <div className={styles.output}>{result}</div>
      )}
    </div>
  )
}

export default Header