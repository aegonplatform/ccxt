'use strict';

//  ---------------------------------------------------------------------------

const Exchange = require ('./base/Exchange');
const { ExchangeError, ExchangeNotAvailable, RequestTimeout, AuthenticationError, PermissionDenied, DDoSProtection, InsufficientFunds, OrderNotFound, OrderNotCached, InvalidOrder, AccountSuspended, CancelPending, InvalidNonce, NotSupported } = require ('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class poloniex extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'poloniex',
            'name': 'Poloniex',
            'countries': [ 'US' ],
            'rateLimit': 1000, // up to 6 calls per second
            'certified': true, // 2019-06-07
            'has': {
                'CORS': false,
                'createDepositAddress': true,
                'createMarketOrder': false,
                'editOrder': true,
                'fetchClosedOrders': 'emulated',
                'fetchCurrencies': true,
                'fetchDepositAddress': true,
                'fetchDeposits': true,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenOrder': true, // true endpoint for a single open order
                'fetchOpenOrders': true, // true endpoint for open orders
                'fetchOrder': 'emulated', // no endpoint for a single open-or-closed order (just for an open order only)
                'fetchOrderBooks': true,
                'fetchOrders': 'emulated', // no endpoint for open-or-closed orders (just for open orders only)
                'fetchOrderStatus': 'emulated', // no endpoint for status of a single open-or-closed order (just for open orders only)
                'fetchOrderTrades': true, // true endpoint for trades of a single open or closed order
                'fetchTickers': true,
                'fetchTradingFee': true,
                'fetchTradingFees': true,
                'fetchTransactions': true,
                'fetchWithdrawals': true,
                'cancelAllOrders': true,
                'withdraw': true,
            },
            'timeframes': {
                '5m': 300,
                '15m': 900,
                '30m': 1800,
                '2h': 7200,
                '4h': 14400,
                '1d': 86400,
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766817-e9456312-5ee6-11e7-9b3c-b628ca5626a5.jpg',
                'api': {
                    'public': 'https://poloniex.com/public',
                    'private': 'https://poloniex.com/tradingApi',
                },
                'www': 'https://www.poloniex.com',
                'doc': 'https://docs.poloniex.com',
                'fees': 'https://poloniex.com/fees',
                'referral': 'https://www.poloniex.com/?utm_source=ccxt&utm_medium=web',
            },
            'api': {
                'public': {
                    'get': [
                        'return24hVolume',
                        'returnChartData',
                        'returnCurrencies',
                        'returnLoanOrders',
                        'returnOrderBook',
                        'returnTicker',
                        'returnTradeHistory',
                    ],
                },
                'private': {
                    'post': [
                        'buy',
                        'cancelLoanOffer',
                        'cancelOrder',
                        'cancelAllOrders',
                        'closeMarginPosition',
                        'createLoanOffer',
                        'generateNewAddress',
                        'getMarginPosition',
                        'marginBuy',
                        'marginSell',
                        'moveOrder',
                        'returnActiveLoans',
                        'returnAvailableAccountBalances',
                        'returnBalances',
                        'returnCompleteBalances',
                        'returnDepositAddresses',
                        'returnDepositsWithdrawals',
                        'returnFeeInfo',
                        'returnLendingHistory',
                        'returnMarginAccountSummary',
                        'returnOpenLoanOffers',
                        'returnOpenOrders',
                        'returnOrderTrades',
                        'returnOrderStatus',
                        'returnTradableBalances',
                        'returnTradeHistory',
                        'sell',
                        'toggleAutoRenew',
                        'transferBalance',
                        'withdraw',
                    ],
                },
            },
            'wsconf': {
                'conx-tpls': {
                    'default': {
                        'type': 'ws',
                        'baseurl': 'wss://api2.poloniex.com',
                    },
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
                    'od': {
                        'conx-tpl': 'default',
                        'conx-param': {
                            'url': '{baseurl}',
                            'id': '{id}',
                        },
                    },
                },
            },
            // Fees are tier-based. More info: https://poloniex.com/fees/
            // Rates below are highest possible.
            'fees': {
                'trading': {
                    // https://github.com/ccxt/ccxt/issues/6064
                    // starting from October 21, 2019 17:00 UTC
                    // all spot trading fees will be reduced to 0.00%
                    // until December 31, 2019 23:59 UTC
                    'maker': 0.0,
                    'taker': 0.0,
                },
                'funding': {},
            },
            'limits': {
                'amount': {
                    'min': 0.000001,
                    'max': 1000000000,
                },
                'price': {
                    'min': 0.00000001,
                    'max': 1000000000,
                },
                'cost': {
                    'min': 0.00000000,
                    'max': 1000000000,
                },
            },
            'precision': {
                'amount': 8,
                'price': 8,
            },
            'commonCurrencies': {
                'AIR': 'AirCoin',
                'APH': 'AphroditeCoin',
                'BCC': 'BTCtalkcoin',
                'BDG': 'Badgercoin',
                'BTM': 'Bitmark',
                'CON': 'Coino',
                'GOLD': 'GoldEagles',
                'GPUC': 'GPU',
                'HOT': 'Hotcoin',
                'ITC': 'Information Coin',
                'PLX': 'ParallaxCoin',
                'KEY': 'KEYCoin',
                'STR': 'XLM',
                'SOC': 'SOCC',
                'XAP': 'API Coin',
            },
            'options': {
                'limits': {
                    'cost': {
                        'min': {
                            'BTC': 0.0001,
                            'ETH': 0.0001,
                            'XMR': 0.0001,
                            'USDT': 1.0,
                        },
                    },
                },
            },
            'exceptions': {
                'exact': {
                    'You may only place orders that reduce your position.': InvalidOrder,
                    'Invalid order number, or you are not the person who placed the order.': OrderNotFound,
                    'Permission denied': PermissionDenied,
                    'Connection timed out. Please try again.': RequestTimeout,
                    'Internal error. Please try again.': ExchangeNotAvailable,
                    'Order not found, or you are not the person who placed it.': OrderNotFound,
                    'Invalid API key/secret pair.': AuthenticationError,
                    'Please do not make more than 8 API calls per second.': DDoSProtection,
                    'Rate must be greater than zero.': InvalidOrder, // {"error":"Rate must be greater than zero."}
                },
                'broad': {
                    'Total must be at least': InvalidOrder, // {"error":"Total must be at least 0.0001."}
                    'This account is frozen.': AccountSuspended,
                    'Not enough': InsufficientFunds,
                    'Nonce must be greater': InvalidNonce,
                    'You have already called cancelOrder or moveOrder on this order.': CancelPending,
                    'Amount must be at least': InvalidOrder, // {"error":"Amount must be at least 0.000001."}
                    'is either completed or does not exist': InvalidOrder, // {"error":"Order 587957810791 is either completed or does not exist."}
                },
            },
        });
    }

    calculateFee (symbol, type, side, amount, price, takerOrMaker = 'taker', params = {}) {
        const market = this.markets[symbol];
        let key = 'quote';
        const rate = market[takerOrMaker];
        let cost = parseFloat (this.costToPrecision (symbol, amount * rate));
        if (side === 'sell') {
            cost *= price;
        } else {
            key = 'base';
        }
        return {
            'type': takerOrMaker,
            'currency': market[key],
            'rate': rate,
            'cost': parseFloat (this.feeToPrecision (symbol, cost)),
        };
    }

    parseOHLCV (ohlcv, market = undefined, timeframe = '5m', since = undefined, limit = undefined) {
        return [
            this.safeTimestamp (ohlcv, 'date'),
            this.safeFloat (ohlcv, 'open'),
            this.safeFloat (ohlcv, 'high'),
            this.safeFloat (ohlcv, 'low'),
            this.safeFloat (ohlcv, 'close'),
            this.safeFloat (ohlcv, 'quoteVolume'),
        ];
    }

    async fetchOHLCV (symbol, timeframe = '5m', since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'currencyPair': market['id'],
            'period': this.timeframes[timeframe],
        };
        if (since === undefined) {
            request['end'] = this.seconds ();
            if (limit === undefined) {
                request['start'] = request['end'] - this.parseTimeframe ('1w'); // max range = 1 week
            } else {
                request['start'] = request['end'] - this.sum (limit) * this.parseTimeframe (timeframe);
            }
        } else {
            request['start'] = parseInt (since / 1000);
            if (limit !== undefined) {
                const end = this.sum (request['start'], limit * this.parseTimeframe (timeframe));
                request['end'] = end;
            }
        }
        const response = await this.publicGetReturnChartData (this.extend (request, params));
        return this.parseOHLCVs (response, market, timeframe, since, limit);
    }

    async fetchMarkets (params = {}) {
        const markets = await this.publicGetReturnTicker (params);
        const keys = Object.keys (markets);
        const result = [];
        for (let i = 0; i < keys.length; i++) {
            const id = keys[i];
            const market = markets[id];
            const [ quoteId, baseId ] = id.split ('_');
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            const symbol = base + '/' + quote;
            const limits = this.extend (this.limits, {
                'cost': {
                    'min': this.safeValue (this.options['limits']['cost']['min'], quote),
                },
            });
            const isFrozen = this.safeString (market, 'isFrozen');
            const active = (isFrozen !== '1');
            const numericId = this.safeInteger (market, 'id');
            result.push ({
                'id': id,
                'numericId': numericId,
                'symbol': symbol,
                'baseId': baseId,
                'quoteId': quoteId,
                'base': base,
                'quote': quote,
                'active': active,
                'limits': limits,
                'info': market,
            });
        }
        return result;
    }

    async fetchBalance (params = {}) {
        await this.loadMarkets ();
        const request = {
            'account': 'all',
        };
        const response = await this.privatePostReturnCompleteBalances (this.extend (request, params));
        const result = { 'info': response };
        const currencyIds = Object.keys (response);
        for (let i = 0; i < currencyIds.length; i++) {
            const currencyId = currencyIds[i];
            const balance = this.safeValue (response, currencyId, {});
            const code = this.safeCurrencyCode (currencyId);
            const account = this.account ();
            account['free'] = this.safeFloat (balance, 'available');
            account['used'] = this.safeFloat (balance, 'onOrders');
            result[code] = account;
        }
        return this.parseBalance (result);
    }

    async fetchTradingFees (params = {}) {
        await this.loadMarkets ();
        const fees = await this.privatePostReturnFeeInfo (params);
        return {
            'info': fees,
            'maker': this.safeFloat (fees, 'makerFee'),
            'taker': this.safeFloat (fees, 'takerFee'),
            'withdraw': {},
            'deposit': {},
        };
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'currencyPair': this.marketId (symbol),
        };
        if (limit !== undefined) {
            request['depth'] = limit; // 100
        }
        const response = await this.publicGetReturnOrderBook (this.extend (request, params));
        const orderbook = this.parseOrderBook (response);
        orderbook['nonce'] = this.safeInteger (response, 'seq');
        return orderbook;
    }

    async fetchOrderBooks (symbols = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'currencyPair': 'all',
        };
        //
        //     if (limit !== undefined) {
        //         request['depth'] = limit; // 100
        //     }
        //
        const response = await this.publicGetReturnOrderBook (this.extend (request, params));
        const marketIds = Object.keys (response);
        const result = {};
        for (let i = 0; i < marketIds.length; i++) {
            const marketId = marketIds[i];
            let symbol = undefined;
            if (marketId in this.markets_by_id) {
                symbol = this.markets_by_id[marketId]['symbol'];
            } else {
                const [ quoteId, baseId ] = marketId.split ('_');
                const base = this.safeCurrencyCode (baseId);
                const quote = this.safeCurrencyCode (quoteId);
                symbol = base + '/' + quote;
            }
            const orderbook = this.parseOrderBook (response[marketId]);
            orderbook['nonce'] = this.safeInteger (response[marketId], 'seq');
            result[symbol] = orderbook;
        }
        return result;
    }

    parseTicker (ticker, market = undefined) {
        const timestamp = this.milliseconds ();
        let symbol = undefined;
        if (market) {
            symbol = market['symbol'];
        }
        let open = undefined;
        let change = undefined;
        let average = undefined;
        const last = this.safeFloat (ticker, 'last');
        const relativeChange = this.safeFloat (ticker, 'percentChange');
        if (relativeChange !== -1) {
            open = last / this.sum (1, relativeChange);
            change = last - open;
            average = this.sum (last, open) / 2;
        }
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeFloat (ticker, 'high24hr'),
            'low': this.safeFloat (ticker, 'low24hr'),
            'bid': this.safeFloat (ticker, 'highestBid'),
            'bidVolume': undefined,
            'ask': this.safeFloat (ticker, 'lowestAsk'),
            'askVolume': undefined,
            'vwap': undefined,
            'open': open,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': change,
            'percentage': relativeChange * 100,
            'average': average,
            'baseVolume': this.safeFloat (ticker, 'quoteVolume'),
            'quoteVolume': this.safeFloat (ticker, 'baseVolume'),
            'info': ticker,
        };
    }

    async fetchTickers (symbols = undefined, params = {}) {
        await this.loadMarkets ();
        const response = await this.publicGetReturnTicker (params);
        const ids = Object.keys (response);
        const result = {};
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            let symbol = undefined;
            let market = undefined;
            if (id in this.markets_by_id) {
                market = this.markets_by_id[id];
                symbol = market['symbol'];
            } else {
                const [ quoteId, baseId ] = id.split ('_');
                const base = this.safeCurrencyCode (baseId);
                const quote = this.safeCurrencyCode (quoteId);
                symbol = base + '/' + quote;
                market = { 'symbol': symbol };
            }
            const ticker = response[id];
            result[symbol] = this.parseTicker (ticker, market);
        }
        return result;
    }

    async fetchCurrencies (params = {}) {
        const response = await this.publicGetReturnCurrencies (params);
        const ids = Object.keys (response);
        const result = {};
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const currency = response[id];
            // todo: will need to rethink the fees
            // to add support for multiple withdrawal/deposit methods and
            // differentiated fees for each particular method
            const precision = 8; // default precision, todo: fix "magic constants"
            const code = this.safeCurrencyCode (id);
            const active = (currency['delisted'] === 0) && !currency['disabled'];
            const numericId = this.safeInteger (currency, 'id');
            result[code] = {
                'id': id,
                'numericId': numericId,
                'code': code,
                'info': currency,
                'name': currency['name'],
                'active': active,
                'fee': this.safeFloat (currency, 'txFee'), // todo: redesign
                'precision': precision,
                'limits': {
                    'amount': {
                        'min': Math.pow (10, -precision),
                        'max': Math.pow (10, precision),
                    },
                    'price': {
                        'min': Math.pow (10, -precision),
                        'max': Math.pow (10, precision),
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'withdraw': {
                        'min': currency['txFee'],
                        'max': Math.pow (10, precision),
                    },
                },
            };
        }
        return result;
    }

    async fetchTicker (symbol, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const response = await this.publicGetReturnTicker (params);
        const ticker = response[market['id']];
        return this.parseTicker (ticker, market);
    }

    parseTrade (trade, market = undefined) {
        //
        // fetchMyTrades (symbol defined, specific market)
        //
        //     {
        //         globalTradeID: 394698946,
        //         tradeID: 45210255,
        //         date: '2018-10-23 17:28:55',
        //         type: 'sell',
        //         rate: '0.03114126',
        //         amount: '0.00018753',
        //         total: '0.00000583'
        //     }
        //
        // fetchMyTrades (symbol undefined, all markets)
        //
        //     {
        //         globalTradeID: 394131412,
        //         tradeID: '5455033',
        //         date: '2018-10-16 18:05:17',
        //         rate: '0.06935244',
        //         amount: '1.40308443',
        //         total: '0.09730732',
        //         fee: '0.00100000',
        //         orderNumber: '104768235081',
        //         type: 'sell',
        //         category: 'exchange'
        //     }
        //
        // createOrder (taker trades)
        //
        //     {
        //         'amount': '200.00000000',
        //         'date': '2019-12-15 16:04:10',
        //         'rate': '0.00000355',
        //         'total': '0.00071000',
        //         'tradeID': '119871',
        //         'type': 'buy',
        //         'takerAdjustment': '200.00000000'
        //     }
        //
        const id = this.safeString2 (trade, 'globalTradeID', 'tradeID');
        const orderId = this.safeString (trade, 'orderNumber');
        const timestamp = this.parse8601 (this.safeString (trade, 'date'));
        let symbol = undefined;
        let base = undefined;
        let quote = undefined;
        if ((!market) && ('currencyPair' in trade)) {
            const currencyPair = trade['currencyPair'];
            if (currencyPair in this.markets_by_id) {
                market = this.markets_by_id[currencyPair];
            } else {
                const parts = currencyPair.split ('_');
                quote = parts[0];
                base = parts[1];
                symbol = base + '/' + quote;
            }
        }
        if (market !== undefined) {
            symbol = market['symbol'];
            base = market['base'];
            quote = market['quote'];
        }
        const side = this.safeString (trade, 'type');
        let fee = undefined;
        const price = this.safeFloat (trade, 'rate');
        const cost = this.safeFloat (trade, 'total');
        const amount = this.safeFloat (trade, 'amount');
        if ('fee' in trade) {
            const rate = this.safeFloat (trade, 'fee');
            let feeCost = undefined;
            let currency = undefined;
            if (side === 'buy') {
                currency = base;
                feeCost = amount * rate;
            } else {
                currency = quote;
                if (cost !== undefined) {
                    feeCost = cost * rate;
                }
            }
            fee = {
                'type': undefined,
                'rate': rate,
                'cost': feeCost,
                'currency': currency,
            };
        }
        let takerOrMaker = undefined;
        const takerAdjustment = this.safeFloat (trade, 'takerAdjustment');
        if (takerAdjustment !== undefined) {
            takerOrMaker = 'taker';
        }
        return {
            'id': id,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'order': orderId,
            'type': 'limit',
            'side': side,
            'takerOrMaker': takerOrMaker,
            'price': price,
            'amount': amount,
            'cost': cost,
            'fee': fee,
        };
    }

    async fetchTrades (symbol, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'currencyPair': market['id'],
        };
        if (since !== undefined) {
            request['start'] = parseInt (since / 1000);
            request['end'] = this.seconds (); // last 50000 trades by default
        }
        const trades = await this.publicGetReturnTradeHistory (this.extend (request, params));
        return this.parseTrades (trades, market, since, limit);
    }

    async fetchMyTrades (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        const pair = market ? market['id'] : 'all';
        const request = { 'currencyPair': pair };
        if (since !== undefined) {
            request['start'] = parseInt (since / 1000);
            request['end'] = this.sum (this.seconds (), 1); // adding 1 is a fix for #3411
        }
        // limit is disabled (does not really work as expected)
        if (limit !== undefined) {
            request['limit'] = parseInt (limit);
        }
        const response = await this.privatePostReturnTradeHistory (this.extend (request, params));
        //
        // specific market (symbol defined)
        //
        //     [
        //         {
        //             globalTradeID: 394700861,
        //             tradeID: 45210354,
        //             date: '2018-10-23 18:01:58',
        //             type: 'buy',
        //             rate: '0.03117266',
        //             amount: '0.00000652',
        //             total: '0.00000020'
        //         },
        //         {
        //             globalTradeID: 394698946,
        //             tradeID: 45210255,
        //             date: '2018-10-23 17:28:55',
        //             type: 'sell',
        //             rate: '0.03114126',
        //             amount: '0.00018753',
        //             total: '0.00000583'
        //         }
        //     ]
        //
        // all markets (symbol undefined)
        //
        //     {
        //         BTC_BCH: [{
        //             globalTradeID: 394131412,
        //             tradeID: '5455033',
        //             date: '2018-10-16 18:05:17',
        //             rate: '0.06935244',
        //             amount: '1.40308443',
        //             total: '0.09730732',
        //             fee: '0.00100000',
        //             orderNumber: '104768235081',
        //             type: 'sell',
        //             category: 'exchange'
        //         }, {
        //             globalTradeID: 394126818,
        //             tradeID: '5455007',
        //             date: '2018-10-16 16:55:34',
        //             rate: '0.06935244',
        //             amount: '0.00155709',
        //             total: '0.00010798',
        //             fee: '0.00200000',
        //             orderNumber: '104768179137',
        //             type: 'sell',
        //             category: 'exchange'
        //         }],
        //     }
        //
        let result = [];
        if (market !== undefined) {
            result = this.parseTrades (response, market);
        } else {
            if (response) {
                const ids = Object.keys (response);
                for (let i = 0; i < ids.length; i++) {
                    const id = ids[i];
                    let market = undefined;
                    if (id in this.markets_by_id) {
                        market = this.markets_by_id[id];
                        const trades = this.parseTrades (response[id], market);
                        for (let j = 0; j < trades.length; j++) {
                            result.push (trades[j]);
                        }
                    } else {
                        const [ quoteId, baseId ] = id.split ('_');
                        const base = this.safeCurrencyCode (baseId);
                        const quote = this.safeCurrencyCode (quoteId);
                        const symbol = base + '/' + quote;
                        const trades = response[id];
                        for (let j = 0; j < trades.length; j++) {
                            const market = {
                                'symbol': symbol,
                                'base': base,
                                'quote': quote,
                            };
                            result.push (this.parseTrade (trades[j], market));
                        }
                    }
                }
            }
        }
        return this.filterBySinceLimit (result, since, limit);
    }

    parseOrderStatus (status) {
        const statuses = {
            'Open': 'open',
            'Partially filled': 'open',
        };
        return this.safeString (statuses, status, status);
    }

    parseOrder (order, market = undefined) {
        //
        // fetchOpenOrder
        //
        //     {
        //         status: 'Open',
        //         rate: '0.40000000',
        //         amount: '1.00000000',
        //         currencyPair: 'BTC_ETH',
        //         date: '2018-10-17 17:04:50',
        //         total: '0.40000000',
        //         type: 'buy',
        //         startingAmount: '1.00000',
        //     }
        //
        // fetchOpenOrders
        //
        //     {
        //         orderNumber: '514514894224',
        //         type: 'buy',
        //         rate: '0.00001000',
        //         startingAmount: '100.00000000',
        //         amount: '100.00000000',
        //         total: '0.00100000',
        //         date: '2018-10-23 17:38:53',
        //         margin: 0,
        //     }
        //
        // createOrder
        //
        //     {
        //         'orderNumber': '9805453960',
        //         'resultingTrades': [
        //             {
        //                 'amount': '200.00000000',
        //                 'date': '2019-12-15 16:04:10',
        //                 'rate': '0.00000355',
        //                 'total': '0.00071000',
        //                 'tradeID': '119871',
        //                 'type': 'buy',
        //                 'takerAdjustment': '200.00000000',
        //             },
        //         ],
        //         'fee': '0.00000000',
        //         'currencyPair': 'BTC_MANA',
        //         // ---------------------------------------------------------
        //         // the following fields are injected by createOrder
        //         'timestamp': timestamp,
        //         'status': 'open',
        //         'type': type,
        //         'side': side,
        //         'price': price,
        //         'amount': amount,
        //     }
        //
        let timestamp = this.safeInteger (order, 'timestamp');
        if (!timestamp) {
            timestamp = this.parse8601 (order['date']);
        }
        let trades = undefined;
        if ('resultingTrades' in order) {
            trades = this.parseTrades (order['resultingTrades'], market);
        }
        let symbol = undefined;
        const marketId = this.safeString (order, 'currencyPair');
        market = this.safeValue (this.markets_by_id, marketId, market);
        if (market !== undefined) {
            symbol = market['symbol'];
        }
        const price = this.safeFloat2 (order, 'price', 'rate');
        let remaining = this.safeFloat (order, 'amount');
        let amount = this.safeFloat (order, 'startingAmount');
        let filled = undefined;
        let cost = 0;
        if (amount !== undefined) {
            if (remaining !== undefined) {
                filled = amount - remaining;
                if (price !== undefined) {
                    cost = filled * price;
                }
            }
        } else {
            amount = remaining;
        }
        let status = this.parseOrderStatus (this.safeString (order, 'status'));
        let average = undefined;
        let lastTradeTimestamp = undefined;
        if (filled === undefined) {
            if (trades !== undefined) {
                filled = 0;
                cost = 0;
                const tradesLength = trades.length;
                if (tradesLength > 0) {
                    lastTradeTimestamp = trades[0]['timestamp'];
                    for (let i = 0; i < tradesLength; i++) {
                        const trade = trades[i];
                        const tradeAmount = trade['amount'];
                        const tradePrice = trade['price'];
                        filled = this.sum (filled, tradeAmount);
                        cost = this.sum (cost, tradePrice * tradeAmount);
                        lastTradeTimestamp = Math.max (lastTradeTimestamp, trade['timestamp']);
                    }
                }
                remaining = Math.max (amount - filled, 0);
                if (filled >= amount) {
                    status = 'closed';
                }
            }
        }
        if ((filled !== undefined) && (cost !== undefined) && (filled > 0)) {
            average = cost / filled;
        }
        let type = this.safeString (order, 'type');
        const side = this.safeString (order, 'side', type);
        if (type === side) {
            type = undefined;
        }
        const id = this.safeString (order, 'orderNumber');
        let fee = undefined;
        const feeCost = this.safeFloat (order, 'fee');
        if (feeCost !== undefined) {
            let feeCurrencyCode = undefined;
            if (market !== undefined) {
                feeCurrencyCode = (side === 'buy') ? market['base'] : market['quote'];
            }
            fee = {
                'cost': feeCost,
                'currency': feeCurrencyCode,
            };
        }
        return {
            'info': order,
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': lastTradeTimestamp,
            'status': status,
            'symbol': symbol,
            'type': type,
            'side': side,
            'price': price,
            'cost': cost,
            'average': average,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'trades': trades,
            'fee': fee,
        };
    }

    parseOpenOrders (orders, market, result) {
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const extended = this.extend (order, {
                'status': 'open',
                'type': 'limit',
                'side': order['type'],
                'price': order['rate'],
            });
            result.push (this.parseOrder (extended, market));
        }
        return result;
    }

    async fetchOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        const pair = market ? market['id'] : 'all';
        const request = {
            'currencyPair': pair,
        };
        const response = await this.privatePostReturnOpenOrders (this.extend (request, params));
        let openOrders = [];
        if (market !== undefined) {
            openOrders = this.parseOpenOrders (response, market, openOrders);
        } else {
            const marketIds = Object.keys (response);
            for (let i = 0; i < marketIds.length; i++) {
                const marketId = marketIds[i];
                const orders = response[marketId];
                const m = this.markets_by_id[marketId];
                openOrders = this.parseOpenOrders (orders, m, openOrders);
            }
        }
        for (let j = 0; j < openOrders.length; j++) {
            this.orders[openOrders[j]['id']] = openOrders[j];
        }
        const openOrdersIndexedById = this.indexBy (openOrders, 'id');
        const cachedOrderIds = Object.keys (this.orders);
        const result = [];
        for (let k = 0; k < cachedOrderIds.length; k++) {
            const id = cachedOrderIds[k];
            if (id in openOrdersIndexedById) {
                this.orders[id] = this.extend (this.orders[id], openOrdersIndexedById[id]);
            } else {
                let order = this.orders[id];
                if (order['status'] === 'open') {
                    order = this.extend (order, {
                        'status': 'closed',
                        'cost': undefined,
                        'filled': order['amount'],
                        'remaining': 0.0,
                    });
                    if (order['cost'] === undefined) {
                        if (order['filled'] !== undefined) {
                            order['cost'] = order['filled'] * order['price'];
                        }
                    }
                    this.orders[id] = order;
                }
            }
            const order = this.orders[id];
            if (market !== undefined) {
                if (order['symbol'] === symbol) {
                    result.push (order);
                }
            } else {
                result.push (order);
            }
        }
        return this.filterBySinceLimit (result, since, limit);
    }

    async fetchOrder (id, symbol = undefined, params = {}) {
        const since = this.safeValue (params, 'since');
        const limit = this.safeValue (params, 'limit');
        const request = this.omit (params, [ 'since', 'limit' ]);
        const orders = await this.fetchOrders (symbol, since, limit, request);
        for (let i = 0; i < orders.length; i++) {
            if (orders[i]['id'] === id) {
                return orders[i];
            }
        }
        throw new OrderNotCached (this.id + ' order id ' + id.toString () + ' is not in "open" state and not found in cache');
    }

    filterOrdersByStatus (orders, status) {
        const result = [];
        for (let i = 0; i < orders.length; i++) {
            if (orders[i]['status'] === status) {
                result.push (orders[i]);
            }
        }
        return result;
    }

    async fetchOpenOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        const orders = await this.fetchOrders (symbol, since, limit, params);
        return this.filterOrdersByStatus (orders, 'open');
    }

    async fetchClosedOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        const orders = await this.fetchOrders (symbol, since, limit, params);
        return this.filterOrdersByStatus (orders, 'closed');
    }

    async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
        if (type !== 'limit') {
            throw new ExchangeError (this.id + ' allows limit orders only');
        }
        await this.loadMarkets ();
        const method = 'privatePost' + this.capitalize (side);
        const market = this.market (symbol);
        amount = this.amountToPrecision (symbol, amount);
        const request = {
            'currencyPair': market['id'],
            'rate': this.priceToPrecision (symbol, price),
            'amount': amount,
        };
        // remember the timestamp before issuing the request
        const timestamp = this.milliseconds ();
        const response = await this[method] (this.extend (request, params));
        //
        //     {
        //         'orderNumber': '9805453960',
        //         'resultingTrades': [
        //             {
        //                 'amount': '200.00000000',
        //                 'date': '2019-12-15 16:04:10',
        //                 'rate': '0.00000355',
        //                 'total': '0.00071000',
        //                 'tradeID': '119871',
        //                 'type': 'buy',
        //                 'takerAdjustment': '200.00000000',
        //             },
        //         ],
        //         'fee': '0.00000000',
        //         'currencyPair': 'BTC_MANA',
        //     }
        //
        const order = this.parseOrder (this.extend ({
            'timestamp': timestamp,
            'status': 'open',
            'type': type,
            'side': side,
            'price': price,
            'amount': amount,
        }, response), market);
        const id = order['id'];
        this.orders[id] = order;
        return this.extend ({ 'info': response }, order);
    }

    async editOrder (id, symbol, type, side, amount, price = undefined, params = {}) {
        await this.loadMarkets ();
        price = parseFloat (price);
        const request = {
            'orderNumber': id,
            'rate': this.priceToPrecision (symbol, price),
        };
        if (amount !== undefined) {
            request['amount'] = this.amountToPrecision (symbol, amount);
        }
        const response = await this.privatePostMoveOrder (this.extend (request, params));
        let result = undefined;
        if (id in this.orders) {
            this.orders[id]['status'] = 'canceled';
            const newid = response['orderNumber'];
            this.orders[newid] = this.extend (this.orders[id], {
                'id': newid,
                'price': price,
                'status': 'open',
            });
            if (amount !== undefined) {
                this.orders[newid]['amount'] = amount;
            }
            result = this.extend (this.orders[newid], { 'info': response });
        } else {
            let market = undefined;
            if (symbol !== undefined) {
                market = this.market (symbol);
            }
            result = this.parseOrder (response, market);
            this.orders[result['id']] = result;
        }
        return result;
    }

    async cancelOrder (id, symbol = undefined, params = {}) {
        await this.loadMarkets ();
        let response = undefined;
        try {
            response = await this.privatePostCancelOrder (this.extend ({
                'orderNumber': id,
            }, params));
        } catch (e) {
            if (e instanceof CancelPending) {
                // A request to cancel the order has been sent already.
                // If we then attempt to cancel the order the second time
                // before the first request is processed the exchange will
                // throw a CancelPending exception. Poloniex won't show the
                // order in the list of active (open) orders and the cached
                // order will be marked as 'closed' (see #1801 for details).
                // To avoid that we proactively mark the order as 'canceled'
                // here. If for some reason the order does not get canceled
                // and still appears in the active list then the order cache
                // will eventually get back in sync on a call to `fetchOrder`.
                if (id in this.orders) {
                    this.orders[id]['status'] = 'canceled';
                }
            }
            throw e;
        }
        if (id in this.orders) {
            this.orders[id]['status'] = 'canceled';
        }
        return response;
    }

    async cancelAllOrders (symbol = undefined, params = {}) {
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['currencyPair'] = market['id'];
        }
        const response = await this.privatePostCancelAllOrders (this.extend (request, params));
        //
        //     {
        //         "success": 1,
        //         "message": "Orders canceled",
        //         "orderNumbers": [
        //             503749,
        //             888321,
        //             7315825,
        //             7316824
        //         ]
        //     }
        //
        const orderIds = this.safeValue (response, 'orderNumbers', []);
        for (let i = 0; i < orderIds.length; i++) {
            const id = orderIds[i].toString ();
            if (id in this.orders) {
                this.orders[id]['status'] = 'canceled';
            }
        }
        return response;
    }

    async fetchOpenOrder (id, symbol = undefined, params = {}) {
        await this.loadMarkets ();
        id = id.toString ();
        const response = await this.privatePostReturnOrderStatus (this.extend ({
            'orderNumber': id,
        }, params));
        //
        //     {
        //         success: 1,
        //         result: {
        //             '6071071': {
        //                 status: 'Open',
        //                 rate: '0.40000000',
        //                 amount: '1.00000000',
        //                 currencyPair: 'BTC_ETH',
        //                 date: '2018-10-17 17:04:50',
        //                 total: '0.40000000',
        //                 type: 'buy',
        //                 startingAmount: '1.00000',
        //             },
        //         },
        //     }
        //
        const result = this.safeValue (response['result'], id);
        if (result === undefined) {
            throw new OrderNotFound (this.id + ' order id ' + id + ' not found');
        }
        const order = this.parseOrder (result);
        order['id'] = id;
        this.orders[id] = order;
        return order;
    }

    async fetchOrderStatus (id, symbol = undefined, params = {}) {
        await this.loadMarkets ();
        const orders = await this.fetchOpenOrders (symbol, undefined, undefined, params);
        const indexed = this.indexBy (orders, 'id');
        return (id in indexed) ? 'open' : 'closed';
    }

    async fetchOrderTrades (id, symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'orderNumber': id,
        };
        const trades = await this.privatePostReturnOrderTrades (this.extend (request, params));
        return this.parseTrades (trades);
    }

    async createDepositAddress (code, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'currency': currency['id'],
        };
        const response = await this.privatePostGenerateNewAddress (this.extend (request, params));
        let address = undefined;
        let tag = undefined;
        if (response['success'] === 1) {
            address = this.safeString (response, 'response');
        }
        this.checkAddress (address);
        const depositAddress = this.safeString (currency['info'], 'depositAddress');
        if (depositAddress !== undefined) {
            tag = address;
            address = depositAddress;
        }
        return {
            'currency': code,
            'address': address,
            'tag': tag,
            'info': response,
        };
    }

    async fetchDepositAddress (code, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const response = await this.privatePostReturnDepositAddresses (params);
        const currencyId = currency['id'];
        let address = this.safeString (response, currencyId);
        let tag = undefined;
        this.checkAddress (address);
        const depositAddress = this.safeString (currency['info'], 'depositAddress');
        if (depositAddress !== undefined) {
            tag = address;
            address = depositAddress;
        }
        return {
            'currency': code,
            'address': address,
            'tag': tag,
            'info': response,
        };
    }

    async withdraw (code, amount, address, tag = undefined, params = {}) {
        this.checkAddress (address);
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'currency': currency['id'],
            'amount': amount,
            'address': address,
        };
        if (tag) {
            request['paymentId'] = tag;
        }
        const response = await this.privatePostWithdraw (this.extend (request, params));
        return {
            'info': response,
            'id': this.safeString (response, 'withdrawalNumber'),
        };
    }

    async fetchTransactionsHelper (code = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const year = 31104000; // 60 * 60 * 24 * 30 * 12 = one year of history, why not
        const now = this.seconds ();
        const start = (since !== undefined) ? parseInt (since / 1000) : now - 10 * year;
        const request = {
            'start': start, // UNIX timestamp, required
            'end': now, // UNIX timestamp, required
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.privatePostReturnDepositsWithdrawals (this.extend (request, params));
        //
        //     {    deposits: [ {      currency: "BTC",
        //                              address: "1MEtiqJWru53FhhHrfJPPvd2tC3TPDVcmW",
        //                               amount: "0.01063000",
        //                        confirmations:  1,
        //                                 txid: "952b0e1888d6d491591facc0d37b5ebec540ac1efb241fdbc22bcc20d1822fb6",
        //                            timestamp:  1507916888,
        //                               status: "COMPLETE"                                                          },
        //                      {      currency: "ETH",
        //                              address: "0x20108ba20b65c04d82909e91df06618107460197",
        //                               amount: "4.00000000",
        //                        confirmations:  38,
        //                                 txid: "0x4be260073491fe63935e9e0da42bd71138fdeb803732f41501015a2d46eb479d",
        //                            timestamp:  1525060430,
        //                               status: "COMPLETE"                                                            }  ],
        //       withdrawals: [ { withdrawalNumber:  8224394,
        //                                currency: "EMC2",
        //                                 address: "EYEKyCrqTNmVCpdDV8w49XvSKRP9N3EUyF",
        //                                  amount: "63.10796020",
        //                                     fee: "0.01000000",
        //                               timestamp:  1510819838,
        //                                  status: "COMPLETE: d37354f9d02cb24d98c8c4fc17aa42f475530b5727effdf668ee5a43ce667fd6",
        //                               ipAddress: "5.220.220.200"                                                               },
        //                      { withdrawalNumber:  9290444,
        //                                currency: "ETH",
        //                                 address: "0x191015ff2e75261d50433fbd05bd57e942336149",
        //                                  amount: "0.15500000",
        //                                     fee: "0.00500000",
        //                               timestamp:  1514099289,
        //                                  status: "COMPLETE: 0x12d444493b4bca668992021fd9e54b5292b8e71d9927af1f076f554e4bea5b2d",
        //                               ipAddress: "5.228.227.214"                                                                 },
        //                      { withdrawalNumber:  11518260,
        //                                currency: "BTC",
        //                                 address: "8JoDXAmE1GY2LRK8jD1gmAmgRPq54kXJ4t",
        //                                  amount: "0.20000000",
        //                                     fee: "0.00050000",
        //                               timestamp:  1527918155,
        //                                  status: "COMPLETE: 1864f4ebb277d90b0b1ff53259b36b97fa1990edc7ad2be47c5e0ab41916b5ff",
        //                               ipAddress: "211.8.195.26"                                                                }    ] }
        //
        return response;
    }

    async fetchTransactions (code = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const response = await this.fetchTransactionsHelper (code, since, limit, params);
        for (let i = 0; i < response['deposits'].length; i++) {
            response['deposits'][i]['type'] = 'deposit';
        }
        for (let i = 0; i < response['withdrawals'].length; i++) {
            response['withdrawals'][i]['type'] = 'withdrawal';
        }
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const withdrawals = this.parseTransactions (response['withdrawals'], currency, since, limit);
        const deposits = this.parseTransactions (response['deposits'], currency, since, limit);
        const transactions = this.arrayConcat (deposits, withdrawals);
        return this.filterByCurrencySinceLimit (this.sortBy (transactions, 'timestamp'), code, since, limit);
    }

    async fetchWithdrawals (code = undefined, since = undefined, limit = undefined, params = {}) {
        const response = await this.fetchTransactionsHelper (code, since, limit, params);
        for (let i = 0; i < response['withdrawals'].length; i++) {
            response['withdrawals'][i]['type'] = 'withdrawal';
        }
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const withdrawals = this.parseTransactions (response['withdrawals'], currency, since, limit);
        return this.filterByCurrencySinceLimit (withdrawals, code, since, limit);
    }

    async fetchDeposits (code = undefined, since = undefined, limit = undefined, params = {}) {
        const response = await this.fetchTransactionsHelper (code, since, limit, params);
        for (let i = 0; i < response['deposits'].length; i++) {
            response['deposits'][i]['type'] = 'deposit';
        }
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const deposits = this.parseTransactions (response['deposits'], currency, since, limit);
        return this.filterByCurrencySinceLimit (deposits, code, since, limit);
    }

    parseTransactionStatus (status) {
        const statuses = {
            'COMPLETE': 'ok',
        };
        return this.safeString (statuses, status, status);
    }

    parseTransaction (transaction, currency = undefined) {
        //
        // deposits
        //
        //     {
        //         "txid": "f49d489616911db44b740612d19464521179c76ebe9021af85b6de1e2f8d68cd",
        //         "type": "deposit",
        //         "amount": "49798.01987021",
        //         "status": "COMPLETE",
        //         "address": "DJVJZ58tJC8UeUv9Tqcdtn6uhWobouxFLT",
        //         "currency": "DOGE",
        //         "timestamp": 1524321838,
        //         "confirmations": 3371,
        //         "depositNumber": 134587098
        //     }
        //
        // withdrawals
        //
        //     {
        //         "fee": "0.00050000",
        //         "type": "withdrawal",
        //         "amount": "0.40234387",
        //         "status": "COMPLETE: fbabb2bf7d81c076f396f3441166d5f60f6cea5fdfe69e02adcc3b27af8c2746",
        //         "address": "1EdAqY4cqHoJGAgNfUFER7yZpg1Jc9DUa3",
        //         "currency": "BTC",
        //         "canCancel": 0,
        //         "ipAddress": "185.230.101.31",
        //         "paymentID": null,
        //         "timestamp": 1523834337,
        //         "canResendEmail": 0,
        //         "withdrawalNumber": 11162900
        //     }
        //
        const timestamp = this.safeTimestamp (transaction, 'timestamp');
        const currencyId = this.safeString (transaction, 'currency');
        const code = this.safeCurrencyCode (currencyId);
        let status = this.safeString (transaction, 'status', 'pending');
        let txid = this.safeString (transaction, 'txid');
        if (status !== undefined) {
            const parts = status.split (': ');
            const numParts = parts.length;
            status = parts[0];
            if ((numParts > 1) && (txid === undefined)) {
                txid = parts[1];
            }
            status = this.parseTransactionStatus (status);
        }
        const type = this.safeString (transaction, 'type');
        const id = this.safeString2 (transaction, 'withdrawalNumber', 'depositNumber');
        let amount = this.safeFloat (transaction, 'amount');
        const address = this.safeString (transaction, 'address');
        let feeCost = this.safeFloat (transaction, 'fee');
        if (feeCost === undefined) {
            // according to https://poloniex.com/fees/
            feeCost = 0; // FIXME: remove hardcoded value that may change any time
        }
        if (type === 'withdrawal') {
            // poloniex withdrawal amount includes the fee
            amount = amount - feeCost;
        }
        return {
            'info': transaction,
            'id': id,
            'currency': code,
            'amount': amount,
            'address': address,
            'tag': undefined,
            'status': status,
            'type': type,
            'updated': undefined,
            'txid': txid,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'fee': {
                'currency': code,
                'cost': feeCost,
            },
        };
    }

    nonce () {
        return this.milliseconds ();
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];
        const query = this.extend ({ 'command': path }, params);
        if (api === 'public') {
            url += '?' + this.urlencode (query);
        } else {
            this.checkRequiredCredentials ();
            query['nonce'] = this.nonce ();
            body = this.urlencode (query);
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Key': this.apiKey,
                'Sign': this.hmac (this.encode (body), this.encode (this.secret), 'sha512'),
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (code, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return;
        }
        // {"error":"Permission denied."}
        if ('error' in response) {
            const message = response['error'];
            const feedback = this.id + ' ' + body;
            this.throwExactlyMatchedException (this.exceptions['exact'], message, feedback);
            this.throwBroadlyMatchedException (this.exceptions['broad'], message, feedback);
            throw new ExchangeError (feedback); // unknown message
        }
    }

    _websocketGenerateUrlStream (events, options) {
        return options['url'];
    }

    _websocketMarketId (symbol) {
        return this.marketId (symbol).toLowerCase ();
    }

    _websocketOnOpen (contextId, websocketOptions) { // eslint-disable-line no-unused-vars
        const symbolIds = {};
        this._contextSet (contextId, 'symbolids', symbolIds);
    }

    _websocketOnMessage (contextId, data) {
        const msg = JSON.parse (data);
        // console.log("msg::",msg)
        const channelId = msg[0];
        // if channelId is not one of the above, check if it is a marketId
        const symbolsIds = this._contextGet (contextId, 'symbolids');
        const channelIdStr = channelId.toString ();
        if (channelIdStr in symbolsIds) {
            // both 'ob' and 'trade' are handled by the same execution branch
            // as on poloniex they are part of the same endpoint
            const symbol = symbolsIds[channelIdStr];
            this._websocketHandleOb (contextId, symbol, msg);
        } else if (channelIdStr === '1000') {
            // Private Channel
            this._websocketHandleOrders (contextId, msg);
        } else if (channelIdStr === '1010') {
            // Hearthbeat
            return;
        } else {
            // Some error occured
            this.emit ('err', new ExchangeError (this.id + '._websocketOnMessage() failed to get symbol for channelId: ' + channelIdStr));
            this.websocketClose (contextId);
        }
    }

    _websocketParseTrade (trade, symbol) {
        // Websocket trade format different than REST trade format
        const id = trade[1];
        const side = (trade[2] === 1) ? 'buy' : 'sell';
        const price = parseFloat (trade[3]);
        const amount = parseFloat (trade[4]);
        const timestamp = trade[5] * 1000; // ms resolution
        return {
            'id': id,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'type': undefined,
            'side': side,
            'price': price,
            'amount': amount,
        };
    }

    _websocketHandleOrders (contextId, data) {
        // return if it is only acknowledge of connection
        const mktsymbolsIds = this._contextGet (contextId, 'mktsymbolids');
        const od = this._contextGetSymbolData (contextId, 'od', 'all');
        if (od['od'] === undefined) {
            od['od'] = {};
        }
        if (data[1] === 1) {
            this.emit ('od', this._cloneOrders (od['od']));
            return;
        }
        const datareceived = data[2];
        for (let i = 0; i < datareceived.length; i++) {
            const msg = datareceived[i];
            if (msg[0] === 'b') {
                // Balance Update ==> Not use at the moment
                const l = 1;
            } else if (msg[0] === 'n') {
                // New Order : ["n", <currency pair id>, <t order number>, <order type>, "<rate>", "<amount>", "<date>"]
                const side = (msg[3] === 1) ? 'buy' : 'sell';
                const timestamp = msg[6] * 1000;
                const order = {
                    'id': msg[2],
                    'timestamp': timestamp,
                    'datetime': this.iso8601 (timestamp),
                    'status': 'open',
                    'type': 'limit',
                    'side': side,
                    'price': parseFloat (msg[4]),
                    'amount': parseFloat (msg[5]),
                    'symbol': mktsymbolsIds[msg[1]],
                    'remaining': parseFloat (msg[5]),
                    'filled': 0.0,
                    'cost': 0.0,
                    'trades': [],
                    'info': msg,
                };
                const orderid = order['id'];
                od['od'][orderid] = order;
            } else if (msg[0] === 'o') {
                const order = this._websocketReturnOrder (od['od'], msg[1], msg);
                order['remaining'] = parseFloat (msg[2]);
                if (parseFloat (order['remaining']) === 0) {
                    order['status'] = 'closed';
                }
                od['od'][msg[1]] = order;
            } else if (msg[0] === 't') {
                const order = this._websocketReturnOrder (od['od'], msg[6], msg);
                const trade = this._websocketParseTrade (msg, order['symbol']);
                order['filled'] = parseFloat (order['filled']) + parseFloat (msg[3]);
                order['cost'] = parseFloat (order['cost']) + parseFloat (msg[7]);
                order['trades'].push (trade);
                od['od'][msg[6]] = order;
            } else {
                this.emit ('err', new ExchangeError ('Message Type ' + msg[0] + ' is not handle at the moment'));
            }
        }
        this._contextSetSymbolData (contextId, 'od', 'all', od);
        this.emit ('od', this._cloneOrders (od['od']));
    }

    _websocketReturnOrder (orders, orderId, msg) {
        // Return the order if it exist or a dummy order to keep track of what we receive
        if (typeof orders[orderId] !== 'undefined') {
            return orders[orderId];
        } else {
            return {
                'id': orderId,
                'status': 'open',
                'remaining': 0.0,
                'filled': 0.0,
                'cost': 0.0,
                'trades': [],
                'info': msg,
            };
        }
    }

    _websocketHandleOb (contextId, symbol, data) {
        // Poloniex calls this Price Aggregated Book
        // let channelId = data[0];
        const sequenceNumber = data[1];
        if (data.length > 2) {
            const orderbook = data[2];
            // let symbol = this._websocketFindSymbol (channelId.toString ());
            // Check if this is the first response which contains full current orderbook
            if (orderbook[0][0] === 'i') {
                if (!this._contextIsSubscribed (contextId, 'ob', symbol)) {
                    return;
                }
                const symbolData = this._contextGetSymbolData (contextId, 'ob', symbol);
                // let currencyPair = orderbook[0][1]['currencyPair'];
                let fullOrderbook = orderbook[0][1]['orderBook'];
                const asks = [];
                const bids = [];
                let keys = [];
                let i = 0;
                keys = Object.keys (fullOrderbook[0]);
                for (i = 0; i < keys.length; i++) {
                    asks.push ([parseFloat (keys[i]), parseFloat (fullOrderbook[0][keys[i]])]);
                }
                keys = Object.keys (fullOrderbook[1]);
                for (i = 0; i < keys.length; i++) {
                    bids.push ([parseFloat (keys[i]), parseFloat (fullOrderbook[1][keys[i]])]);
                }
                fullOrderbook = {
                    'asks': asks,
                    'bids': bids,
                    'isFrozen': 0,
                    'seq': sequenceNumber,
                };
                // I decided not to push the initial orderbook to cache.
                // This way is less consistent but I think it's easier.
                fullOrderbook = this.parseOrderBook (fullOrderbook);
                fullOrderbook = this._cloneOrderBook (fullOrderbook, symbolData['limit']);
                fullOrderbook['obLastSequenceNumber'] = sequenceNumber;
                symbolData['ob'] = fullOrderbook;
                this._contextSetSymbolData (contextId, 'ob', symbol, symbolData);
                this.emit ('ob', symbol, symbolData['ob']);
            } else {
                let order = undefined;
                let orderbookDelta = {
                    'asks': [],
                    'bids': [],
                    'seq': sequenceNumber,
                };
                let price = 0.0;
                let amount = 0.0;
                let i = 0;
                for (i = 0; i < orderbook.length; i++) {
                    order = orderbook[i];
                    if (order[0] === 'o') {
                        price = parseFloat (order[2]);
                        amount = parseFloat (order[3]);
                        if (order[1] === 0) {
                            // sell order
                            orderbookDelta['asks'].push ([price, amount]);
                        } else if (order[1] === 1) {
                            // buy order
                            orderbookDelta['bids'].push ([price, amount]);
                        } else {
                            // error
                            this.emit ('err', new ExchangeError (this.id + '._websocketHandleOb() unknown value in buy/sell field. Expected 0 or 1 but got: ' + order[1]));
                            this.websocketClose (contextId);
                            return;
                        }
                    } else if (order[0] === 't') {
                        // this is not an order but a trade
                        if (this._contextIsSubscribed (contextId, 'trade', symbol)) {
                            const trade = this._websocketParseTrade (order, symbol);
                            this.emit ('trade', symbol, trade);
                        }
                        continue;
                    } else {
                        // unknown value
                        this.emit ('err', new ExchangeError (this.id + '._websocketHandleOb() unknown value in order/trade field. Expected \'o\' or \'t\' but got: ' + order[0]));
                        this.websocketClose (contextId);
                        return;
                    }
                }
                if (!this._contextIsSubscribed (contextId, 'ob', symbol)) {
                    return;
                }
                // Add to cache
                orderbookDelta = this.parseOrderBook (orderbookDelta);
                const symbolData = this._contextGetSymbolData (contextId, 'ob', symbol);
                if (typeof (symbolData['obDeltaCache']) === 'undefined') {
                    // This check is necessary because the obDeltaCache will be deleted on a call to fetchOrderBook()
                    symbolData['obDeltaCache'] = {}; // make empty cache
                    symbolData['obDeltaCacheSize'] = 0; // counting number of cached deltas
                }
                symbolData['obDeltaCacheSize'] += 1;
                const sequenceNumberStr = sequenceNumber.toString ();
                symbolData['obDeltaCache'][sequenceNumberStr] = orderbookDelta;
                // Schedule call to _websocketOrderBookDeltaCache()
                this._websocketHandleObDeltaCache (contextId, symbol);
                this.emit ('ob', symbol, symbolData['ob']);
            }
        }
    }

    _websocketHandleObDeltaCache (contextId, symbol) {
        const symbolData = this._contextGetSymbolData (contextId, 'ob', symbol);
        // Handle out-of-order sequenceNumber
        // To avoid a memory leak, we must put a maximum on the size of obDeltaCache.
        // When this maximum is reached, we accept that we have lost some orderbook updates.
        // In this case we must fetch a new orderbook.
        // Alternatively, we could apply all cached deltas and keep going.
        if (symbolData['obDeltaCacheSize'] > symbolData['obDeltaCacheSizeMax']) {
            symbolData['ob'] = this.fetchOrderBook (symbol, symbolData['limit']);
            // delete symbolData['obDeltaCache'];
            symbolData['obDeltaCache'] = undefined;
            symbolData['obDeltaCacheSize'] = 0;
            this._contextSetSymbolData (contextId, 'ob', symbol, symbolData);
            return;
        }
        if (symbolData['obDeltaCacheSize'] === 0) {
            this._contextSetSymbolData (contextId, 'ob', symbol, symbolData);
            return;
        }
        // if the cache exists
        // check if the next sequenceNumber is in the cache
        let fullOrderbook = symbolData['ob'];
        const lastSequenceNumber = fullOrderbook['obLastSequenceNumber'];
        let cachedSequenceNumber = lastSequenceNumber + 1;
        const cachedSequenceNumberStr = cachedSequenceNumber.toString ();
        let orderbookDelta = symbolData['obDeltaCache'][cachedSequenceNumberStr];
        let continueBool = typeof orderbookDelta !== 'undefined';
        // While loop is not transpiled properly
        // while (continueBool) {
        const nkeys = symbolData['obDeltaCacheSize'];
        let i = 0;
        for (i = 0; i < nkeys; i++) {
            if (!continueBool) {
                break;
            }
            symbolData['obDeltaCache'][cachedSequenceNumberStr] = undefined;
            fullOrderbook = this.mergeOrderBookDelta (symbolData['ob'], orderbookDelta);
            fullOrderbook = this._cloneOrderBook (fullOrderbook, symbolData['limit']);
            fullOrderbook['obLastSequenceNumber'] = cachedSequenceNumber;
            symbolData['ob'] = fullOrderbook;
            cachedSequenceNumber += 1;
            orderbookDelta = symbolData['obDeltaCache'][cachedSequenceNumberStr];
            continueBool = typeof orderbookDelta !== 'undefined';
            symbolData['obDeltaCacheSize'] -= 1;
        }
        this._contextSetSymbolData (contextId, 'ob', symbol, symbolData);
    }

    _websocketSubscribeOb (contextId, event, symbol, nonce, params = {}) {
        const symbolData = this._contextGetSymbolData (contextId, 'ob', symbol);
        symbolData['limit'] = this.safeInteger (params, 'limit', undefined);
        symbolData['obDeltaCache'] = undefined;
        symbolData['obDeltaCacheSize'] = 0;
        symbolData['obDeltaCacheSizeMax'] = this.safeInteger (params, 'obDeltaCacheSizeMax', 10);
        this._contextSetSymbolData (contextId, 'ob', symbol, symbolData);
        // get symbol id2
        // let market = this.marketId (symbol);
        if (!this._contextIsSubscribed (contextId, 'trade', symbol)) {
            const market = this.findMarket (symbol);
            let symbolsIds = this._contextGet (contextId, 'symbolids');
            if (typeof symbolsIds === 'undefined') {
                symbolsIds = {};
            }
            symbolsIds[market['id2']] = symbol;
            this._contextSet (contextId, 'symbolids', symbolsIds);
            const payload = {
                'command': 'subscribe',
                'channel': market['id'],
            };
            this.websocketSendJson (payload);
        }
        const nonceStr = nonce.toString ();
        this.emit (nonceStr, true);
    }

    _websocketSubscribeTrade (contextId, event, symbol, nonce, params = {}) {
        if (!this._contextIsSubscribed (contextId, 'ob', symbol)) {
            const market = this.findMarket (symbol);
            const symbolsIds = this._contextGet (contextId, 'symbolids');
            symbolsIds[market['id2']] = symbol;
            this._contextSet (contextId, 'symbolids', symbolsIds);
            const payload = {
                'command': 'subscribe',
                'channel': market['id'],
            };
            this.websocketSendJson (payload);
        }
        const nonceStr = nonce.toString ();
        this.emit (nonceStr, true);
    }

    async _websocketRegisterMktSymbol (contextId) {
        const market = await this.fetchMarkets ();
        const mktsymbolsIds = {};
        for (let i = 0; i < market.length; i++) {
            mktsymbolsIds[market[i]['id2']] = market[i]['symbol'];
        }
        this._contextSet (contextId, 'mktsymbolids', mktsymbolsIds);
    }

    async _websocketRegisterCurSymbol (contextId) {
        const currencies = this.fetchCurrencies ();
        const ids = Object.keys (currencies);
        const cursymbolsIds = {};
        for (let i = 0; i < ids.length; i++) {
            const currency = currencies[ids[i]];
            cursymbolsIds[currency['info']['id']] = currency['id'];
        }
        this._contextSet (contextId, 'cursymbolids', cursymbolsIds);
    }

    _websocketSubscribeOrders (contextId, event, nonce, params = {}) {
        if (!this._contextIsSubscribed (contextId, 'ob', 'all')) {
            const data = this._contextGetSymbolData (contextId, event, 'all');
            data['od'] = undefined;
            this._contextSetSymbolData (contextId, event, 'all', data);
            // Setup Market Conversion table
            this._websocketRegisterMktSymbol (contextId);
            // Setup Currency Conversion Table
            this._websocketRegisterCurSymbol (contextId);
            const payload = {
                'command': 'subscribe',
                'channel': 1000,
                'key': this.apiKey,
                'payload': 'nonce=' + nonce,
                'sign': this.hmac (this.encode ('nonce=' + nonce), this.encode (this.secret), 'sha512'),
            };
            this.websocketSendJson (payload);
        }
        const nonceStr = nonce.toString ();
        this.emit (nonceStr, true);
    }

    _websocketSubscribe (contextId, event, symbol, nonce, params = {}) {
        if (event === 'ob') {
            this._websocketSubscribeOb (contextId, event, symbol, nonce, params);
        } else if (event === 'trade') {
            this._websocketSubscribeTrade (contextId, event, symbol, nonce, params);
        } else if (event === 'od') {
            this._websocketSubscribeOrders (contextId, event, nonce, params);
        } else {
            throw new NotSupported ('subscribe ' + event + '(' + symbol + ') not supported for exchange ' + this.id);
        }
    }

    _websocketUnsubscribeOb (conxid, event, symbol, nonce, params) {
        if (!this._contextIsSubscribed (conxid, 'trade', symbol)) {
            const market = this.marketId (symbol);
            const payload = {
                'command': 'unsubscribe',
                'channel': market,
            };
            this.websocketSendJson (payload);
        }
        const nonceStr = nonce.toString ();
        this.emit (nonceStr, true);
    }

    _websocketUnsubscribeTrade (conxid, event, symbol, nonce, params) {
        if (!this._contextIsSubscribed (conxid, 'ob', symbol)) {
            const market = this.marketId (symbol);
            const payload = {
                'command': 'unsubscribe',
                'channel': market,
            };
            this.websocketSendJson (payload);
        }
        const nonceStr = nonce.toString ();
        this.emit (nonceStr, true);
    }

    _websocketUnsubscribe (conxid, event, symbol, nonce, params) {
        if (event === 'ob') {
            this._websocketUnsubscribeOb (conxid, event, symbol, nonce, params);
        } else if (event === 'trade') {
            this._websocketUnsubscribeTrade (conxid, event, symbol, nonce, params);
        } else {
            throw new NotSupported ('subscribe ' + event + '(' + symbol + ') not supported for exchange ' + this.id);
        }
    }

    _getCurrentWebsocketOrderbook (contextId, symbol, limit) {
        const data = this._contextGetSymbolData (contextId, 'ob', symbol);
        if (('ob' in data) && (typeof data['ob'] !== 'undefined')) {
            return this._cloneOrderBook (data['ob'], limit);
        }
        return undefined;
    }

    _getCurrentOrders (contextId, orderid) {
        const data = this._contextGetSymbolData (contextId, 'od', 'all');
        if ('od' in data && typeof data['od'] !== 'undefined') {
            return this._cloneOrders (data['od'], orderid);
        }
        return undefined;
    }
};
