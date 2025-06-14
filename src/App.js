import { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/login/login';
import RegisterForm from './components/cadastro/cadastro';
import Dashboard from './components/dashboard/dashboard'; // Importa o componente Dashboard
import CadastrarProduto from './components/cadastrar_produto/cadastrar_produto'; // Importa o componente de cadastro de produto
import './App.css';

function App() {
  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    // Aqui você pode verificar a presença do token JWT no localStorage ou em cookies
    const token = localStorage.getItem('token');  // ou usar sessionStorage ou cookies
    return token ? true : false;
  };

  return (
    <StrictMode>
      <Router>
        <Routes>
          {/* Rota inicial */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Rota para login */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Rota para cadastro */}
          <Route path="/signup" element={<RegisterForm />} />
          
          {/* Rota para o dashboard, protegida por autenticação */}
          <Route
            path="/dashboard"
            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
          />
          
          {/* Rota para cadastro de produto, protegida por autenticação */}
          <Route
            path="/cadastro-produto"
            element={isAuthenticated() ? <CadastrarProduto /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </StrictMode>
  );
}

export default App;
