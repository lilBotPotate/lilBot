import tmi from 'tmi.js';

export function twitchMSGR(client: tmi.Client, channel: string, tags: tmi.ChatUserstate, message: string) {
    return client.say(channel, `@${tags.username} ${message}`);
}
