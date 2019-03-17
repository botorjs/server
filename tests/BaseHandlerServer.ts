import { HandlerServer } from '../src/HanderServer';
import { Context } from '../src/Context';

export class BaseHandler extends HandlerServer {

    public prioritize = 2;

    // @ts-ignore
    handler(context: Context, next: Function) {
        console.log("methoad request", context.req.method.toLowerCase());
        if(context.req.method.toLowerCase() == 'post') {
            context.res.write("norton");
            console.log("result norton", context.req.url, context.req.method);
            context.res.end();
        }
        next();
    }
}

export class BaseHandlerTwo extends HandlerServer {

    public prioritize = 3;
    
    public handler(context: Context, next: Function) {
        context.res.write("test_data");
        console.log("result test_data", context.req.url, context.req.method);
        next();
    }
}

                
