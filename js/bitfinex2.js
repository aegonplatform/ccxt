'use strict';

// ---------------------------------------------------------------------------

const bitfinex = require('./bitfinex.js');
const { ExchangeError, NotSupported, InsufficientFunds } = require('./base/errors');

// ---------------------------------------------------------------------------

module.exports = class bitfinex2 extends bitfinex {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bitfinex2',
            'name': 'Bitfinex',
            'countries': ['VG'],
            'version': 'v2',
            'certified': false,
            // new metainfo interface
            'has': {
                'CORS': true,
                'createLimitOrder': false,
                'createMarketOrder': false,
                'createOrder': false,
                'deposit': false,
                'editOrder': false,
                'fetchDepositAddress': false,
                'fetchClosedOrders': false,
                'fetchFundingFees': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenOrders': false,
                'fetchOrder': true,
                'fetchTickers': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'withdraw': true,
            },
            'timeframes': {
                '1m': '1m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '3h': '3h',
                '6h': '6h',
                '12h': '12h',
                '1d': '1D',
                '1w': '7D',
                '2w': '14D',
                '1M': '1M',
            },
            'rateLimit': 1500,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766244-e328a50c-5ed2-11e7-947b-041416579bb3.jpg',
                'api': {
                    'v1': 'https://api.bitfinex.com',
                    'public': 'https://api-pub.bitfinex.com',
                    'private': 'https://api.bitfinex.com',
                },
                'www': 'https://www.bitfinex.com',
                'doc': [
                    'https://docs.bitfinex.com/v2/docs/',
                    'https://github.com/bitfinexcom/bitfinex-api-node',
                ],
                'fees': 'https://www.bitfinex.com/fees',
            },
            'api': {
                'v1': {
                    'get': [
                        'symbols',
                        'symbols_details',
                    ],
                },
                'public': {
                    'get': [
                        'conf/pub:map:currency:label',
                        'platform/status',
                        'tickers',
                        'ticker/{symbol}',
                        'trades/{symbol}/hist',
                        'book/{symbol}/{precision}',
                        'book/{symbol}/P0',
                        'book/{symbol}/P1',
                        'book/{symbol}/P2',
                        'book/{symbol}/P3',
                        'book/{symbol}/R0',
                        'stats1/{key}:{size}:{symbol}:{side}/{section}',
                        'stats1/{key}:{size}:{symbol}/{section}',
                        'stats1/{key}:{size}:{symbol}:long/last',
                        'stats1/{key}:{size}:{symbol}:long/hist',
                        'stats1/{key}:{size}:{symbol}:short/last',
                        'stats1/{key}:{size}:{symbol}:short/hist',
                        'candles/trade:{timeframe}:{symbol}/{section}',
                        'candles/trade:{timeframe}:{symbol}/last',
                        'candles/trade:{timeframe}:{symbol}/hist',
                    ],
                    'post': [
                        'calc/trade/avg',
                        'calc/fx',
                    ],
                },
                'private': {
                    'post': [
                        'auth/r/wallets',
                        'auth/r/orders/{symbol}',
                        'auth/r/orders/{symbol}/new',
                        'auth/r/orders/{symbol}/hist',
                        'auth/r/order/{symbol}:{id}/trades',
                        'auth/w/order/submit',
                        'auth/r/trades/hist',
                        'auth/r/trades/{symbol}/hist',
                        'auth/r/positions',
                        'auth/r/positions/hist',
                        'auth/r/positions/audit',
                        'auth/r/funding/offers/{symbol}',
                        'auth/r/funding/offers/{symbol}/hist',
                        'auth/r/funding/loans/{symbol}',
                        'auth/r/funding/loans/{symbol}/hist',
                        'auth/r/funding/credits/{symbol}',
                        'auth/r/funding/credits/{symbol}/hist',
                        'auth/r/funding/trades/{symbol}/hist',
                        'auth/r/info/margin/{key}',
                        'auth/r/info/funding/{key}',
                        'auth/r/ledgers/hist',
                        'auth/r/movements/hist',
                        'auth/r/movements/{currency}/hist',
                        'auth/r/stats/perf:{timeframe}/hist',
                        'auth/r/alerts',
                        'auth/w/alert/set',
                        'auth/w/alert/{type}:{symbol}:{price}/del',
                        'auth/calc/order/avail',
                        'auth/r/ledgers/{symbol}/hist',
                        'auth/r/settings',
                        'auth/w/settings/set',
                        'auth/w/settings/del',
                        'auth/r/info/user',
                    ],
                },
            },
            'fees': {
                'trading': {
                    'maker': 0.1 / 100,
                    'taker': 0.2 / 100,
                },
                'funding': {
                    'withdraw': {
                        'BTC': 0.0004,
                        'BCH': 0.0001,
                        'ETH': 0.00135,
                        'EOS': 0.0,
                        'LTC': 0.001,
                        'OMG': 0.15097,
                        'IOT': 0.0,
                        'NEO': 0.0,
                        'ETC': 0.01,
                        'XRP': 0.02,
                        'ETP': 0.01,
                        'ZEC': 0.001,
                        'BTG': 0.0,
                        'DASH': 0.01,
                        'XMR': 0.0001,
                        'QTM': 0.01,
                        'EDO': 0.23687,
                        'DAT': 9.8858,
                        'AVT': 1.1251,
                        'SAN': 0.35977,
                        'USDT': 5.0,
                        'SPK': 16.971,
                        'BAT': 1.1209,
                        'GNT': 2.8789,
                        'SNT': 9.0848,
                        'QASH': 1.726,
                        'YYW': 7.9464,
                    },
                },
            },
            'wsconf': {
                'conx-tpls': {
                    'default': {
                        'type': 'ws',
                        'baseurl': 'wss://api.bitfinex.com/ws/2',
                        'wait4readyEvent': 'statusok',
                    },
                },
                'methodmap': {
                    '_websocketTimeoutRemoveNonce': '_websocketTimeoutRemoveNonce',
                },
                'events': {
                    'ob': {
                        'conx-tpl': 'default',
                        'conx-param': {
                            'url': '{baseurl}',
                            'id': '{id}',
                        },
                    },
                    'trade': {
                        'conx-tpl': 'default',
                        'conx-param': {
                            'url': '{baseurl}',
                            'id': '{id}',
                        },
                    },
                },
            },
            'options': {
                'precision': 'R0', // P0, P1, P2, P3, P4, R0
                'orderTypes': {
                    'MARKET': undefined,
                    'EXCHANGE MARKET': 'market',
                    'LIMIT': undefined,
                    'EXCHANGE LIMIT': 'limit',
                    'STOP': undefined,
                    'EXCHANGE STOP': 'stopOrLoss',
                    'TRAILING STOP': undefined,
                    'EXCHANGE TRAILING STOP': undefined,
                    'FOK': undefined,
                    'EXCHANGE FOK': 'limit FOK',
                    'STOP LIMIT': undefined,
                    'EXCHANGE STOP LIMIT': 'limit stop',
                    'IOC': undefined,
                    'EXCHANGE IOC': 'limit ioc',
                },
                'fiat': {
                    'USD': 'USD',
                    'EUR': 'EUR',
                    'JPY': 'JPY',
                    'GBP': 'GBP',
                },
            },
        });
    }

    isFiat(code) {
        return (code in this.options['fiat']);
    }

    getCurrencyId(code) {
        return 'f' + code;
    }

    async fetchMarkets(params = {}) {
        const response = await this.v1GetSymbolsDetails(params);
        const result = [];
        for (let i = 0; i < response.length; i++) {
            const market = response[i];
            let id = this.safeString(market, 'pair');
            id = id.toUpperCase();
            let baseId = undefined;
            let quoteId = undefined;
            if (id.indexOf(':') >= 0) {
                const parts = id.split(':');
                baseId = parts[0];
                quoteId = parts[1];
            } else {
                baseId = id.slice(0, 3);
                quoteId = id.slice(3, 6);
            }
            const base = this.safeCurrencyCode(baseId);
            const quote = this.safeCurrencyCode(quoteId);
            const symbol = base + '/' + quote;
            id = 't' + id;
            baseId = this.getCurrencyId(baseId);
            quoteId = this.getCurrencyId(quoteId);
            const precision = {
                'price': this.safeInteger(market, 'price_precision'),
                'amount': this.safeInteger(market, 'price_precision'),
            };
            const limits = {
                'amount': {
                    'min': this.safeFloat(market, 'minimum_order_size'),
                    'max': this.safeFloat(market, 'maximum_order_size'),
                },
                'price': {
                    'min': Math.pow(10, -precision['price']),
                    'max': Math.pow(10, precision['price']),
                },
            };
            limits['cost'] = {
                'min': limits['amount']['min'] * limits['price']['min'],
                'max': undefined,
            };
            result.push({
                'id': id,
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'baseId': baseId,
                'quoteId': quoteId,
                'active': true,
                'precision': precision,
                'limits': limits,
                'info': market,
                'swap': false,
                'spot': false,
                'futures': false,
            });
        }
        return result;
    }

    async fetchBalance(params = {}) {
        // this api call does not return the 'used' amount - use the v1 version instead (which also returns zero balances)
        await this.loadMarkets();
        const response = await this.privatePostAuthRWallets(params);
        const balanceType = this.safeString(params, 'type', 'exchange');
        const result = { 'info': response };
        for (let b = 0; b < response.length; b++) {
            const balance = response[b];
            const accountType = balance[0];
            let currency = balance[1];
            const total = balance[2];
            const available = balance[4];
            if (accountType === balanceType) {
                if (currency[0] === 't') {
                    currency = currency.slice(1);
                }
                const code = this.safeCurrencyCode(currency);
                const account = this.account();
                // do not fill in zeroes and missing values in the parser
                // rewrite and unify the following to use the unified parseBalance
                account['total'] = total;
                if (!available) {
                    if (available === 0) {
                        account['free'] = 0;
                        account['used'] = total;
                    } else {
                        account['free'] = total;
                    }
                } else {
                    account['free'] = available;
                    account['used'] = account['total'] - account['free'];
                }
                result[code] = account;
            }
        }
        return this.parseBalance(result);
    }

    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        await this.loadMarkets();
        const precision = this.safeValue(this.options, 'precision', 'R0');
        const request = {
            'symbol': this.marketId(symbol),
            'precision': precision,
        };
        if (limit !== undefined) {
            request['len'] = limit; // 25 or 100
        }
        const fullRequest = this.extend(request, params);
        const orderbook = await this.publicGetBookSymbolPrecision(fullRequest);
        const timestamp = this.milliseconds();
        const result = {
            'bids': [],
            'asks': [],
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'nonce': undefined,
        };
        const priceIndex = (fullRequest['precision'] === 'R0') ? 1 : 0;
        for (let i = 0; i < orderbook.length; i++) {
            const order = orderbook[i];
            const price = order[priceIndex];
            const amount = Math.abs(order[2]);
            const side = (order[2] > 0) ? 'bids' : 'asks';
            result[side].push([price, amount]);
        }
        result['bids'] = this.sortBy(result['bids'], 0, true);
        result['asks'] = this.sortBy(result['asks'], 0);
        return result;
    }

    parseTicker(ticker, market = undefined) {
        const timestamp = this.milliseconds();
        let symbol = undefined;
        if (market !== undefined) {
            symbol = market['symbol'];
        }
        const length = ticker.length;
        const last = ticker[length - 4];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': ticker[length - 2],
            'low': ticker[length - 1],
            'bid': ticker[length - 10],
            'bidVolume': undefined,
            'ask': ticker[length - 8],
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': ticker[length - 6],
            'percentage': ticker[length - 5] * 100,
            'average': undefined,
            'baseVolume': ticker[length - 3],
            'quoteVolume': undefined,
            'info': ticker,
        };
    }

    async fetchTickers(symbols = undefined, params = {}) {
        await this.loadMarkets();
        const request = {};
        if (symbols !== undefined) {
            const ids = this.marketIds(symbols);
            request['symbols'] = ids.join(',');
        } else {
            request['symbols'] = 'ALL';
        }
        const tickers = await this.publicGetTickers(this.extend(request, params));
        const result = {};
        for (let i = 0; i < tickers.length; i++) {
            const ticker = tickers[i];
            const id = ticker[0];
            if (id in this.markets_by_id) {
                const market = this.markets_by_id[id];
                const symbol = market['symbol'];
                result[symbol] = this.parseTicker(ticker, market);
            }
        }
        return result;
    }

    async fetchTicker(symbol, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const ticker = await this.publicGetTickerSymbol(this.extend(request, params));
        return this.parseTicker(ticker, market);
    }

    parseTrade(trade, market = undefined) {
        //
        // fetchTrades (public)
        //
        //     [
        //         ID,
        //         MTS, // timestamp
        //         AMOUNT,
        //         PRICE
        //     ]
        //
        // fetchMyTrades (private)
        //
        //     [
        //         ID,
        //         PAIR,
        //         MTS_CREATE,
        //         ORDER_ID,
        //         EXEC_AMOUNT,
        //         EXEC_PRICE,
        //         ORDER_TYPE,
        //         ORDER_PRICE,
        //         MAKER,
        //         FEE,
        //         FEE_CURRENCY,
        //         ...
        //     ]
        //
        const tradeLength = trade.length;
        const isPrivate = (tradeLength > 5);
        const id = trade[0].toString();
        const amountIndex = isPrivate ? 4 : 2;
        let amount = trade[amountIndex];
        let cost = undefined;
        const priceIndex = isPrivate ? 5 : 3;
        const price = trade[priceIndex];
        let side = undefined;
        let orderId = undefined;
        let takerOrMaker = undefined;
        let type = undefined;
        let fee = undefined;
        let symbol = undefined;
        const timestampIndex = isPrivate ? 2 : 1;
        const timestamp = trade[timestampIndex];
        if (isPrivate) {
            const marketId = trade[1];
            if (marketId !== undefined) {
                if (marketId in this.markets_by_id) {
                    market = this.markets_by_id[marketId];
                    symbol = market['symbol'];
                } else {
                    symbol = marketId;
                }
            }
            orderId = trade[3].toString();
            takerOrMaker = (trade[8] === 1) ? 'maker' : 'taker';
            const feeCost = trade[9];
            const feeCurrency = this.safeCurrencyCode(trade[10]);
            if (feeCost !== undefined) {
                fee = {
                    'cost': Math.abs(feeCost),
                    'currency': feeCurrency,
                };
            }
            const orderType = trade[6];
            type = this.safeString(this.options['orderTypes'], orderType);
        }
        if (symbol === undefined) {
            if (market !== undefined) {
                symbol = market['symbol'];
            }
        }
        if (amount !== undefined) {
            side = (amount < 0) ? 'sell' : 'buy';
            amount = Math.abs(amount);
            if (cost === undefined) {
                if (price !== undefined) {
                    cost = amount * price;
                }
            }
        }
        return {
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'order': orderId,
            'side': side,
            'type': type,
            'takerOrMaker': takerOrMaker,
            'price': price,
            'amount': amount,
            'cost': cost,
            'fee': fee,
            'info': trade,
        };
    }

    async fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        let sort = '-1';
        const request = {
            'symbol': market['id'],
        };
        if (since !== undefined) {
            request['start'] = since;
            sort = '1';
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 120, max 5000
        }
        request['sort'] = sort;
        const response = await this.publicGetTradesSymbolHist(this.extend(request, params));
        //
        //     [
        //         [
        //             ID,
        //             MTS, // timestamp
        //             AMOUNT,
        //             PRICE
        //         ]
        //     ]
        //
        const trades = this.sortBy(response, 1);
        return this.parseTrades(trades, market, undefined, limit);
    }

    async fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = 100, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        if (limit === undefined) {
            limit = 100; // default 100, max 5000
        }
        if (since === undefined) {
            since = this.milliseconds() - this.parseTimeframe(timeframe) * limit * 1000;
        }
        const request = {
            'symbol': market['id'],
            'timeframe': this.timeframes[timeframe],
            'sort': 1,
            'start': since,
            'limit': limit,
        };
        const response = await this.publicGetCandlesTradeTimeframeSymbolHist(this.extend(request, params));
        return this.parseOHLCVs(response, market, timeframe, since, limit);
    }

    async createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        throw new NotSupported(this.id + ' createOrder not implemented yet');
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        throw new NotSupported(this.id + ' cancelOrder not implemented yet');
    }

    async fetchOrder(id, symbol = undefined, params = {}) {
        throw new NotSupported(this.id + ' fetchOrder not implemented yet');
    }

    async fetchDepositAddress(currency, params = {}) {
        throw new NotSupported(this.id + ' fetchDepositAddress() not implemented yet.');
    }

    async withdraw(code, amount, address, tag = undefined, params = {}) {
        throw new NotSupported(this.id + ' withdraw not implemented yet');
    }

    async fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        let market = undefined;
        const request = {
            'end': this.milliseconds(),
        };
        if (since !== undefined) {
            request['start'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 25, max 1000
        }
        let method = 'privatePostAuthRTradesHist';
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['symbol'] = market['id'];
            method = 'privatePostAuthRTradesSymbolHist';
        }
        const response = await this[method](this.extend(request, params));
        return this.parseTrades(response, market, since, limit);
    }

    nonce() {
        return this.milliseconds();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let request = '/' + this.implodeParams(path, params);
        const query = this.omit(params, this.extractParams(path));
        if (api === 'v1') {
            request = api + request;
        } else {
            request = this.version + request;
        }
        let url = this.urls['api'][api] + '/' + request;
        if (api === 'public') {
            if (Object.keys(query).length) {
                url += '?' + this.urlencode(query);
            }
        }
        if (api === 'private') {
            this.checkRequiredCredentials();
            const nonce = this.nonce().toString();
            body = this.json(query);
            const auth = '/api/' + request + nonce + body;
            const signature = this.hmac(this.encode(auth), this.encode(this.secret), 'sha384');
            headers = {
                'bfx-nonce': nonce,
                'bfx-apikey': this.apiKey,
                'bfx-signature': signature,
                'Content-Type': 'application/json',
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    async request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const response = await this.fetch2(path, api, method, params, headers, body);
        if (response) {
            if ('message' in response) {
                if (response['message'].indexOf('not enough exchange balance') >= 0) {
                    throw new InsufficientFunds(this.id + ' ' + this.json(response));
                }
                throw new ExchangeError(this.id + ' ' + this.json(response));
            }
            return response;
        } else if (response === '') {
            throw new ExchangeError(this.id + ' returned empty response');
        }
        return response;
    }

    _websocketOnMessage(contextId, data) {
        const msg = JSON.parse(data);
        // console.log(msg);
        const event = this.safeString(msg, 'event');
        if (typeof event !== 'undefined') {
            if (event === 'subscribed') {
                const channel = this.safeString(msg, 'channel');
                if (channel === 'book') {
                    this._websocketHandleSubscription(contextId, 'ob', msg);
                } else if (channel === 'trades') {
                    this._websocketHandleSubscription(contextId, 'trade', msg);
                }
            } else if (event === 'unsubscribed') {
                this._websocketHandleUnsubscription(contextId, msg);
            } else if (event === 'error') {
                this._websocketHandleError(contextId, msg);
            } else if (event === 'info') {
                this._websocketHandleInfoVersion(contextId, msg);
            }
        } else {
            // channel data
            const chanId = msg[0];
            const data = msg[1];
            if (data === 'hb') {
                // console.log ('heartbeat');
                return;
            }
            const chanKey = '_' + chanId.toString();
            const channels = this._contextGet(contextId, 'channels');
            if (!(chanKey in channels)) {
                this.emit('err', new ExchangeError(this.id + ' msg received from unregistered channels:' + chanId), contextId);
                return;
            }
            const symbol = channels[chanKey]['symbol'];
            const event = channels[chanKey]['event'];
            if (event === 'ob') {
                this._websocketHandleOrderBook(contextId, symbol, msg);
            } else if (event === 'trade') {
                this._websocketHandleTrade(contextId, symbol, msg);
            }
        }
    }

    _websocketHandleInfoVersion(contextId, data) {
        const version = this.safeInteger(data, 'version');
        if (typeof version !== 'undefined') {
            this.websocketSendJson({
                'event': 'conf',
                'flags': 32768,
            });
            this.emit('statusok', true);
        }
    }

    _websocketHandleError(contextId, msg) {
        const channel = this.safeString(msg, 'channel');
        const errorMsg = this.safeString(msg, 'msg');
        const errorCode = this.safeString(msg, 'code');
        const ex = new ExchangeError(this.id + ' ' + errorCode + ':' + errorMsg);
        if (channel === 'book') {
            const id = this.safeString(msg, 'symbol');
            const symbol = this._websocketFindSymbol(id);
            this._websocketProcessPendingNonces(contextId, 'sub-nonces', 'ob', symbol, false, ex);
        } else if (channel === 'trades') {
            const id = this.safeString(msg, 'symbol');
            const symbol = this._websocketFindSymbol(id);
            this._websocketProcessPendingNonces(contextId, 'sub-nonces', 'trade', symbol, false, ex);
        }
        this.emit('err', ex, contextId);
    }

    _websocketHandleTrade(contextId, symbol, msg) {
        const market = this.market(symbol);
        let trades = undefined;
        // From http://blog.bitfinex.com/api/websocket-api-update:
        // "We are splitting the public trade messages into two: a “te” message which mimics the current behavior, and a “tu” message which will be delayed by 1-2 seconds and include the tradeId. If the tradeId is important to you, use the “tu” message. If speed is important to you, listen to the “te” message. Or of course use both if you’d like."
        if (msg[1] === 'te') {
            // te update
            trades = [msg[2]];
        } else if (msg[1] === 'tu') {
            // tu update, ignore
            return;
        } else {
            // snapshot
            trades = msg[1];
        }
        trades = this.parseTrades(trades, market);
        for (let i = 0; i < trades.length; i++) {
            this.emit('trade', symbol, trades[i]);
        }
    }

    _websocketHandleOrderBook(contextId, symbol, msg) {
        const data = msg[1];
        const firstElement = data[0];
        let timestamp = undefined;
        let dt = undefined;
        const length = msg.length;
        if (length > 2) {
            timestamp = msg[2];
            dt = this.iso8601(timestamp);
        }
        const symbolData = this._contextGetSymbolData(contextId, 'ob', symbol);
        if (Array.isArray(firstElement)) {
            // snapshot
            symbolData['ob'] = {
                'bids': [],
                'asks': [],
                'timestamp': timestamp,
                'datetime': dt,
                'nonce': undefined,
            };
            for (let i = 0; i < data.length; i++) {
                const record = data[i];
                const price = record[0];
                const c = record[1];
                let amount = record[2];
                let side = undefined;
                let isBid = undefined;
                if (amount > 0) {
                    side = 'bids';
                    isBid = true;
                } else {
                    side = 'asks';
                    isBid = false;
                    amount = -amount;
                }
                if (c === 0) {
                    // remove
                    this.updateBidAsk([price, 0], symbolData['ob'][side], isBid);
                } else {
                    // update
                    this.updateBidAsk([price, amount], symbolData['ob'][side], isBid);
                }
            }
        } else {
            // update
            const price = data[0];
            const c = data[1];
            let amount = data[2];
            let side = undefined;
            let isBid = undefined;
            if (amount > 0) {
                side = 'bids';
                isBid = true;
            } else {
                side = 'asks';
                isBid = false;
                amount = -amount;
            }
            if (c === 0) {
                // remove
                this.updateBidAsk([price, 0], symbolData['ob'][side], isBid);
            } else {
                // update
                this.updateBidAsk([price, amount], symbolData['ob'][side], isBid);
            }
            symbolData['ob']['timestamp'] = timestamp;
            symbolData['ob']['datetime'] = dt;
        }
        this.emit('ob', symbol, this._cloneOrderBook(symbolData['ob'], symbolData['limit']));
        this._contextSetSymbolData(contextId, 'ob', symbol, symbolData);
    }

    _websocketProcessPendingNonces(contextId, nonceKey, event, symbol, success, ex) {
        const symbolData = this._contextGetSymbolData(contextId, event, symbol);
        if (nonceKey in symbolData) {
            const nonces = symbolData[nonceKey];
            const keys = Object.keys(nonces);
            for (let i = 0; i < keys.length; i++) {
                const nonce = keys[i];
                this._cancelTimeout(nonces[nonce]);
                this.emit(nonce, success, ex);
            }
            symbolData[nonceKey] = {};
            this._contextSetSymbolData(contextId, event, symbol, symbolData);
        }
    }

    _websocketHandleSubscription(contextId, event, msg) {
        const id = this.safeString(msg, 'symbol');
        const symbol = this._websocketFindSymbol(id);
        const channel = this.safeInteger(msg, 'chanId');
        const chanKey = '_' + channel.toString();
        let channels = this._contextGet(contextId, 'channels');
        if (typeof channels === 'undefined') {
            channels = {};
        }
        channels[chanKey] = {
            'response': msg,
            'symbol': symbol,
            'event': event,
        };
        this._contextSet(contextId, 'channels', channels);
        const symbolData = this._contextGetSymbolData(contextId, event, symbol);
        symbolData['channelId'] = channel;
        this._contextSetSymbolData(contextId, event, symbol, symbolData);
        if (event === 'ob') {
            this._websocketProcessPendingNonces(contextId, 'sub-nonces', 'ob', symbol, true, undefined);
        } else if (event === 'trade') {
            this._websocketProcessPendingNonces(contextId, 'sub-nonces', 'trade', symbol, true, undefined);
        }
    }

    _websocketHandleUnsubscription(contextId, msg) {
        const status = this.safeString(msg, 'status');
        if (status === 'OK') {
            const chanId = this.safeInteger(msg, 'chanId');
            const chanKey = '_' + chanId.toString();
            const channels = this._contextGet(contextId, 'channels');
            if (!(chanKey in channels)) {
                this.emit('err', new ExchangeError(this.id + ' msg received from unregistered channels:' + chanId), contextId);
                return;
            }
            const symbol = channels[chanKey]['symbol'];
            const event = channels[chanKey]['event'];
            // remove channel ids ?
            this.omit(channels, chanKey);
            this._contextSet(contextId, 'channels', channels);
            this._websocketProcessPendingNonces(contextId, 'unsub-nonces', event, symbol, true, undefined);
        }
    }

    _websocketSubscribe(contextId, event, symbol, nonce, params = {}) {
        if (event !== 'ob' && event !== 'trade') {
            throw new NotSupported('subscribe ' + event + '(' + symbol + ') not supported for exchange ' + this.id);
        }
        // save nonce for subscription response
        const symbolData = this._contextGetSymbolData(contextId, event, symbol);
        if (!('sub-nonces' in symbolData)) {
            symbolData['sub-nonces'] = {};
        }
        symbolData['limit'] = this.safeInteger(params, 'limit', undefined);
        const nonceStr = nonce.toString();
        const handle = this._setTimeout(contextId, this.timeout, this._websocketMethodMap('_websocketTimeoutRemoveNonce'), [contextId, nonceStr, event, symbol, 'sub-nonce']);
        symbolData['sub-nonces'][nonceStr] = handle;
        this._contextSetSymbolData(contextId, event, symbol, symbolData);
        // send request
        const id = this.marketId(symbol);
        if (event === 'ob') {
            this.websocketSendJson({
                'event': 'subscribe',
                'channel': 'book',
                'symbol': id,
                'prec': 'P0',
                'freq': 'F0',
                'len': '100',
            });
        } else if (event === 'trade') {
            this.websocketSendJson({
                'event': 'subscribe',
                'channel': 'trades',
                'symbol': id,
            });
        }
    }

    _websocketUnsubscribe(contextId, event, symbol, nonce, params = {}) {
        if (event !== 'ob' && event !== 'trade') {
            throw new NotSupported('unsubscribe ' + event + '(' + symbol + ') not supported for exchange ' + this.id);
        }
        const symbolData = this._contextGetSymbolData(contextId, event, symbol);
        const payload = {
            'event': 'unsubscribe',
            'chanId': symbolData['channelId'],
        };
        if (!('unsub-nonces' in symbolData)) {
            symbolData['unsub-nonces'] = {};
        }
        const nonceStr = nonce.toString();
        const handle = this._setTimeout(contextId, this.timeout, this._websocketMethodMap('_websocketTimeoutRemoveNonce'), [contextId, nonceStr, event, symbol, 'unsub-nonces']);
        symbolData['unsub-nonces'][nonceStr] = handle;
        this._contextSetSymbolData(contextId, event, symbol, symbolData);
        this.websocketSendJson(payload);
    }

    _websocketTimeoutRemoveNonce(contextId, timerNonce, event, symbol, key) {
        const symbolData = this._contextGetSymbolData(contextId, event, symbol);
        if (key in symbolData) {
            const nonces = symbolData[key];
            if (timerNonce in nonces) {
                this.omit(symbolData[key], timerNonce);
                this._contextSetSymbolData(contextId, event, symbol, symbolData);
            }
        }
    }

    _getCurrentWebsocketOrderbook(contextId, symbol, limit) {
        const data = this._contextGetSymbolData(contextId, 'ob', symbol);
        if (('ob' in data) && (typeof data['ob'] !== 'undefined')) {
            return this._cloneOrderBook(data['ob'], limit);
        }
        return undefined;
    }
};
