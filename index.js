import 'dotenv/config'
import { Client, GatewayIntentBits } from 'discord.js'

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Login to Discord with your client's token
client.login(DISCORD_BOT_TOKEN);