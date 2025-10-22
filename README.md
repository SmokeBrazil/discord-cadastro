# 🎮 Discord Cadastro Bot

[![Node.js](https://img.shields.io/badge/Node.js-22.0-brightgreen?style=flat-square)](https://nodejs.org/)
[![GitHub issues](https://img.shields.io/github/issues/SmokeBrazil/discord-cadastro?style=flat-square)](https://github.com/SmokeBrazil/discord-cadastro/issues)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

Bot de Discord completo que permite cadastrar usuários através de um **modal interativo** e gerenciar os dados via **painel web** em Node.js + Express + MySQL.

---

## 💡 Funcionalidades

- Modal de cadastro no Discord com campos:
  - Nome
  - Sobrenome
  - Idade
  - Email
  - CPF
- Envio automático dos dados para a API do painel web
- Painel web moderno para visualizar e gerenciar os cadastros
- Validação básica de dados no bot
- Estrutura escalável e pronta para VPS

---

## 🛠 Tecnologias

- [Node.js](https://nodejs.org/)
- [Discord.js](https://discord.js.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Sequelize](https://sequelize.org/)
- [EJS](https://ejs.co/)
- [Axios](https://axios-http.com/)

---

## 🚀 Como rodar

1. Clone o repositório:

```bash
git clone https://github.com/SmokeBrazil/discord-cadastro.git
cd discord-cadastro
npm install
node web.js
node bot.js
