require('dotenv').config()
const fs = require('node:fs')
const path = require('node:path')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const cron = require('node-cron')

const {
  getYesterdaysWord,
  getYesterdaysPage,
  getYesterdaysMovie
} = require('./src/api/games')

const { DISCORD_BOT_TOKEN, CHANNEL_ID } = process.env

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

// Schedule notifications
cron.schedule('1 0 * * *', async () => {
  const word = await getYesterdaysWord()


}, {timezone: 'Europe/Paris'})

client.once('ready', async c => {
  console.log(`Ready and logged in as ${c.user.tag}`)
  // join thread
  const channel = await client.channels.fetch(CHANNEL_ID)
  const thread = channel.threads.cache.find(x => x.name === '📝 Cémantix');
  if (thread.joinable) thread.join();

  // schedule notifications
  cron.schedule(
    '1 0 * * *', 
    async () => thread.send(await getYesterdaysWord()), 
    {timezone: 'Europe/Paris'})

  cron.schedule(
    '1 12 * * *', 
    async () => thread.send(await getYesterdaysPage()), 
    {timezone: 'Europe/Paris'})

  // TODO: make it work for movies as well...
  // cron.schedule(
  //   '*/5 * * * * *', 
  //   async () => console.log(await getYesterdaysMovie()), 
  //   {timezone: 'Europe/Paris'})
})

// Login to Discord with your client's token
client.login(DISCORD_BOT_TOKEN);

