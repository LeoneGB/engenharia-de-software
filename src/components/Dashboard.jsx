import { useState, useRef, useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { FaUserCircle, FaChevronDown } from 'react-icons/fa'
import '../css/Dashboard.css'
import logoNassau from '../assets/jogo-nassau.png'

function Dashboard() {
  const studentName = localStorage.getItem("studentName");
  const studentMatricula = localStorage.getItem("studentMatricula");
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentMatricula");

    navigate('/')
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo-area">
          <img src={logoNassau} alt="UNINASSAU" className="logo-icon" />
          <span className="institution">UNINASSAU</span>
        </div>
        <nav className="dashboard-nav">
          <a href="#">MEU CURSO</a>
          <a href="#">CARTEIRA DIGITAL</a>
          <a href="#">SOLICITAÇÕES</a>
          <a href="#">BIBLIOTECA</a>
          <a href="#">LINKS ÚTEIS</a>
          <Link to="/repositorios">ARQUIVOS ACADÊMICOS</Link>
        </nav>

        {/* Menu do usuário */}
        <div className="user-menu" ref={dropdownRef}>
          <button className="user-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <FaUserCircle className="user-icon" />
            <span className="user-name">Engenharia de Software</span>
            <FaChevronDown className={`chevron ${dropdownOpen ? 'rotate' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="user-info">
                <p><strong>{studentName}</strong></p>
                <p className="matricula">Matrícula: {studentMatricula}</p>
              </div>
              <hr />
              <button className="logout-button" onClick={handleLogout}>
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <div className="course-info">
            <h2>Análise e Desenvolvimento de Sistemas</h2>
          </div>
          <div className="user-greeting">
            <p>Olá, {studentName}!</p>
            <p>Olá, bem-vindo(a) ao novo Portal do Aluno.</p>
            <button className="tour-button">INICIAR PASSEIO</button>
          </div>
        </div>

        <div className="periods">
          <button className="period active">2025.2</button>
          <button className="period">2026.1</button>
          <button className="period">2026.2</button>
          <button className="period">2027.1</button>
          <button className="period">2027.2</button>
        </div>
      </main>
    </div>
  )
}

export default Dashboard