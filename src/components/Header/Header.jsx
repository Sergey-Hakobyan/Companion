import { useState } from 'react'
import styles from './header.module.css'
import clsx from 'clsx'
import moon from '../../assets/imgs/moon.svg'

const Header = () => {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState(0);
  const [shift, setShift] = useState(1);

  async function getConspect() {
    if (!text.trim()) return

    setResult('')
    setLoading(true)
    text.trim()

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
    <>
      <section className = {styles.sec}
                style={
                {backgroundColor: shift ? 'white' : 'black',
                transition: 'background-color 0.5s ease'
                }
                }> 
          <div className = {styles.header}>
              <div className = {styles.shiftchanger}
              onClick={() => setShift(!shift)
              }>
                <img src={moon} alt="moon"/>
          </div>
          </div>
          <h1 className = {styles.name}
          style={
          {color: shift ? 'black' : 'grey',
          transition: 'color 0.5s ease'
          }
          }>
            Companion
          </h1>
          <h1 className = {styles.desc}
          style={
          {color: shift ? 'black' : 'grey',
          transition: 'color 0.5s ease'
          }
          }> 
            Make your learning process easier - just paste that text here
          </h1>
          <textarea
          className={styles.textarea}
          placeholder="Enter your text here..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          className={clsx(
            styles.button,
            text.trim() ? styles.showButton : styles.hideButton
            )}
            onClick={getConspect}
            disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate conspect'}
        </button>

        {result && (
          <div className={styles.output}>
            {result}
          </div>
        )}
      </section>
    </>
  )
}
export default Header