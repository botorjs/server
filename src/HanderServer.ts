import Debug from 'debug';
import { ContextServer, Context } from "./Context";
import { EventBus } from "@botorjs/event-bus";
import { Injectable } from "@botorjs/boot";

const debug = Debug('server:hander');

@Injectable()
export class HandlerServer {
    public event_name: string;
    public prioritize: number;

    constructor(private bus: EventBus) {}

    // @ts-ignore
    protected handler(context: Context, next: Function) {

    }

    public listen(context: ContextServer) {
        debug("listen event", this.event_name);
        this.handler(context.context, () => {
            if(context.context.isFinish()) {
                debug("request finish with have response end");
                return;
            }
            var event_next = context.next();
            if(event_next == null) {
                debug("request finish with emtyp queue event");
                if(!context.context.isFinish()) {
                    context.context.res.end();
                }
                return;
            }
            debug("call with event ", event_next);
            this.bus.emit(event_next, context);

        })
    }
}