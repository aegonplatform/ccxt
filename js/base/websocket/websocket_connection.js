"use strict";

const WebsocketBaseConnection = require ('./websocket_base_connection');
//const WebSocket = require('ws');
//import WebSocket from 'isomorphic-ws';
const WebSocket = require('isomorphic-ws');

const { sleep } = require ('../functions')

module.exports = class WebsocketConnection extends WebsocketBaseConnection {
    constructor (options, timeout) {
        super();
        this.options = options;
        this.timeout = timeout;
        this.client = {
            ws: null,
            isClosing: false,
        };
    }

    connect() {
        return new Promise ((resolve, reject) => {
            if ((this.client.ws != null) && (this.client.ws.readyState === this.client.ws.OPEN)) {
                resolve();
                return;
            }
            const client = {
                ws: null,
                isClosing: false,
            };
            if (this.options.agent) {
                client.ws = new WebSocket(this.options.url, { agent: this.options.agent });
            } else {
                client.ws = new WebSocket(this.options.url);
            }
            const that = this;
            client.ws.onopen = async function (){
            //client.ws.on('open', async () => {
                if (that.options['wait-after-connect']) {
                    await sleep(that.options['wait-after-connect']);
                }
                that.emit ('open');
                resolve();
            //});
            };
            client.ws.onerror = function (error) {
            //client.ws.on('error', (error) => {
                if (!client.isClosing) {
                    that.emit('err', error);
                }
                reject(error);
            //});
            };
            if (typeof window === 'undefined') {
                client.ws.on('pong', (data) => {
                    if (!client.isClosing) {
                        that.emit('pong', data);
                    }
                    resolve();
                });
            }
            client.ws.onclose = function (){
            //client.ws.on('close', () => {
                if (!client.isClosing) {
                    that.emit('close');
                }
                reject('closing');
            //});
            };
            client.ws.onmessage = async function (data){
            //client.ws.on('message', async (data) => {
                if (that.options['verbose']){
                    console.log("WebsocketConnection: "+data.data);
                }

                if (!client.isClosing) {
                    that.emit('message', data.data);
                }
                resolve();
            //});
            };
            this.client = client;
        });
    }

    close () {
        if (this.client.ws != null) {
            this.client.isClosing = true;
            this.client.ws.close();
            this.client.ws = null;
        }
    }

    send (data) {
        if (!this.client.isClosing) {
            this.client.ws.send (data);
        }
    }

    sendPing(data) {
        if (!this.client.isClosing) {
            if (typeof window === 'undefined') {
                this.client.ws.ping (data);
            } else {
                this.emit('pong', data);
            }
        }
    }

    isActive() {
        if (this.client.ws == null){
            return false;
        }
        return (this.client.ws.readyState == this.client.ws.OPEN) || 
            (this.client.ws.readyState == this.client.ws.CONNECTING);
    }
};