import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/login', { email, senha });

      if (response.status === 200) {
        const { token } = response.data; // Apenas o token é retornado

        // Armazenar apenas o token no localStorage
        localStorage.setItem('token', token);

        alert('Login realizado com sucesso!');

        // Redirecionar para o Dashboard
        navigate('/dashboard');
      } else {
        alert(response.data.message || 'Erro ao fazer login.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Usuário ou senha inválidos.');
      } else {
        alert('Erro ao se conectar com o servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="auth-container">
        {isLoading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="border-animation">
            <div className="auth-form auth-form-login">
              <h2>Seja bem-vindo ao <strong>Stockware</strong></h2>
              <p>A melhor gestão do seu negócio!</p>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="password-container form-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button type="submit" className="login-button">Entrar</button>
              </form>
              <div className="auth-links">
                <a href="/forgot-password" className="forgot-password-link">Esqueci minha senha</a>
                <p>
                  Não tem uma conta?{' '}
                  <span
                    className="create-account-link"
                    onClick={() => navigate('/signup')}
                  >
                    Crie aqui!
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
