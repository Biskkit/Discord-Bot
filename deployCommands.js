// This file will deploy commands to a specific guild
const { REST, Routes } = require('discord.js');

const fs = require('node:fs');
const path = require ('node:path');
const dotenv = require('dotenv');
dotenv.config();

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);


// Pushes each command module to the commands array
for (folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		}
		else {
			console.log(`[WARNING] The command at ${filePath} does not have the required "data" and "execute" properties`);
		}
	}
}

// Construct and prepare an instance of the REST Module
const rest = new REST().setToken(process.env.BOT_TOKEN);
console.log(`Commands are ${commands}`);
// Deploy commands yahoo! yippee! hooray! wahoo!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {

		console.error(`Error ${error}`);
	}
})();