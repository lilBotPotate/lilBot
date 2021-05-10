import SteamUser from 'steam-user';
import { logger } from '../../../utils/logger';

export default function (client: any, details: any) {
    logger.info('Logged into Steam as ' + client.steamID.getSteamID64());

    return client.setPersona(SteamUser.EPersonaState.Online);
}
