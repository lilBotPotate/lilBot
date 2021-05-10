import schedule from 'node-schedule';
import { logger } from '../utils/logger';
import { midnightSchedule } from './midnightSchedule';

export function createSchedules() {
    logger.info('Created midnight schedule');
    schedule.scheduleJob('0 0 * * *', midnightSchedule);
}
