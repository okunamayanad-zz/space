const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// 7/24
const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("space");
});
server.listen(3000);
// 7/24 END

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code
client.once('ready', () => {
	console.log('Ready to fight!');
	console.log('Bot is online!');
	console.log('---------------- STATS ----------------');
	console.log('Bot is connected to ' + client.guilds.cache.size + ' servers!');
	console.log('Bot is connected to ' + client.users.cache.size + ' users!');
	console.log('Bot is connected to ' + client.channels.cache.size + ' channels!');
	console.log('---------------- STATS ----------------');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
