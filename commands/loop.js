const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Fa riascoltare la canzone in riproduzione"),
	async execute(interaction, subscriptions, subscription) {
		if (subscription) {
			try {
				subscription.toggleLoop();
				await interaction.reply({
					content: `Loop ${
						subscription.loop === true ? "attivato" : "disattivato"
					}`,
					ephemeral: true,
				});
			} catch (error) {
				console.warn(error);
				await interaction.reply(
					`Uffa, non sono riuscito a aggiungere in coda questa canzone`
				);
			}
		} else {
			await interaction.reply("Non sto facendo ascoltare musica qui");
		}
	},
};
