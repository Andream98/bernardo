const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription("Riprende l'ascolto quando lo stato è in pausa"),
	async execute(interaction, subscriptions, subscription) {		
		if (subscription) {
			subscription.audioPlayer.unpause();
			await interaction.reply({ content: `Vuole sentire?`, ephemeral: true });
		} else {
			await interaction.reply('Non sto facendo ascoltare musica qui');
		}
	},
};
