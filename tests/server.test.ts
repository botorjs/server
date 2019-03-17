
import { expect } from "chai";
import * as supertest from 'supertest';
import { EventBus } from "@botorjs/event-bus";
import { Boot, TypeContainer } from "@botorjs/boot";
import { Context } from "../src/Context";
import { Server } from "../src/Server";
import * as http from 'http';
import { BaseHandler, BaseHandlerTwo } from "./BaseHandlerServer";
import { BaseHandler as BaseHandlerT } from "./BaseHandlerTes";


const app = new Boot();
app.ioc.singleton(EventBus.name, EventBus);
app.ioc.bind("HttpContext", Context, TypeContainer.Contant);
var server: Server = null;

describe('Server test', function() {

    before(function () {
        server = new Server(app, {
            handlers: [BaseHandlerT, BaseHandlerTwo, BaseHandler],
            host: "localhost",
            port: 8080
        });
        server.register();
        server.listen(() => {
            console.log("start server");
        });
    })

    after(function(){
        server.close(() => {
            console.log("close server");
        })
        server = null;
    })

    it('call post 1', async () => {
        const { text } = await supertest(server.getServer()).post('/part_1');
        expect(text).be.eq('norton');
    });  

    it('call post 2', async () => {
        const res = await supertest(server.getServer()).post('/part_2');
        expect(res.text).be.eq('norton');
    });  

    it('call get 1',async () => {
        var res = await supertest(server.getServer()).get('/part_3');
        expect(res.text).be.eq('test_data');
        res = await supertest(server.getServer()).get('/test');
        expect(res.text).be.eq('test_data');
    });

    it('call get 2',async () => {
        var res = await supertest(server.getServer()).get('/test');
        expect(res.text).be.eq('test_data');
    });

});

describe('Server test', function() {

    before(function () {
        server = new Server(app, {
            handlers: [BaseHandlerT, BaseHandlerTwo, BaseHandler],
            host: "localhost",
            port: 8080
        });

    })


    it('set http Intan', async () => {
        const httpInt = http.createServer(server.handler.bind(server));
        server.setServer(httpInt);

        expect(server.getServer()).be.eql(httpInt);
    });  

});