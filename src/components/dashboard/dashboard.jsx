import React, { useState, useEffect } from 'react';
import { FaHome, FaPlus, FaEdit, FaBox, FaSignOutAlt, FaBars } from 'react-icons/fa';
import '../styles/dashboard.css';

function Dashboard() {
  const [userName, setUserName] = useState(''); // Nome do usuário
  const [stockSummary, setStockSummary] = useState([]); // Dados do estoque
  const [lowStock, setLowStock] = useState([]); // Dados de estoque baixo
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Função para verificar se o token existe
  const getToken = () => {
    const token = localStorage.getItem('token');
    console.log('Token encontrado:', token); // Verifica o token
    return token;
  };

  // Função para buscar o nome do usuário
  useEffect(() => {
    const fetchUserName = async () => {
      const token = getToken(); // Obtendo o token do localStorage
      if (!token) {
        window.location.href = '/login'; // Redireciona para login se o token não existir
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/usuario', {
          headers: { Authorization: `Bearer ${token}` }, // Enviando o token no cabeçalho
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.nome) {
            setUserName(data.nome); // Definindo o nome do usuário
          } else {
            console.error('Nome não encontrado na resposta da API.');
            setUserName('Nome não encontrado');
          }
        } else {
          console.error('Erro na resposta da API:', response.status, response.statusText);
          setUserName('Erro ao buscar nome');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setUserName('Erro ao buscar nome');
      }
    };

    fetchUserName();
  }, []);

  // Função para buscar os dados de estoque
  useEffect(() => {
    const fetchStockData = async () => {
      const token = getToken();
      if (token) {
        try {
          const stockResponse = await fetch('http://localhost:3001/api/estoque', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const stockData = await stockResponse.json();

          if (stockData) {
            setStockSummary(stockData.summary || []);
            setLowStock(stockData.lowStock || []);
          }
        } catch (error) {
          console.error('Erro ao buscar dados de estoque:', error);
        }
      }
    };

    fetchStockData();
  }, []);

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redireciona para a página de login após o logout
  };

  return (
    <div className={`dashboard ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar Toggle Button */}
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
          <a href="/cadastro-produto" className="nav-link">
            <FaPlus className="icon" /> Cadastro de Produto
          </a>
          <a href="/editar" className="nav-link">
            <FaEdit className="icon" /> Editar Produto
          </a>
          <a href="/estoque" className="nav-link">
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

      {/* Corpo Principal do Dashboard */}
      <div className={`dashboard-body ${isSidebarOpen ? 'shifted' : ''}`}>
        {/* Cabeçalho do Dashboard */}
        <header className="dashboard-header">
          <h1>Bem-vindo, {userName || 'Usuário'}</h1>
          <p>Resumo do Estoque</p>
        </header>

        {/* Seções do Dashboard */}
        <section className="card">
          <h2>Resumo do Estoque</h2>
          <ul>
            {stockSummary.map((item, index) => (
              <li key={index}>
                <strong>{item.name}</strong>: {item.quantity} unidades
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Estoque Baixo</h2>
          <ul>
            {lowStock.length > 0 ? (
              lowStock.map((item, index) => (
                <li key={index}>
                  <strong>{item.name}</strong>: {item.quantity} unidades restantes
                </li>
              ))
            ) : (
              <li>Não há produtos com estoque baixo</li>
            )}
          </ul>
        </section>

        <section className="card">
          <h2>Produtos Mais Vendidos</h2>
          <ul>
            <li>Produto A: 150 vendas</li>
            <li>Produto B: 120 vendas</li>
            <li>Produto C: 100 vendas</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
