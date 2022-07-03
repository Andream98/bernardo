const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Mette in pausa"),
	async execute(interaction, subscriptions, subscription) {		
		if (subscription) {
			subscription.audioPlayer.pause();
			await interaction.reply({ content: `In pausa`, ephemeral: true });
		} else {
			await interaction.reply('Non sto facendo ascoltare musica qui');
		}
	},
};
