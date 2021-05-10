import { logger } from '../../utils/logger';
import { GifRace, GifRaceProps } from './GifRace';

logger.info("New GifRace worker");

process.addListener(
    'message',
    ({ id, type, data }: { id: string; type: 'start'; data: Omit<GifRaceProps, 'onResults'> }) => {
        switch (type) {
            case 'start': {
                return new GifRace({
                    ...data,
                    onResults: (users, path) =>
                        process.send && process.send({ id, type: 'results', data: { users, path } })
                });
            }
            default: {
                return;
            }
        }
    }
);
