const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Elenca la coda di riproduzione"),
	async execute(interaction, subscriptions, subscription) {		
		// Print out the current queue, including up to the next 5 tracks to be played.
		if (subscription) {
			const current =
				subscription.audioPlayer.state.status === AudioPlayerStatus.Idle
					? `Non c'è nulla in riproduzione`
					: `Ascoltando **${(subscription.audioPlayer.state.resource).metadata.title}**`;

			const queue = subscription.queue
				.slice(0, 5)
				.map((track, index) => `${index + 1}) ${track.title}`)
				.join('\n');

			await interaction.reply(`${current}\n\n${queue}`);
		} else {
			await interaction.reply('Non sto facendo ascoltare musica qui');
		}
	},
};
