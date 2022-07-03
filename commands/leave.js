const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("Uccide Bernardo"),
	async execute(interaction, subscriptions, subscription) {		
		if (subscription) {
			subscription.voiceConnection.destroy();
			subscriptions.delete(interaction.guildId);
			await interaction.reply({ content: `Ciao...`, ephemeral: true });
		} else {
			await interaction.reply('Non sto facendo ascoltare musica qui');
		}
	},
};
