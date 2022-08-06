require('dotenv').config()
const { SlashCommandBuilder } = require('discord.js')
const { execute } = require('./score-me')

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
    return
  }
}