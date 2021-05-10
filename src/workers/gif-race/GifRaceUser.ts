import Canvas from 'canvas';
import { GifRace, GifRacePropsUser } from './GifRace';


export type GifRaceUserActions = 'fall' | 'boost' | 'slip' | 'double';

export type GifRaceUserOptions = {
    image: Canvas.Image;
};

export class GifRaceUser {
    readonly user: GifRacePropsUser;
    private userOptions: GifRaceUserOptions;
    private options: GifRace['options'];
    readonly position: { x: number; y: number };
    private velocity: { x: number; y: number };
    public done: boolean = false;
    public finish: null | {
        time: number;
        position: number;
    } = null;
    private actions: Array<{
        type: GifRaceUserActions;
        position: number;
    }> = [];

    constructor(user: GifRacePropsUser, image: Canvas.Image, options: GifRace['options'], py: number) {
        this.user = user;
        this.userOptions = {
            image: image,
        };
        this.options = options;
        this.position = { x: this.options.borderWidth / 2, y: py };
        this.velocity = { x: Math.random(), y: 0 };
    }

    public draw(canvas: Canvas.Canvas, ctx: Canvas.CanvasRenderingContext2D) {
        // Line background
        ctx.fillStyle = '#000000';
        ctx.fillRect(
            0,
            this.position.y - this.options.borderWidth / 2,
            this.position.x - this.options.borderWidth / 2,
            this.options.userSize + this.options.borderWidth
        );

        // Line
        ctx.fillStyle = '#222';
        ctx.fillRect(
            0,
            this.position.y + this.options.userSize / 3,
            canvas.width - this.options.userSize - this.options.borderWidth / 2,
            this.options.userSize / 3
        );

        this.drawActions(ctx);

        // Avatar background
        ctx.fillStyle = this.user.color;
        ctx.fillRect(this.position.x, this.position.y, this.options.userSize, this.options.userSize);

        // Avatar
        ctx.drawImage(
            this.userOptions.image,
            this.position.x,
            this.position.y,
            this.options.userSize,
            this.options.userSize
        );

        // Avatar border
        ctx.strokeStyle = this.user.color;
        ctx.lineWidth = this.options.borderWidth;
        ctx.strokeRect(this.position.x, this.position.y, this.options.userSize, this.options.userSize);

        // Finish frame
        ctx.lineWidth = this.options.borderWidth;
        ctx.strokeStyle = '#222';
        ctx.strokeRect(
            canvas.width - this.options.userSize - this.options.borderWidth / 2,
            this.position.y,
            this.options.userSize,
            this.options.userSize
        );
    }

    public drawDone(canvas: Canvas.Canvas, ctx: Canvas.CanvasRenderingContext2D, position: number) {
        const positionColor = this.getPositionColor(position);

        const gradient = ctx.createLinearGradient(
            0,
            this.position.y + this.options.userSize / 3,
            this.position.x,
            this.options.userSize / 3
        );

        const baseColor = '#ccc';
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(1, baseColor);
        const lineLength = this.position.x - this.options.borderWidth / 2;
        for (const action of this.actions) {
            const color = this.getActionColor(action.type);
            gradient.addColorStop(action.position / lineLength, color);
        }

        // Line
        ctx.fillStyle = gradient;
        ctx.fillRect(0, this.position.y + this.options.userSize / 3, lineLength, this.options.userSize / 3);

        this.drawActions(ctx);

        // Position background
        ctx.fillStyle = '#000000';
        ctx.fillRect(
            canvas.width - this.options.userSize - this.options.borderWidth / 2,
            this.position.y,
            this.options.userSize,
            this.options.userSize
        );

        // Position frame
        ctx.lineWidth = this.options.borderWidth;
        ctx.strokeStyle = positionColor || '#222';
        ctx.strokeRect(
            canvas.width - this.options.userSize - this.options.borderWidth / 2,
            this.position.y,
            this.options.userSize,
            this.options.userSize
        );

        // Position
        ctx.font = `bold ${this.options.userSize / 2}px Arial`;
        ctx.fillStyle = positionColor || '#fff';
        ctx.lineWidth = 1;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            `${position}`,
            canvas.width - this.options.userSize / 2 - this.options.borderWidth / 2,
            this.position.y + this.options.userSize / 2 + 1
        );
    }

    private getActionColor(type: GifRaceUserActions): string {
        return (
            {
                fall: '#cc0000',
                boost: '#32CD32',
                slip: '#ffa500',
                double: '#8A2BE2'
            }[type] || '#ddd'
        );
    }

    private getPositionColor(position: number): string | undefined {
        return {
            1: '#c9b037',
            2: '#b4b4b4',
            3: '#6a3805'
        }[position];
    }

    private drawActions(ctx: Canvas.CanvasRenderingContext2D) {
        this.actions.forEach((action) => {
            ctx.fillStyle = this.getActionColor(action.type);
            ctx.fillRect(
                action.position - 1,
                this.position.y + this.options.userSize / 4,
                3,
                this.options.userSize / 2
            );
        });
    }

    public move(canvas: Canvas.Canvas, iterations: number) {
        if (this.finish !== null) return;

        this.position.x += this.velocity.x;
        if (this.position.x > canvas.width - this.options.userSize * 2 - (this.options.borderWidth * 3) / 2) {
            this.finish = {
                time: iterations,
                position: this.position.x
            };
            this.position.x = canvas.width - this.options.userSize * 2 - (this.options.borderWidth * 3) / 2;
        } else {
            this.applyAction();
        }
    }

    private applyAction() {
        if (this.velocity.x <= this.options.maxVelocity) {
            this.velocity.x += Math.random() / 3;
        }

        const lastAction = this.actions.length > 0 && this.actions[this.actions.length - 1];

        if (!lastAction || this.position.x - lastAction.position > this.options.userSize) {
            if (Math.random() <= 0.01) {
                const random = Math.random();

                if (this.inRange(random, 0, 0.05)) return this.executeAction('double');
                if (this.inRange(random, 0.05, 0.2)) return this.executeAction('fall');
                if (this.inRange(random, 0.2, 0.6)) return this.executeAction('boost');
                if (this.inRange(random, 0.6, 1)) return this.executeAction('slip');
            }
        }
    }

    private executeAction(type: GifRaceUserActions) {
        switch (type) {
            case 'fall': {
                this.velocity.x = 0;
                return this.actions.push({ type, position: this.position.x });
            }
            case 'slip': {
                this.velocity.x *= 0.5;
                return this.actions.push({ type, position: this.position.x });
            }
            case 'boost': {
                if (this.velocity.x >= this.options.maxVelocity) {
                    this.velocity.x += this.options.maxVelocity / 3;
                } else {
                    this.velocity.x = this.options.maxVelocity;
                }

                return this.actions.push({ type, position: this.position.x });
            }
            case 'double': {
                this.velocity.x *= 1.5;

                return this.actions.push({ type, position: this.position.x });
            }
            default: {
                return;
            }
        }
    }

    private inRange(value: number, min: number, max: number) {
        return value >= min && value < max;
    }

    public setDone() {
        this.done = true;
    }
}
