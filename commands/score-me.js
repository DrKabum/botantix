require('dotenv').config()
const { SlashCommandBuilder } = require('discord.js')

const { getPlayer, getDatabase, createPlayer } = require('../api/notion')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('score-me')
    .setDescription('Enregistrez un score de la suite "Antix" depuis Discord.'),
  async execute(interaction) {
    const playerTag = `${interaction.user.username}#${interaction.user.discriminator}`
    interaction.deferReply()
    let playerQuery = await getPlayer(playerTag)
    let player = {}

    if (playerQuery.results.length === 0) {
      playerQuery = await createPlayer(interaction.member.nickname, playerTag)
      player = playerQuery
    } else {
      player = playerQuery.results[0]
    }

    console.log('player', player)


    // const response = await getDatabase()

    // console.log(response)
  }
}