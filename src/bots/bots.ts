import { createDiscordClient } from './discord/botDiscord';
import { createSteamClient } from './steam/botSteam';
import { createTwitchClient } from './twitch/botTwitch';

export async function startBots(): Promise<any> {
    await createDiscordClient();
    // await createTwitchClient();
    // await createSteamClient();
}
