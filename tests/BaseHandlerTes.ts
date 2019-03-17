import { HandlerServer } from '../src/HanderServer';
import { Context } from '../src/Context';


export class BaseHandler extends HandlerServer {

    public prioritize = 1;


     // @ts-ignore
    handler(context: Context, next: Function) {
        console.log("request with url", context.req.url);
        next();
    }
}