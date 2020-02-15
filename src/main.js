import axios from "axios";
import crypto from "crypto";
import * as Schemas from "./schemas.js";

const SERVER_ADDRESS = "localhost";

export default class Gracchi {
  async constructor(config) {
    const args = await Schemas.constructorSchema.validateAsync(config);
    this.secret = args.secret;
    this.key = args.key;
  }

  myTrades(params) {
    params = await Schemas.myTradesSchema.validateAsync(params);
    return this._call("/api/v1/myTrades", "GET", {}, true);
  }

  trades(params) {
    params = await Schemas.tradesSchema.validateAsync(params);
    return this._call("/api/v1/trades", "GET", {}, false);
  }

  ticker(params) {
    params = await Schemas.tickerSchema.validateAsync(params);
    return this._call("/api/v1/ticker", "GET", {}, false);
  }

  kline(params) {
    params = await Schemas.klineSchema.validateAsync(params);
    return this._call("/api/v1/kline", "GET", {}, false);
  }

  orderbook(params) {
    params = await Schemas.orderbookSchema.validateAsync(params);
    return this._call("/api/v1/orderbook", "GET", {}, false);
  }

  cancelOrder(params) {
    params = await Schemas.orderSchema.validateAsync(params);
    return this._call("/api/v1/cancelOrder", "POST", {}, true);
  }

  getOrder(params) {
    params = await Schemas.getOrderSchema.validateAsync(params);
    return this._call("/api/v1/getOrder", "GET", {}, false);
  }

  placeOrder(params) {
    params = await Schemas.placeOrderSchema.validateAsync(params);
    return this._call("/api/v1/placeOrder", "POST", {}, true);
  }

  balance() {
    return this._call("/api/v1/balance", "POST", {}, true);
  }

  _sign(params) {
    const hashBuffer = Buffer.from(
      JSON.stringify(params, Object.keys(params).sort())
    ).toString("base64");

    return crypto
      .createHmac("sha256", this.secret)
      .update(hashBuffer)
      .digest("hex");
  }

  async _call(endpoint, method, params = {}, auth = false) {
    try {
      const config = {
        method: method,
        url: `${SERVER_ADDRESS}${endpoint}`
      };

      if (method === "GET") {
        config.params = params;
      } else {
        config.data = params;
      }

      if (auth) {
        params.until = Date.now() + 5000;
        config.headers.sign = this._sign(params);
        config.headers.key = this.key;
      }

      const { data } = axios(config);
      return data.response;
    } catch (error) {}
  }
}
