require('dotenv').config()
const fs = require('node:fs')
const path = require('node:path')
const { Client, GatewayIntentBits, Collection } = require('discord.js')

const { DISCORD_BOT_TOKEN } = process.env

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// retrieve the commands
client.commands = new Collection()
const commandsPath = path.join(__dirname, 'src', 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)

  client.commands.set(command.data.name, command)
}

// attach commands to interaction
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) return

  try {
    console.log(`${interaction.user.username} a utilisé ${interaction.commandName}.`)
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.editReply({content: 'Oups, je n\'ai pas réussi mon coup...', ephemeral: true})
  }
})

client.once('ready', c => console.log(`Ready and logged in as ${c.user.tag}`))

// Login to Discord with your client's token
client.login(DISCORD_BOT_TOKEN);