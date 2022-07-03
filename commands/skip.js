const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Salta la canzone in riproduzione e passa alla prossima canzone in coda"),
	async execute(interaction, subscriptions, subscription) {		
		if (subscription) {
			let currentSong = subscription.audioPlayer.state.resource.metadata.title;
			// Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
			// listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
			// will be loaded and played.
			subscription.audioPlayer.stop();
			await interaction.reply(`**${interaction.user.username}** ha saltato: \n > ${currentSong}`);
		} else {
			await interaction.reply('Ma si scem, non c\'è nulla in riproduzione');
		}
	},
};
