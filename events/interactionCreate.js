module.exports = {
	name: "interactionCreate",
	async execute(client, interaction) {
		if (!interaction.isCommand() || !interaction.guildId) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction, subscriptions, subscription);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	},
};
