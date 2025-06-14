const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Permite requisições de origens diferentes

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');  // Caminho para onde as imagens serão enviadas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para o arquivo
  }
});

const upload = multer({ storage: storage });

// Conexão com o banco de dados barao_moda
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'barao_moda', // Banco de dados atualizado
});

// Verifica a conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados barao_moda');
  }
});

// Função para gerar token JWT
const gerarToken = (userId) => {
  return jwt.sign({ userId }, 'chave_secreta_segura', { expiresIn: '1h' });
};

// Endpoint para registrar usuário
app.post('/api/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    // Verifica se o email já existe no banco de dados
    const [existingUser] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    }

    // Criptografa a senha do usuário
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Insere o usuário no banco de dados
    await db.promise().query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [
      nome,
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

// Endpoint de login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    // Busca o usuário no banco de dados
    const [user] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    const validPassword = await bcrypt.compare(senha, user[0].senha);
    if (!validPassword) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    // Gera o token JWT
    const token = gerarToken(user[0].id_usuario);

    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Endpoint para cadastro de produto
app.post('/api/produtos', upload.single('foto'), async (req, res) => {
  const { nome_produto, descricao, preco, quantidade, usuario_id } = req.body;
  const foto = req.file ? req.file.filename : null; // Se a foto for enviada, armazena o nome dela

  if (!nome_produto || !descricao || !preco || !quantidade || !usuario_id) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    // Insere o produto no banco de dados
    await db.promise().query(
      'INSERT INTO produtos (nome_produto, descricao, preco, quantidade, foto, usuario_id) VALUES (?, ?, ?, ?, ?, ?)', 
      [nome_produto, descricao, preco, quantidade, foto, usuario_id]
    );

    res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error.message);  // Mensagem de erro detalhada
    res.status(500).json({ message: `Erro ao cadastrar produto: ${error.message}` });  // Envia o erro detalhado
  }
});

// Inicia o servidor
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
