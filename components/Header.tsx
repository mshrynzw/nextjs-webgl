import React from "react"
import Link from "next/link"

interface HeaderProps {
  className : string
}

const Header : React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`shadow-2xl ${className}`}>
      <h3 className="logo">maro.com</h3>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/cube">Cube</Link></li>
        <li><Link href="/wave">Wave</Link></li>
        <li><Link href="/tunnel">Tunnel</Link></li>
        <li><Link href="/snow">Snow</Link></li>
      </ul>
    </header>
  )
}

export default Header