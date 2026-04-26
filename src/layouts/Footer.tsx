import { useEffect, useRef } from "react"
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons"
import { Link } from "react-router-dom"
import useLanguage from "../hooks/useLanguage"


const getRandomEmojis = (): string[] => {
  const emojis = ["♥️", "🐳", "🐘", "🐍", "🐧", "🌽", "⚛️", "🎮"]
      
  let count = 1
  while ((Math.random() > (19 / 20)) && count < emojis.length) count += 1

  const outEmojis: string[] = []
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * emojis.length)
    outEmojis.push(emojis[index])
    emojis.splice(index, 1)
  }

  return outEmojis
}

const writeEmojis = (emojis: string[], node: HTMLElement) => {
  emojis.forEach((emoji, index) => {
    const delay = 500 + Math.random() * 500
    setTimeout(() => {
      node.appendChild(document.createTextNode(emoji))
    }, index * 500 + delay)
  })
}

const eraseEmojis = (node: HTMLElement) => {
  const delay = 100 + Math.random() * 150
  Array.from(node.childNodes).reverse().forEach((child, i) => {
    setTimeout(() => {
      child.remove()
    }, i * delay)
  })
}

const emojisInLoop = (emojiRef: React.RefObject<HTMLSpanElement | null>) => {
  if (!emojiRef.current) return
  
  const emojis = getRandomEmojis()
  writeEmojis(emojis, emojiRef.current)
  
  setTimeout(() => {
    if (!emojiRef.current) return
    eraseEmojis(emojiRef.current)
    
    setTimeout(() => {
      emojisInLoop(emojiRef)
    }, Math.random() * 500)
  }, (emojis.length * 500 + 1000) + 2000 / emojis.length)
}

export default function Footer() {
  const emojiRef = useRef<HTMLSpanElement>(null)
  const { t } = useLanguage()

  useEffect(() => {emojisInLoop(emojiRef)}, [])

  return (
    <footer className="dark border-t border-[rgb(var(--border))] bg-[rgb(var(--card))] py-8 transition-colors">
      <div className="mx-auto max-w-5xl px-4">
        <hr className="my-4 border-[rgb(var(--border))]" />
        <div className="flex justify-center gap-6 text-sm text-[rgb(var(--muted))]">
          <Link to={"https://discord.com/users/608870766586494976"} target="_blank">
            <SiDiscord size={40} color="#ffffff"/>
          </Link>
          <Link to={"https://github.com/Hyromy"} target="_blank">
            <SiGithub size={40} color="#ffffff"/>
          </Link>
        </div>
        <hr className="my-4 border-[rgb(var(--border))]" />
        <div className="flex justify-center">
          <small className="text-[rgb(var(--muted))]">
            {t("footer.madeWith")} <span ref={emojiRef} /><span className="cursor-blink" /> {t("footer.author")}
          </small>
        </div>
      </div>
    </footer>
  )
}
