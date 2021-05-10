import SteamUser from 'steam-user';
import SteamID from 'steamid';
import { executeSteamCommand, isSteamCommand } from '../../../handlers/command/SteamCommandHandlers';

export type SteamChatMessage = {
    chat_group_id: string;
    chat_id: string;
    steamid_sender: SteamID;
    message: string;
    mentions: any;
    ordinal: number;
    server_message: any;
    message_no_bbcode: string;
    chat_name: string;
    server_timestamp: any;
    message_bbcode_parsed: string[];
};

export default function (client: any, msg: SteamChatMessage) {
    if (client.steamID.accountid === msg.steamid_sender.accountid) return;
    if (isSteamCommand(msg.message)) return executeSteamCommand(client, msg);
}
