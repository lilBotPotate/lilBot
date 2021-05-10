import { logger } from "../../../utils/logger";

export default function (client: any, error: any) {
    logger.error(`Steam client error: ${error}`)
}