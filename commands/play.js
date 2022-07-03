import { GuildMember } from "discord.js";
import {
	entersState,
	joinVoiceChannel,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { MusicSubscription } from './music/subscription';
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Riproduce una canzone da un URL di YouTube")
		.addUserOption((option) =>
			option.setName("URL").setDescription("L'URL di YouTube").setRequired(true)
		),
	async execute(interaction) {
		await interaction.defer();
		const URL = interaction.options.get("URL")?.value;

		const subscriptions = new Map();

		let subscription = subscriptions.get(interaction.guildId);

		if (!subscription) {
			if (
				interaction.member instanceof GuildMember &&
				interaction.member.voice.channel
			) {
				const channel = interaction.member.voice.channel;
				subscription = new MusicSubscription(
					joinVoiceChannel({
						channelId: channel.id,
						guildId: channel.guild.id,
						adapterCreator: channel.guild.voiceAdapterCreator,
					})
				);
				subscription.voiceConnection.on("error", console.warn);
				subscriptions.set(interaction.guildId, subscription);
			}
		}

		// If there is no subscription, tell the user they need to join a channel.
		if (!subscription) {
			await interaction.followUp(
				"Join a voice channel and then try that again!"
			);
			return;
		}

		// Make sure the connection is ready before processing the user's request
		try {
			await entersState(
				subscription.voiceConnection,
				VoiceConnectionStatus.Ready,
				20e3
			);
		} catch (error) {
			console.warn(error);
			await interaction.followUp(
				"Failed to join voice channel within 20 seconds, please try again later!"
			);
			return;
		}

		try {
			// Attempt to create a Track from the user's video URL
			const track = await Track.from(URL, {
				onStart() {
					interaction
						.followUp({ content: "Now playing!", ephemeral: true })
						.catch(console.warn);
				},
				onFinish() {
					interaction
						.followUp({ content: "Now finished!", ephemeral: true })
						.catch(console.warn);
				},
				onError(error) {
					console.warn(error);
					interaction
						.followUp({ content: `Error: ${error.message}`, ephemeral: true })
						.catch(console.warn);
				},
			});
			// Enqueue the track and reply a success message to the user
			subscription.enqueue(track);
			await interaction.followUp(`Enqueued **${track.title}**`);
		} catch (error) {
			console.warn(error);
			await interaction.followUp(
				"Failed to play track, please try again later!"
			);
		}
	},
};
