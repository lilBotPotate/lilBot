import path from 'path';
import { fork, ChildProcess } from 'child_process';

type WorkerTypes = 'gif-race';
type WorkerPaths = {
    [key in WorkerTypes]: {
        folder: string;
        file: string;
    };
};

const workerPaths: WorkerPaths = {
    'gif-race': {
        folder: 'gif-race',
        file: 'workerGifRace'
    }
};

export function getWorkersPath(type: WorkerTypes): string {
    const workerPath = workerPaths[type];
    return path.join(__dirname, `../workers/${workerPath.folder}/${workerPath.file}`);
}

export function forkWorker(type: WorkerTypes): ChildProcess {
    return fork(getWorkersPath(type), { detached: true });
}
