import api, { apiFileUrl } from "../api"
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CoordenadorRepositorios.css';

function CoordenadorRepositorios() {
  const navigate = useNavigate();
  const [repositorios, setRepositorios] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
  fetchPendentes();
}, []);

const fetchPendentes = async () => {
  try {
    const res = await api.get(
      "/repositorios/pendentes",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setRepositorios(res.data);

  } catch (err) {
    console.log(err);
  }
};

  const approveRepository = async (id) => {

  try {

    await api.patch(
      `/repositorios/pendente/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setRepositorios(prev =>
      prev.filter(repo => repo.id !== id)
    );

  } catch (err) {

    console.log(err);

    alert("Erro ao aprovar");
  }
};

const rejectRepository = async (id) => {

  try {

    await api.delete(
      `/repositorios/pendente/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setRepositorios(prev =>
      prev.filter(repo => repo.id !== id)
    );

  } catch (err) {

    console.log(err);

    alert("Erro ao rejeitar");
  }
};

  const pendentes = repositorios.filter(repo => repo.status === 'pending');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="coordenador-container">
      <header className="coordenador-header">
        
        <h1>Área do Coordenador – Repositórios Pendentes</h1>
        <button className="logout-button" onClick={handleLogout}>Sair</button>
      </header>

      <div className="repos-list">
        {pendentes.length === 0 ? (
          <p className="empty-message">Nenhum repositório aguardando aprovação.</p>
        ) : (
          pendentes.map(repo => (
            <div key={repo.id} className="repo-card">
              <div className="repo-info">
                <h3>{repo.title}</h3>

                <p>{repo.description || 'Sem descrição'}</p>

                <p>
                  <strong>Aluno:</strong> {repo.student_name}
                </p>

                <p>
                  <strong>Matricula:</strong> {repo.student_matricula}
                </p>

                <p>
                  <strong>Formação:</strong> {repo.course}
                </p>

                <p>
                  <strong>Disciplina:</strong> {repo.subject}
                </p>

                <p>
                  <strong>Período:</strong> {repo.semester}
                </p>

                <p>
                  <strong>Visibilidade:</strong>{" "}
                  {repo.visibility === 'publico'
                    ? '🌍 Público'
                    : '🔒 Privado'}
                </p>

                {repo.file_url && (
                  <a
                    href={apiFileUrl(repo.file_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 Abrir Arquivo
                  </a>
                )}
              </div>
              <div className="repo-actions">
                <button
                  className="btn-approve"
                  onClick={() => approveRepository(repo.id)}
                >
                   Aprovar
                </button>
                <button
                  className="btn-reject"
                  onClick={() => rejectRepository(repo.id)}
                >
                   Rejeitar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CoordenadorRepositorios;