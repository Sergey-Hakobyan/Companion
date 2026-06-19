import { useState } from 'react'
import styles from './header.module.css'
import clsx from 'clsx'


const Header = () => {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState(0);
  const [shift, setShift] = useState(1);
  const [chatStarted, setChatStarted] = useState(false);
  const [showOutput, setShowOutput] = useState(false) 
  const [showText, setShowText] = useState(false)


  const moon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000000">
                <path d="M20.742 13.045a8.088 8.088 0 0 1-2.077.271c-2.135 0-4.14-.83-5.646-2.336a8.025 8.025 0 0 1-2.064-7.723A1 1 0 0 0 9.73 2.034a10.014 10.014 0 0 0-4.489 2.582c-3.898 3.898-3.898 10.243
                 0 14.143a9.937 9.937 0 0 0 7.072 2.93 9.93 9.93 0 0 0 7.07-2.929 10.007 10.007 0 0 0 2.583-4.491 1.001 1.001 0 0 0-1.224-1.224zm-2.772 4.301a7.947 7.947 0 0 1-5.656 2.343 7.953 7.953 0 0 1-5.
                 658-2.344c-3.118-3.119-3.118-8.195 0-11.314a7.923 7.923 0 0 1 2.06-1.483 10.027 10.027 0 0 0 2.89 7.848 9.972 9.972 0 0 0 7.848 2.891 8.036 8.036 0 0 1-1.484 2.059z" 
                 fill="#ffffff"/>
                 </svg>
  const sun = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000000">
                <path d="M6.993 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007S14.761 6.993 12 6.993 6.993 
                9.239 6.993 12zM12 8.993c1.658 0 3.007 1.349 3.007 3.007S13.658 15.007 12 15.007 8.993 13.658 8.993 12 10.342 8.993 12 8.993zM10.998 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2h-3zm17 0h3v2h-3zM4.219 18.363l2.12-2.122 
                1.415 1.414-2.12 2.122zM16.24 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.342 7.759 4.22 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z" fill="#ffffff"/>
                </svg>
  const langIcon = <svg width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13 2.04932C13 2.04932 16 5.99994 16 11.9999C16 17.9999 13 21.9506 13 21.9506" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11 21.9506C11 21.9506 8 17.9999 8 11.9999C8 5.99994 11 2.04932 11 2.04932" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.62964 15.5H21.3704" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.62964 8.5H21.3704" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

  async function getConspect() {
    if (!text.trim()) return

    setResult('')
    setLoading(true)
    text.trim()
  setChatStarted(true)

  setTimeout(() => {
    setShowOutput(true)

    setTimeout(() => {
      setShowText(true)
    }, 600)

  }, 500)

    try {
      const response = await fetch('http://localhost:3000/conspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      setChatStarted(true)
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
      setError('Ошибка соединения с сервером')
      setLoading(false)
      setChatStarted(false)
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
          <div className = {styles.header}
          style = {{background: shift ? '#9E9E9E':'#212121'}}>
                    <div className = {styles.shiftchanger}
                    onClick={() => setShift(!shift)}
                    style = {
                        {backgroundColor: shift ? '#272757' : '#d7b702'}
                        }>
                        {shift ? moon : sun}
                  </div>

                  <div className = {styles.langIcon}>
                      {langIcon}
                  </div>
          </div>
              {error && (
                  <div className={styles.error}>
                    {error}
                  </div>)}
                  

                  <div className = {clsx(styles.descNameDiv, chatStarted && styles.closeDiv)}>

                <h1 className = {clsx(styles.name)}
                  style={{color: shift ? 'black' : 'white',}}
                  >
                Companión
              </h1>
              <h1 className = {clsx(styles.desc)}
                style={{color: shift ? 'black' : 'white'}}
                > 
                  Make your learning process easier - just paste that text here
              </h1>

                </div>


            {showOutput && (
              <div
                className={clsx(
                  styles.output,
                  showText && styles.outputVisible
                )}
                style={{ backgroundColor: shift ? '#9E9E9E' : '#212121' }}
              >
                {showText && result}
              </div>
            )}
        <div className={clsx(styles.sendingDiv)}>
          <textarea
            className={clsx(styles.textarea, chatStarted && !error && styles.textareaActive)}
            placeholder="Enter your text here..."
            value={text}
            style={{ background: shift ? '#9E9E9E' : '#212121' }}
            onChange={e => setText(e.target.value)}
          />
          <button
            className={clsx(
              styles.button,
              !text.trim() && styles.hideButton,
              text.trim() && styles.showButton
            )}
            style={{ backgroundColor: shift ? '#9E9E9E' : '#212121', color: shift ? 'black' : 'white' }}
            onClick={() => { getConspect() }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>

      </section>

    </>
  )
}
export default Header

