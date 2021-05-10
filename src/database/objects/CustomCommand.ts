export type CustomCommand = {
    _id: any;
    output: string;
};

export class CustomCommandObject {
    private _id: string;
    private output: string;

    constructor(_id: string, output: string) {
        this._id = _id;
        this.output = output;
    }

    public toJson(): CustomCommand {
        return {
            _id: this._id,
            output: this.output
        };
    }
}
