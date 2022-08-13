require('dotenv').config()
const { SlashCommandBuilder } = require('discord.js')

const { getPlayer, createPlayer, addScore } = require('../api/notion')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('score-me')
    .setDescription('Enregistrez un score de la suite "Antix" depuis Discord.')
    .addStringOption(option => option
      .setName('jeu')
      .setDescription('Le jeu de votre performance.')
      .setRequired(true)
      .addChoices(
        { name: 'Cémantix', value: 'Cémantix'},
        { name: 'Pédantix', value: 'Pédantix'},
        { name: 'Synoptix', value: 'Synoptix'}
      ))
    .addIntegerOption(option => option
      .setName('coups')
      .setDescription('Le nombre d\'essais avant de trouver.')
      .setRequired(true))
    .addIntegerOption(option => option
      .setName('position')
      .setDescription('Votre classement sur cette performance.')
      .setRequired(true)),
  async execute(interaction) {
    const playerTag = `${interaction.user.username}#${interaction.user.discriminator}`
    interaction.deferReply()
    let playerQuery = await getPlayer(playerTag)
    let player = {}

    if (playerQuery.results.length === 0) {
      playerQuery = await createPlayer(interaction.user.username, playerTag, interaction.user.displayAvatarURL())
      player = playerQuery
    } else {
      player = playerQuery.results[0]
    }

    const pointCalculation = Math.ceil((Math.exp(-0.01 * interaction.options.getInteger('coups') + 7) + 250)/10)

    const score = await addScore(player, {
      game: interaction.options.getString('jeu'),
      tries: interaction.options.getInteger('coups'),
      position: interaction.options.getInteger('position')
    })

    interaction.editReply(`🎉 ${interaction.user.username} a trouvé le ${interaction.options.getString('jeu')} du jour en ${interaction.options.getInteger('coups')} coups et est classé ${interaction.options.getInteger('position')}e! Ca lui fait ${pointCalculation} points!\nhttps://elderly-bloom-f4f.notion.site/508ada2b4c6c48d2bb0fd5f7be9a8105?v=1723a1dfe3b948d881df55122e2b6adb`)
  }
}