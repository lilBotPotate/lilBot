export type Request = {
    _id: any;
    type: 'twitch_bind' | 'steam_bind';
    user_id: string;
    account_id: string;
    time_created: number;
};

export class RequestObject {
    private type: Request['type'];
    private user_id: Request['user_id'];
    private account_id: Request['account_id'];
    private time_created: Request['time_created'] = Date.now();

    constructor(type: Request['type'], user_id: Request['user_id'], account_id: Request['account_id']) {
        this.type = type;
        this.user_id = user_id;
        this.account_id = account_id;
    }

    public toJson(): Omit<Request, '_id'> {
        return {
            type: this.type,
            user_id: this.user_id,
            account_id: this.account_id,
            time_created: this.time_created
        };
    }
}
