import 'dotenv/config'
import { SlashCommandBuilder, Routes } from 'discord.js';
import { REST } from '@discordjs/rest'

const {
  DISCORD_APP_ID,
  DEV_GUILD_ID,
  DISCORD_BOT_TOKEN
} = process.env

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(DISCORD_APP_ID, DEV_GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);