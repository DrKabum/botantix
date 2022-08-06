require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { getRankings } = require('../api/notion')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank-me')
    .setDescription('Quel est votre classement au global?')
    .addStringOption(option => option
      .setName('jeu')
      .setDescription('La catégorie de classement qui vous intéresse.')
      .setRequired(true)
      .addChoices(
        { name: 'Global', value: 'global' },
        { name: 'Cémantix', value: 'Cémantix'},
        { name: 'Pédantix', value: 'Pédantix'},
        { name: 'Synoptix', value: 'Synoptix'}
      )),
  async execute(interaction) {
    interaction.deferReply()
    let game = interaction.options.getString('jeu')
    if (game === 'global') game = null
    const response = await getRankings(game)

    let reply = '**Voici le classement du oLoL Kr3w:**'
    reply += ` *${game === null ? 'Général' : game}*`
    response.forEach((player, i) => reply += `\n**${i+1}e place**: ${player.name} avec ${player.score} points`)
    interaction.editReply(reply)
  }
}