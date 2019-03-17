import { ServerResponse, IncomingMessage } from 'http';
import { Macroable } from 'macroable';

export class Context extends Macroable {

    constructor(public req: IncomingMessage,public res: ServerResponse) {
        super();
    }

    public isFinish(): boolean {
        return this.res.finished;
    }
}

export class ContextServer {
    public context: Context;
    public queue_event: string[];

    constructor(context: Context, queue_event) {
        this.context = context;
        this.queue_event = queue_event;
    }

    public next(): string|null {
        if(this.queue_event.length < 1) {
            return null;
        }
        return this.queue_event.shift();
    }
}