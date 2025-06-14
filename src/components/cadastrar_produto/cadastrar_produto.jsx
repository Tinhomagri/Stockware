import React, { useState, useEffect } from 'react';
import { FaBars, FaHome, FaPlus, FaEdit, FaBox, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import '../styles/cadastrar_produto.css';

function CadastrarProduto() {
  const [nomeProduto, setNomeProduto] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');
  const [quantidadeProduto, setQuantidadeProduto] = useState('');
  const [fotoProduto, setFotoProduto] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [erro, setErro] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Função para buscar o nome do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await fetch('http://localhost:3001/api/usuario', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            if (data && data.nome) {
              setUserName(data.nome);
              setUserId(data.id);
            } else {
              setErro('Nome não encontrado na resposta da API.');
              setUserName('Nome não encontrado');
            }
          } else {
            setErro('Erro ao buscar dados do usuário. A resposta da API foi inesperada.');
            setUserName('Erro ao buscar nome');
          }
        } catch (error) {
          setErro(`Erro ao buscar dados do usuário: ${error.message}`);
          setUserName('Erro ao buscar nome');
        }
      } else {
        window.location.href = '/login';  // Redireciona se o token não estiver presente
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar se todos os campos estão preenchidos
    if (!nomeProduto || !descricaoProduto || !precoProduto || !quantidadeProduto || !fotoProduto) {
      alert('Todos os campos devem ser preenchidos.');
      return;
    }

    const formData = new FormData();
    formData.append('usuario_id', userId);
    formData.append('nome_produto', nomeProduto);
    formData.append('descricao', descricaoProduto);
    formData.append('preco', precoProduto);
    formData.append('quantidade', quantidadeProduto);
    formData.append('foto', fotoProduto);

    const token = getToken();

    if (!token) {
      alert('Token não encontrado! Efetue o login novamente.');
      window.location.href = '/login';
      return;
    }

    try {
      // Envio de requisição com o token
      const response = await axios.post('http://localhost:3001/api/produtos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert('Produto cadastrado com sucesso!');
        // Resetando o formulário
        setNomeProduto('');
        setDescricaoProduto('');
        setPrecoProduto('');
        setQuantidadeProduto('');
        setFotoProduto(null);
      } else {
        console.error('Erro inesperado na API:', response);
        alert('Erro inesperado ao cadastrar produto!');
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error.response ? error.response.data : error.message);
      alert(`Erro ao cadastrar produto! ${error.response ? error.response.data : error.message}`);
    }
  };

  const handleFotoChange = (e) => {
    setFotoProduto(e.target.files[0]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className={`cadastrar-produto ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Botão para abrir/fechar a Sidebar */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2 className="sidebar-title">Stockware</h2>
        <nav className="nav">
          <a href="/dashboard" className="nav-link">
            <FaHome className="icon" /> Dashboard
          </a>
          <a href="/cadastro-produto" className="nav-link active">
            <FaPlus className="icon" /> Cadastro de Produto
          </a>
          <a href="#editar" className="nav-link">
            <FaEdit className="icon" /> Editar Produto
          </a>
          <a href="#estoque" className="nav-link">
            <FaBox className="icon" /> Estoque
          </a>
        </nav>
        <div className="footer">
          <hr />
          <p>Bem-vindo, {userName || 'Usuário'}</p>
          <hr />
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="icon" /> Sair
          </button>
          <p className="footer-text">© Stockware 2024 - Todos os direitos reservados.</p>
        </div>
      </aside>

      {/* Formulário de cadastro de produto */}
      <div className={`form-container ${isSidebarOpen ? 'shifted' : ''}`}>
        <h2>Cadastrar Produto</h2>
        {erro && <p className="error-message">{erro}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nomeProduto">Nome do Produto</label>
            <input
              type="text"
              id="nomeProduto"
              value={nomeProduto}
              onChange={(e) => setNomeProduto(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descricaoProduto">Descrição do Produto</label>
            <textarea
              id="descricaoProduto"
              value={descricaoProduto}
              onChange={(e) => setDescricaoProduto(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="precoProduto">Preço</label>
            <input
              type="number"
              id="precoProduto"
              value={precoProduto}
              onChange={(e) => {
                const value = Math.max(0, parseFloat(e.target.value));
                setPrecoProduto(value);
              }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantidadeProduto">Quantidade</label>
            <input
              type="number"
              id="quantidadeProduto"
              value={quantidadeProduto}
              onChange={(e) => {
                const value = Math.max(0, parseInt(e.target.value, 10));
                setQuantidadeProduto(value);
              }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fotoProduto">Foto do Produto</label>
            <input
              type="file"
              id="fotoProduto"
              accept="image/*"
              onChange={handleFotoChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">Cadastrar Produto</button>
        </form>
      </div>
    </div>
  );
}

export default CadastrarProduto;
