import Debug from 'debug';
import * as http from 'http';
import { Boot } from '@botorjs/boot';
import { EventBus } from '@botorjs/event-bus';
import { ServerConfig } from './ServerConfig';
import { Context, ContextServer } from './Context';
import { HandlerServer } from './HanderServer';
import { IncomingMessage, ServerResponse } from 'http';

interface Constructable {
    new(req,res): Context;
}

const debug = Debug('server');

export class Server {
    private _app: Boot;
    private _bus: EventBus;
    private _config: ServerConfig;
    private _httpInstance: http.Server;
    private list_handler: Map<string, HandlerServer>;
    private list_queue: string[];

    constructor(app: Boot, config: ServerConfig) {
        this._app = app;
        this._config = config;
        this._bus = app.get<EventBus>(EventBus);
        this.list_handler = new Map();
        this.list_queue = [];
    }


    public register() {
        var list_event: HandlerServer[] = [];
        this._config.handlers.map((value, index) => {
            debug("register class name ",value.name)
            var name = this._getNameEvent(value.name, index);
            var obj: HandlerServer = this._app.resolve(value);
            obj.event_name = name;
            this.list_handler.set(name, obj);
            this._bus.on(name, obj.listen.bind(obj))
            list_event.push(obj);
        });
       
        list_event = list_event.sort((a,b) => a.prioritize - b.prioritize);
        for(var item of list_event) {
            this.list_queue.push(item.event_name);
        }
        debug("list queue hannler", this.list_queue);
    }

    public setServer(httpInstance: http.Server) {
        this._httpInstance = httpInstance;
    }

    public getServer(): http.Server {
        if( this._httpInstance == null) {
            debug("_httpInstance  is null, create httpInstance");
            this._httpInstance = http.createServer(this.handler.bind(this));
        }
        return this._httpInstance;
    }


    public listen(callBack = null) {
        this.getServer().listen(this._config.port, this._config.port, callBack);
    }


    public close(callBack = null) {
        this.getServer().close(callBack);
    }


    public handler(req: IncomingMessage, res: ServerResponse) {
        var context  = this._app.get("HttpContext") as Constructable
        var _context = new context(req, res);
        var contextServer = new ContextServer(_context, this.list_queue.slice(0));
        this._bus.emit(contextServer.next(), contextServer);
    }

    private _getNameEvent(clasName: string, index: number): string {
        if(!this.list_handler.has(`server_${clasName}`)) {
            return  `server_${clasName}`;
        }
        return `server_${clasName}_${index}`;
    }
}