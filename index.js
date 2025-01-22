// Node.js classes used

// Stands for 'file system'
const fs = require('node:fs');
// Used to join file paths
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');
const dotenv = require('dotenv');

// loads the values in the .env file into process.env
dotenv.config();

// Create a new client instance, this is the main object that refers to the Discord bot
// and will be used to interact with the Discord API
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Add a commands property which will be a collection to store the defined commands in
client.commands = new Collection();

// This code will dynamically add all the command files to the collection

const foldersPath = path.join(__dirname, 'commands');
// This variable will store all the files in the commands folder in an array
const commandFolders = fs.readdirSync(foldersPath);

// iterate through each folder, taking only '.js' files in each folder
for (folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		// Now you can finally import/require the command
		const command = require(filePath);

		// Add the command to the commands collection property
		// Key = command name
		// Value = actual exported command module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} does not have the required "data" and "execute" properties`);
		}
	}
}

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);

// Will listen for any interactions the application receives and will execute the code provided
client.on(Events.InteractionCreate, async interaction => {
	// Slash input commands are considered ChatInputCommands
	if (!interaction.isChatInputCommand) return;

	// Grab the command with the matching command name from the client.commands collection
	// In interactions, client should be accessed via interaction.client so that it's in that specific context
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found`);
		return;
	}
	// Execute command (remember execute is async, and the interaction object must be passed in)
	try {
		await command.execute(interaction);
	}
	catch (err) {
		// console.log(err.message);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: err.message, flags: MessageFlags.Ephemeral });
			// interaction.followUp(err.message);
		}
		else {
			// interaction.reply(err.message);
			await interaction.reply({ content: err.message, flags: MessageFlags.Ephemeral });
		}
	}
});