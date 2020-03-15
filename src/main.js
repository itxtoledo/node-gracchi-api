import axios from "axios";
import * as Schemas from "./schemas.js";

const SERVER_ADDRESS = "localhost";

export default class Gracchi {
  async constructor(config) {
    const args = await Schemas.constructorSchema.validateAsync(config);
    this.key = args.key;
  }

  // async myTrades(params) {
  //   params = await Schemas.myTradesSchema.validateAsync(params);
  //   return this._call("/api/v1/myTrades", "GET", {}, true);
  // }

  // async trades(params) {
  //   params = await Schemas.tradesSchema.validateAsync(params);
  //   return this._call("/api/v1/trades", "GET", {}, false);
  // }

  // async ticker(params) {
  //   params = await Schemas.tickerSchema.validateAsync(params);
  //   return this._call("/api/v1/ticker", "GET", {}, false);
  // }

  // async kline(params) {
  //   params = await Schemas.klineSchema.validateAsync(params);
  //   return this._call("/api/v1/kline", "GET", {}, false);
  // }

  // async orderbook(params) {
  //   params = await Schemas.orderbookSchema.validateAsync(params);
  //   return this._call("/api/v1/orderbook", "GET", {}, false);
  // }

  async cancelOrder(params) {
    params = await Schemas.cancelOrderSchema.validateAsync(params);
    return this._call("/api/v1/cancelOrder", "POST", {}, true);
  }

  async getOrder(params) {
    params = await Schemas.getOrderSchema.validateAsync(params);
    return this._call("/api/v1/getOrder", "GET", {}, false);
  }

  async placeOrder(params) {
    params = await Schemas.placeOrderSchema.validateAsync(params);
    return this._call("/api/v1/placeOrder", "POST", {}, true);
  }

  // async balance() {
  //   return this._call("/api/v1/balance", "POST", {}, true);
  // }

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
        config.headers.Authentication = this.key;
      }

      const { data } = axios(config);
      return data.response;
    } catch (error) {
      if (error.response) {
        if (error.response.data.message) throw error.response.data.message;
        throw error.response.data;
      }
      throw error;
    }
  }
}
