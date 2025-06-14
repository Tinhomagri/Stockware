import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../styles/cadastro.css';

function RegisterForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('funcionario'); // Adicionado campo de tipo de usuário
  const navigate = useNavigate(); 

  const handleRegister = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/api/register', { nome, email, senha, tipo_usuario: tipoUsuario })
      .then(response => {
        alert(response.data.message);
        navigate('/login'); // Redireciona para a página de login após o cadastro
      })
      .catch(error => alert('Erro ao registrar usuário'));
  };

  const redirectToLogin = () => {
    navigate('/login'); 
  };

  return (
    <div className="auth-container">
      <div className="auth-form auth-form-register">
        <h2>Criar conta Stockware</h2>
        <p>Preencha os campos a seguir</p>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <div className="redirect-link">
          <p>
            Já possui uma conta? 
            <span onClick={redirectToLogin}> Faça login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
