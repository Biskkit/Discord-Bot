const { SlashCommandBuilder } = require('discord.js');


data = new SlashCommandBuilder()
	.setName('user')
	.setDescription('Provides info about the user');

async function execute(interaction) {
	// interaction.user is the object representing the User who RAN the command
	// interaction.member is the GuildMember object, which represents the user in the SPECIFIC GUILD (server)

	// Remember, server = guild

	// basically, the user could be in multiple servers and each server could also have the bot,
	// so interaction.user provides the general user, and interaction.member provides the user and server

	await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
}


module.exports = { data, execute };
