"use strict";

const WebsocketBaseConnection = require ('./websocket_base_connection');
//const WebSocket = require('ws');
const WebSocket = require('isomorphic-ws');

const { sleep } = require ('../functions')

module.exports = class SocketIoLightConnection extends WebsocketBaseConnection {
    constructor (options, timeout) {
        super();
        this.options = options;
        this.timeout = timeout;
        this.client = {
            ws: null,
            isClosing: false,
            pingIntervalMs: 25000,
            pingTimeoutMs: 5000
        };
        this.pingInterval = null;
        this.pingTimeout = null;
    }
    createPingProcess (){
        var that = this;
        this.destroyPingProcess();
        this.pingInterval = setInterval(function(){
            if (that.client.isClosing) {
                that.destroyPingProcess();
            } else {
                that.cancelPingTimeout();
                that.client.ws.send('2');
                if (that.options['verbose']){
                    console.log("SocketioLightConnection: ping sent");
                }

                that.pingTimeout = setTimeout(function(){
                    that.emit('err', 'pong not received from server');
                    that.close();
                }, that.client.pingTimeoutMs);
            }
        }, this.client.pingIntervalMs);
    }

    destroyPingProcess() {
        if (this.pingInterval != null){
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
        this.cancelPingTimeout();
    }
    cancelPingTimeout() {
        if (this.pingTimeout != null){
            clearTimeout(this.pingTimeout);
            this.pingTimeout = null;
        }
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
                pingIntervalMs: 25000,
                pingTimeoutMs: 5000
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
            client.ws.onclose = function (){
            //client.ws.on('close', () => {
                if (!client.isClosing) {
                    that.emit('close');
                }
                that.close();
                reject('closing');
            //});
            };
            client.ws.onmessage = function (dat) {
                const data = dat.data;
            //client.ws.on('message', async (data) => {
                if (that.options['verbose']){
                    console.log("SocketioLightConnection: "+ data);
                }

                if (!client.isClosing) {
                    if (data[0] === '0') {
                        // initial message
                        const msg = JSON.parse(data.slice(1));
                        that.client.pingIntervalMs = msg.pingInterval;
                        that.client.pingTimeoutMs = msg.pingTimeout;
                        
                    } else if (data[0] == '3') {
                        that.cancelPingTimeout();
                        if (that.options['verbose']){
                            console.log("SocketioLightConnection: pong received");
                        }
                    } else if (data[0] == '4') {
                        if (data[1] == '2') {
                            that.emit('message', data.slice(2));
                        } else if (data[1] == '0'){
                            that.createPingProcess();
                            that.emit ('open');
                            resolve();
                        }
                    } else if (data[0] == '1'){
                        // disconnect
                        that.emit ('err', 'server sent disconnect message');
                        that.close();
                    } else {
                        console.log("unknown msg received from iosocket: ", data);
                    }
                }
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
            this.client.ws.send ('42'+data);
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