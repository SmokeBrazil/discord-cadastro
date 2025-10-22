// =======================================================
// BOT DISCORD — Cadastro com Modal + Envio para API
// Registro de comando diretamente no servidor (guild)
// =======================================================
require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Routes,
  REST,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  InteractionType,
  SlashCommandBuilder
} = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Comando /cadastrar
const command = new SlashCommandBuilder()
  .setName('cadastrar')
  .setDescription('Inicia o cadastro de usuário');

// Registro do comando diretamente no servidor (guild)
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('📦 Registrando comando /cadastrar no servidor ...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.GUILD_ID),
      { body: [command.toJSON()] }
    );
    console.log('✅ Comando /cadastrar registrado no servidor com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao registrar comando:', err);
  }
})();

// Quando o bot estiver online
client.once('ready', () => {
  console.log(`🤖 Bot online: ${client.user.tag}`);
});

// Listener para interações
client.on('interactionCreate', async (interaction) => {
  try {
    // 1️⃣ Slash command /cadastrar
    if (interaction.isChatInputCommand() && interaction.commandName === 'cadastrar') {
      const modal = new ModalBuilder()
        .setCustomId('cadastroModal')
        .setTitle('Cadastro de Usuário');

      const nome = new TextInputBuilder()
        .setCustomId('nome')
        .setLabel('Nome')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const sobrenome = new TextInputBuilder()
        .setCustomId('sobrenome')
        .setLabel('Sobrenome')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const idade = new TextInputBuilder()
        .setCustomId('idade')
        .setLabel('Idade')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const email = new TextInputBuilder()
        .setCustomId('email')
        .setLabel('Email')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const cpf = new TextInputBuilder()
        .setCustomId('cpf')
        .setLabel('CPF')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(nome),
        new ActionRowBuilder().addComponents(sobrenome),
        new ActionRowBuilder().addComponents(idade),
        new ActionRowBuilder().addComponents(email),
        new ActionRowBuilder().addComponents(cpf)
      );

      await interaction.showModal(modal);
    }

    // 2️⃣ Quando o usuário envia o modal
    if (interaction.type === InteractionType.ModalSubmit && interaction.customId === 'cadastroModal') {
      await interaction.deferReply({ ephemeral: true });

      const data = {
        discordId: interaction.user.id,
        nome: interaction.fields.getTextInputValue('nome'),
        sobrenome: interaction.fields.getTextInputValue('sobrenome'),
        idade: parseInt(interaction.fields.getTextInputValue('idade'), 10) || 0,
        email: interaction.fields.getTextInputValue('email'),
        cpf: interaction.fields.getTextInputValue('cpf')
      };

      // Validação básica
      if (!data.nome || !data.sobrenome || !data.email || !data.cpf || data.idade <= 0) {
        return interaction.editReply({ content: '⚠️ Dados inválidos. Verifique e tente novamente.' });
      }

      // Envia para o servidor
      try {
        const resp = await axios.post(`${process.env.API_BASE_URL}/users`, data);
        if (resp.data && resp.data.ok) {
          await interaction.editReply({ content: '✅ Cadastro realizado com sucesso!' });
        } else {
          await interaction.editReply({ content: '⚠️ Falha ao salvar cadastro no servidor.' });
        }
      } catch (err) {
        console.error('Erro ao enviar dados para API:', err?.response?.data || err.message);
        await interaction.editReply({
          content: '❌ Erro ao conectar com o servidor. Contate o administrador.',
        });
      }
    }
  } catch (err) {
    console.error('Erro em interactionCreate:', err);
  }
});

// Login do bot
client.login(process.env.DISCORD_TOKEN);
