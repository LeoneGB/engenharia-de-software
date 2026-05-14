import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ArquivosAcademicos.css';

function getFileIcon(file) {
  if (!file) return '📄';
  const ext = file.name.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️';
  if (['pdf'].includes(ext)) return '📑';
  if (['doc', 'docx'].includes(ext)) return '📝';
  if (['txt'].includes(ext)) return '📃';
  if (['zip', 'rar', '7z'].includes(ext)) return '🗜️';
  return '📎';
}

function ArquivosAcademicos() {
  const navigate = useNavigate();
  const [inputKey, setInputKey] = useState(0);
  const [activeTab, setActiveTab] = useState('meus');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('todos');
  const [selectedFormation, setSelectedFormation] = useState('');
  const [meusRepositorios, setMeusRepositorios] = useState([]);
  const [repositoriosTurma, setRepositoriosTurma] = useState([]);
  const API_URL = "http://localhost:3000/repositorios";
  const MY_REPOS_URL = "http://localhost:3000/repositorios/meus-repositorios";
  const TURMA_REPOS_URL = "http://localhost:3000/repositorios/repositorios-turma";
  const token = localStorage.getItem("token");

  const user = {
    nome: '',
    matricula: '',
  };

  const formations = [
    { id: 'Análise e Desenvolvimento de Sistemas', name: 'Análise e Desenvolvimento de Sistemas' },
    { id: 'Ciência da Computação', name: 'Ciência da Computação' }
  ];

  const periodos = ['2025.1', '2025.2', '2026.1', '2026.2', '2027.1', '2027.2'];
  const disciplinas = [
    'Algoritmos e Programação',
    'Banco de Dados',
    'Engenharia de Software',
    'Estrutura de Dados',
    'Desenvolvimento Web',
    'Inteligência Artificial'
  ];

  const [form, setForm] = useState({
    title: '',
    description: '',
    visibility: 'privado',
    course: '',
    semester: '2025.2',
    subject: 'Algoritmos e Programação',
    arquivoFile: null,
  });

  // Busca repositórios da turma
  useEffect(() => {
    const fetchRepositoriosTurma = async () => {
      try {
        const res = await axios.get(TURMA_REPOS_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRepositoriosTurma(res.data);
      } catch (err) {
        console.log(err);
        alert("Erro ao carregar repositórios da turma");
      }
    };
    fetchRepositoriosTurma();
  }, [token]);

  // Busca meus repositórios
  useEffect(() => {
    const fetchRepositorios = async () => {
      try {
        const res = await axios.get(MY_REPOS_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMeusRepositorios(res.data);
      } catch (err) {
        console.log(err);
        alert("Erro ao carregar repositórios");
      }
    };
    fetchRepositorios();
  }, [token]);

  const handleFileChange = (e) => {
  const file = e.target.files?.[0];

  // Se o usuário cancelou a seleção (nenhum arquivo), reseta o input
  if (!file) {
    e.target.value = '';    // <--- solução principal
    setForm(prev => ({ ...prev, arquivoFile: null }));
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Arquivo muito grande. Máximo de 5MB.");
    e.target.value = '';    // limpa o campo mesmo em caso de erro
    setForm(prev => ({ ...prev, arquivoFile: null }));
    return;
  }

  setForm(prev => ({ ...prev, arquivoFile: file }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.course) {
      alert("Preencha o título e selecione uma formação.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("course", form.course);
      formData.append("semester", form.semester);
      formData.append("subject", form.subject);
      formData.append("visibility", form.visibility);
      if (form.arquivoFile) {
        formData.append("file", form.arquivoFile);
      }

      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Repositório enviado com sucesso!");

      // Recarrega a lista de meus repositórios
      const res = await axios.get(MY_REPOS_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeusRepositorios(res.data);

      // Limpa o formulário
      setForm({
        title: "",
        description: "",
        visibility: "privado",
        course: "",
        semester: "2025.2",
        subject: "Algoritmos e Programação",
        arquivoFile: null,
      });

      // Reseta o input file (força recriação do elemento)
      setInputKey(prev => prev + 1);

    } catch (err) {
      console.log(err);
      alert("Erro ao enviar repositório");
    }
  };

  const deleteRepositorio = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/repositorios/meus-repositorios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeusRepositorios(prev => prev.filter(repo => repo.id !== id));
    } catch (err) {
      console.log(err);
      alert("Erro ao deletar");
    }
  };

  // Função para baixar o arquivo
  const downloadFile = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = `http://localhost:3000${fileUrl}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtros para meus repositórios
  let meusRepos = meusRepositorios;
  if (visibilityFilter !== 'todos') {
    meusRepos = meusRepos.filter(repo => repo.visibility === visibilityFilter);
  }
  if (selectedFormation) {
    meusRepos = meusRepos.filter(repo => repo.course === selectedFormation);
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    meusRepos = meusRepos.filter(repo =>
      repo.title.toLowerCase().includes(term) ||
      (repo.description && repo.description.toLowerCase().includes(term)) ||
      (repo.subject && repo.subject.toLowerCase().includes(term))
    );
  }

  // Filtros para repositórios da turma
  let outrosReposPublicos = repositoriosTurma.filter(
    repo => repo.userId !== user.matricula
  );
  if (selectedFormation) {
    outrosReposPublicos = outrosReposPublicos.filter(repo => repo.course === selectedFormation);
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    outrosReposPublicos = outrosReposPublicos.filter(repo =>
      (repo.title || '').toLowerCase().includes(term) ||
      (repo.description || '').toLowerCase().includes(term) ||
      (repo.userName || '').toLowerCase().includes(term) ||
      (repo.subject || '').toLowerCase().includes(term)
    );
  }

  const getFormationName = (course) => {
    const formation = formations.find(f => f.id === course);
    return formation ? formation.name : 'Formação não especificada';
  };

  const getStatusBadge = (status) => {
    if (status === 'pending') return <span className="status-badge pending">⏳ Pendente</span>;
    if (status === 'approved') return <span className="status-badge approved">✅ Aprovado</span>;
    if (status === 'rejected') return <span className="status-badge rejected">❌ Rejeitado</span>;
    return null;
  };

  return (
    <div className="arquivos-fullscreen">
      <div className="arquivos-container">

        <header className="arquivos-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Voltar ao Dashboard
          </button>
          <h1>Arquivos Acadêmicos</h1>
        </header>

        <div className="tabs-bar">
          <div className="tabs">
            <button className={activeTab === 'meus' ? 'tab active' : 'tab'} onClick={() => setActiveTab('meus')}>
              Meus Repositórios
            </button>
            <button className={activeTab === 'turmas' ? 'tab active' : 'tab'} onClick={() => setActiveTab('turmas')}>
              Repositórios de Turmas
            </button>
          </div>

          <div className="right-actions">
            <div className="formation-selector">
              <select value={selectedFormation} onChange={(e) => setSelectedFormation(e.target.value)}>
                <option value="">Todas as formações</option>
                {formations.map(formation => (
                  <option key={formation.id} value={formation.id}>{formation.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por título, disciplina, descrição ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab === 'meus' && (
          <div className="tab-content">
            <div className="upload-card">
              <form className="upload-form" onSubmit={handleSubmit}>
                <h3>Criar novo repositório (aguarda aprovação)</h3>
                <input type="text" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                <textarea placeholder="Descrição (opcional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

                <div className="form-row">
                  <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} required>
                    <option value="">Selecione uma formação</option>
                    {formations.map(formation => (
                      <option key={formation.id} value={formation.id}>{formation.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}>
                    {periodos.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                    {disciplinas.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="visibilidade-select">
                  <label>
                    <input type="radio" value="privado" checked={form.visibility === 'privado'} onChange={() => setForm({ ...form, visibility: 'privado' })} />
                    Privado (só você vê)
                  </label>
                  <label>
                    <input type="radio" value="publico" checked={form.visibility === 'publico'} onChange={() => setForm({ ...form, visibility: 'publico' })} />
                    Público (aparecerá após aprovação)
                  </label>
                </div>

                <div className="file-input-group">
                  <label htmlFor={`file-input-${inputKey}`} className="file-label">
                    📎 Selecionar arquivo (máx. 5MB)
                  </label>
                  <input
                    key={inputKey}
                    id={`file-input-${inputKey}`}
                    type="file"
                    accept=".zip,.rar,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  {form.arquivoFile && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#28a745' }}>
                      ✓ {form.arquivoFile.name}
                    </p>
                  )}
                </div>
                <button type="submit" className="btn-submit">Enviar para aprovação</button>
              </form>
            </div>

            <div className="filters">
              <div className="filter-buttons">
                <button className={visibilityFilter === 'todos' ? 'filter-active' : ''} onClick={() => setVisibilityFilter('todos')}>Todos</button>
                <button className={visibilityFilter === 'publico' ? 'filter-active' : ''} onClick={() => setVisibilityFilter('publico')}>🌍 Públicos</button>
                <button className={visibilityFilter === 'privado' ? 'filter-active' : ''} onClick={() => setVisibilityFilter('privado')}>🔒 Privados</button>
              </div>
            </div>

            <div className="repos-grid">
              {meusRepos.length === 0 ? (
                <div className="empty-message"><p>Nenhum repositório encontrado.</p></div>
              ) : (
                meusRepos.map(repo => (
                  <div key={repo.id} className="repo-card">
                    <div className="repo-header">
                      <h3>{repo.title}</h3>
                      <div className="badges">
                        <span className={`visibility-badge ${repo.visibility}`}>
                          {repo.visibility === 'publico' ? '🌍 Público' : '🔒 Privado'}
                        </span>
                        {getStatusBadge(repo.status)}
                      </div>
                    </div>

                    <p className="repo-description">{repo.description || 'Sem descrição'}</p>

                    <div className="repo-meta">
                      <small>Formação: {getFormationName(repo.course)}</small><br />
                      {repo.semester && <><small>Período: {repo.semester}</small><br /></>}
                      {repo.subject && <><small>Disciplina: {repo.subject}</small><br /></>}
                      <small>Criado em: {new Date(repo.created_at).toLocaleDateString()}</small>
                    </div>

                    {repo.file_url && (
                      <div className="repo-attachment">
                        <div className="file-info-with-download">
                          {/* Link que abre em nova aba */}
                          <a
                            href={`http://localhost:3000${repo.file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-link"
                          >
                            {getFileIcon({ name: repo.file_url.split('/').pop() })} {repo.file_url.split('/').pop()}
                          </a>
                          {/* Botão de download */}
                          <button
                            onClick={() => downloadFile(repo.file_url, repo.file_url.split('/').pop())}
                            className="btn-download"
                            title="Baixar arquivo"
                          >
                            ⬇️ Baixar
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="repo-actions">
                      <button onClick={() => deleteRepositorio(repo.id)} className="btn-delete">Excluir</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'turmas' && (
          <div className="tab-content">
            <div className="repos-grid">
              {outrosReposPublicos.length === 0 ? (
                <div className="empty-message"><p>Nenhum repositório público aprovado disponível.</p></div>
              ) : (
                outrosReposPublicos.map(repo => (
                  <div key={repo.id} className="repo-card">
                    <div className="repo-header">
                      <h3>{repo.title}</h3>
                      <span className="visibility-badge publico">🌍 Público</span>
                    </div>
                    <p className="repo-description">{repo.description || 'Sem descrição'}</p>
                    <div className="repo-meta">
                      <small>Aluno: {repo.userName}</small><br />
                      <small>Formação: {getFormationName(repo.course)}</small><br />
                      {repo.semester && <><small>Período: {repo.semester}</small><br /></>}
                      {repo.subject && <><small>Disciplina: {repo.subject}</small><br /></>}
                      <small>Criado em: {new Date(repo.created_at).toLocaleDateString()}</small>
                    </div>
                    {repo.file_url && (
                      <div className="repo-attachment">
                        <div className="file-info-with-download">
                          <a
                            href={`http://localhost:3000${repo.file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-link"
                          >
                            {getFileIcon({ name: repo.file_url.split('/').pop() })} {repo.file_url.split('/').pop()}
                          </a>
                          <button
                            onClick={() => downloadFile(repo.file_url, repo.file_url.split('/').pop())}
                            className="btn-download"
                            title="Baixar arquivo"
                          >
                            ⬇️ Baixar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ArquivosAcademicos;