import { SteamChatMessage } from '../bots/steam/events/onChatMessage';

export function steamMSGR(chat: any, msg: SteamChatMessage, message: string) {
    return chat.sendChatMessage(
        msg.chat_group_id,
        msg.chat_id,
        `[mention="${msg.steamid_sender.accountid}"][/mention] ${message}`
    );
}
