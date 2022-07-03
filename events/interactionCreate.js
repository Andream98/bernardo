module.exports = {
	name: "interactionCreate",
	async execute(client, interaction, subscriptions) {
		if (!interaction.isCommand() || !interaction.guildId) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		let subscription = subscriptions.get(interaction.guildId);

		try {
			await command.execute(interaction, subscriptions, subscription);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "Scusami tandissimo...",
				ephemeral: true,
			});
		}
	},
};
