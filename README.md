# Server
[![Build Status](https://travis-ci.org/botorjs/server.svg?branch=master)](https://travis-ci.org/botorjs/server)
[![Coverage Status](https://coveralls.io/repos/github/botorjs/server/badge.svg?branch=master)](https://coveralls.io/github/botorjs/server?branch=master)

### Library that of Botorjs is server

# Installation
```
npm install @botorjs/server --save
```

# Setup and Example


```js


    import { EventBus } from "@botorjs/event-bus";
    import { Boot, TypeContainer } from "@botorjs/boot";
    import { Context, Server, HandlerServer } from "@botorjs/server";

    export class BaseHandler extends HandlerServer {

        public prioritize = 2;

        // @ts-ignore
        handler(context: Context, next: Function) {
            console.log("method request", context.req.method.toLowerCase());
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


    const app = new Boot();
    app.ioc.singleton(EventBus.name, EventBus);
    app.ioc.bind("HttpContext", Context, TypeContainer.Contant);
    var server: Server = new Server(app, {
        handlers: [BaseHandlerTwo, BaseHandler],
        host: "localhost",
        port: 8080
    });
    server.register();
    server.listen(() => {
        console.log("start server");
    });

```

# API

## Server

| Property   |      Description      |
|---------- |:-------------|
| register()  |  register handder | 
| listen(callback) |  listen server | 
| getServer() | get server | 
| setServer(httpInstance: http.Server) |  sersetInstance |
| close(callback)  | close server | 

## Context
* data connext of Server

| Property   |      Description      |
|---------- |:-------------|
| req: IncomingMessage  |  request | 
| res: ServerResponse |   response  | 
| isFinish() |   check finish request  | 

if need extends method of Context, i can use `getter`, with `Context` extends to [macroable](https://www.npmjs.com/package/macroable)


## HandlerServer
* handler Server

| Property   |      Description      |
|---------- |:-------------|
| event_name |  name event of handler | 
| prioritize |   prioritize of handler, server will sort with prioritize  | 
| handler |   funcion handle | 

## ServerConfig
* config Server

| Property   |      Description      |
|---------- |:-------------|
| host  |  host server | 
| port |   port server  | 
| handlers |   list handler is class extends to `HandlerServer` | 
