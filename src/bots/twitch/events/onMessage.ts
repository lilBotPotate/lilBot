import tmi from 'tmi.js';
import { executeTwitchCommand, isTwitchCommand } from '../../../handlers/command/TwitchCommandHandlers';

export default function (
    this: tmi.Client,
    channel: string,
    tags: tmi.ChatUserstate,
    message: string,
    self: boolean
) {
    if (self) return;
    if (isTwitchCommand(message)) return executeTwitchCommand(this, channel, tags, message);
}
