// =======================================================
// SERVIDOR WEB — API e Painel de Cadastro
// =======================================================
require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const app = express();

// =======================================================
// CONFIGURAÇÃO DO BANCO (MySQL)
// =======================================================
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

// =======================================================
// MODELO DE USUÁRIO
// =======================================================
const User = sequelize.define('User', {
  discordId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sobrenome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// =======================================================
// MIDDLEWARES
// =======================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// =======================================================
// ROTAS DA API
// =======================================================

// Rota para receber cadastros do bot
app.post('/api/users', async (req, res) => {
  try {
    const { discordId, nome, sobrenome, idade, email, cpf } = req.body;

    if (!discordId || !nome || !sobrenome || !idade || !email || !cpf) {
      return res.status(400).json({ ok: false, error: 'Dados incompletos' });
    }

    await User.create({ discordId, nome, sobrenome, idade, email, cpf });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar usuário:', err);
    res.status(500).json({ ok: false, error: 'Erro no servidor' });
  }
});

// Página web com lista de cadastros
app.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ order: [['id', 'DESC']] });
    res.render('index', { users });
  } catch (err) {
    res.status(500).send('Erro ao carregar usuários');
  }
});

// =======================================================
// SINCRONIZAÇÃO E INÍCIO DO SERVIDOR
// =======================================================
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ Conectado ao MySQL e tabelas sincronizadas.');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🌐 Painel rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco:', err);
  }
})();
