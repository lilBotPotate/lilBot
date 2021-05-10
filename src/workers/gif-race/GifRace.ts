import Discord from 'discord.js';
import GIFEncoder from 'gifencoder';
import Canvas from 'canvas';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { GifRaceUser } from './GifRaceUser';
import { logger } from '../../utils/logger';

export type GifRaceProps = {
    users: GifRacePropsUser[];
    options?: GifRaceOptions;
    onResults: (users: GifRaceUser[], path?: string | Buffer) => any;
};

export type GifRacePropsUser = {
    id: string;
    avatarUrl: string;
    color: string;
}

export type GifRaceOptions = {
    lms?: boolean;
    width?: number;
    userSize?: Discord.ImageSize;
    dividerSize?: number;
    borderWidth?: number;
    maxVelocity?: number;
    maxIterations?: number;
};

export class GifRace {
    private encoder?: GIFEncoder;
    private canvas?: Canvas.Canvas;
    private ctx?: Canvas.CanvasRenderingContext2D;
    private users: GifRaceUser[] = [];
    private writeStream?: fs.WriteStream;
    private dimensions: {
        width: number;
        height: number;
    };
    private options: Required<GifRaceOptions>;
    private onResults: GifRaceProps['onResults'];

    constructor({ users, options, onResults }: GifRaceProps) {
        this.options = {
            lms: !!options?.lms,
            width: options?.width || 17,
            userSize: options?.userSize || 32,
            dividerSize: options?.dividerSize || 8,
            borderWidth: options?.borderWidth || 4,
            maxVelocity: options?.maxVelocity || 4,
            maxIterations: options?.maxIterations || 500
        };

        this.dimensions = {
            width: this.options.userSize * this.options.width,
            height:
                this.options.userSize * users.length +
                this.options.dividerSize * (users.length - 1) +
                (this.options.borderWidth / 2) * (users.length * 2 - 3)
        };

        this.onResults = onResults;

        this.init.bind(this)(users);
    }

    private async init(users: GifRaceProps['users']) {
        const [encoder, writeStream] = this.initEncoder();
        this.encoder = encoder;
        this.writeStream = writeStream;

        this.writeStream.on('close', this.onClose.bind(this));

        const [canvas, ctx] = this.initCanvas();
        this.canvas = canvas;
        this.ctx = ctx;

        this.users = await this.createUsers.bind(this)(users);

        return this.start();
    }

    private initEncoder(): [encoder: GIFEncoder, writeStream: fs.WriteStream] {
        const encoder = new GIFEncoder(this.dimensions.width, this.dimensions.height);
        const writeStream = fs.createWriteStream(`./tmp/gifrace-${uuidv4()}.gif`);

        encoder.createReadStream().pipe(writeStream);
        encoder.start();
        encoder.setRepeat(-1);
        encoder.setDelay(20);
        encoder.setQuality(10);

        return [encoder, writeStream];
    }

    private initCanvas(): [canvas: Canvas.Canvas, ctx: Canvas.CanvasRenderingContext2D] {
        const canvas = Canvas.createCanvas(this.dimensions.width, this.dimensions.height);
        const ctx = canvas.getContext('2d');

        return [canvas, ctx];
    }

    private async createUsers(users: GifRaceProps['users']): Promise<GifRaceUser[]> {
        return Promise.all(
            users.map(async (user, i) => {
                const image = await Canvas.loadImage(user.avatarUrl);

                return new GifRaceUser(
                    user,
                    image,
                    this.options,
                    i * (this.options.userSize + this.options.dividerSize + this.options.borderWidth / 2) +
                        this.options.borderWidth / 2
                );
            })
        );
    }

    private start() {
        if (!this.ctx || !this.canvas || !this.encoder) return;

        let maxIterations = 0;
        let sortedUsers: GifRaceUser[] = [];

        for (let iterations = 0; iterations < this.options.maxIterations; iterations++) {
            let doneUsers: GifRaceUser[] = [];

            for (const user of this.users) {
                if (user.done) continue;
                user.draw(this.canvas, this.ctx);

                if (user.finish !== null) {
                    if (!maxIterations) maxIterations = (iterations * 3) / 2;
                    user.setDone();
                    doneUsers.push(user);
                }

                user.move(this.canvas, iterations);
            }

            doneUsers = doneUsers.sort((a, b) => {
                if (!a.finish || !b.finish) return 0;
                if (a.finish.position < b.finish.position) return 1;
                if (a.finish.position > b.finish.position) return -1;
                return 0;
            });

            for (let i = 0; i < doneUsers.length; i++) {
                const user = doneUsers[i];
                user.drawDone(this.canvas, this.ctx, sortedUsers.length + i + 1);
            }

            sortedUsers.push(...doneUsers);

            this.encoder.addFrame(this.ctx);

            if (sortedUsers.length >= this.users.length || (maxIterations && iterations >= maxIterations)) {
                logger.debug(`GifRace ${iterations} iterations`);
                break;
            }
        }

        const notDoneUsers = this.users
            .filter((user) => !user.done)
            .sort((a, b) => {
                if (a.position.x < b.position.x) return 1;
                if (a.position.x > b.position.x) return -1;
                return 0;
            });

        this.users = [...sortedUsers, ...notDoneUsers];

        return this.encoder.finish();
    }

    private onClose() {
        this.onResults(this.users, this.writeStream?.path);
    }
}
