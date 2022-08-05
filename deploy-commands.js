require('dotenv').config()
const fs = require('node:fs')
const path = require('node:path')
const { Routes } = require('discord.js')
const { REST } = require('@discordjs/rest')

const {
  DISCORD_APP_ID,
  DEV_GUILD_ID,
  DISCORD_BOT_TOKEN
} = process.env

const commands = []
const commandPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const filePath = path.join(commandPath, file)
	const command = require(filePath)
	commands.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(DISCORD_APP_ID, DEV_GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);