export type User = {
    _id: any;
    points: number;
    time_created: number;
    birthday: null | {
        day: number;
        month: number;
        year: number | null;
    };
    platforms: {
        twitch: {
            username: string;
            id: string;
        } | null;
        steam: {
            id: string;
        } | null;
    };
};

export class UserObject {
    private _id: string;

    constructor(_id: string) {
        this._id = _id;
    }

    public toJson(): User {
        return {
            _id: this._id,
            time_created: Date.now(),
            points: 1000,
            birthday: null,
            platforms: {
                twitch: null,
                steam: null
            }
        };
    }
}
