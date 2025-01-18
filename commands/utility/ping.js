// So, we need to use the SlashCommandBuilder class to define commands
// We'll define two things,
// data: this will be the definition of the command, built with SlashCommandBuilder
// execute: this will be a method defining what will happen when the command is executed

// Basically, this is just the definition and functionality of the command, don't overthink it
// Don't think about "how is this going to work", that'll be done in other files
// In this file, all you need to think about is what you want your command to do and define that
// That's the whole point of modularity, you only need to think about one thing at a time, simple

const { SlashCommandBuilder } = require('discord.js');

// example of data
const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with pong');

// example of execute function
async function execute(interaction) {
	// this will reply, not sure what 'interaction' is referring to. I'm guessing the actor of the interaction (the user in this case)
	await interaction.reply('Pong');
}

module.exports = { data, execute };