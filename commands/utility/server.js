const { SlashCommandBuilder } = require('discord.js');

data = new SlashCommandBuilder()
	.setName('server')
	.setDescription('Provides info about the server');

async function execute(interaction) {
	// interaction.guild is the object representing the Guild in which the COMMAND is run
	await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
}

module.exports = { data, execute };