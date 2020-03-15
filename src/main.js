import axios from "axios";
import * as Schemas from "./schemas.js";

const SERVER_ADDRESS = "localhost:3000/api";

export default class Gracchi {
  async constructor(config) {
    const args = await Schemas.constructorSchema.validateAsync(config);
    this.key = args.key;
  }

  async trades(params) {
    params = await Schemas.tradesSchema.validateAsync(params);
    return this._call(
      "/v1/trades",
      "GET",
      {
        pair: params.pair
      },
      false
    );
  }

  async orderbook(params) {
    params = await Schemas.orderbookSchema.validateAsync(params);
    return this._call(
      "/v1/orderbook",
      "GET",
      {
        pair: params.pair
      },
      false
    );
  }

  async kline(params) {
    params = await Schemas.klineSchema.validateAsync(params);
    return this._call(
      "/v1/kline",
      "GET",
      {
        pair: params.pair,
        timeframe: params.timeframe
      },
      false
    );
  }

  async ticker(params) {
    params = await Schemas.tickerSchema.validateAsync(params);
    return this._call(
      "/v1/ticker",
      "GET",
      {
        pair: params.pair
      },
      false
    );
  }

  // async myTrades(params) {
  //   params = await Schemas.myTradesSchema.validateAsync(params);
  //   return this._call("/v1/myTrades", "GET", {}, true);
  // }

  async cancelOrder(params) {
    params = await Schemas.cancelOrderSchema.validateAsync(params);
    return this._call(
      "/v1/cancelOrder",
      "POST",
      {
        orderId: params.orderId
      },
      true
    );
  }

  async getOrder(params) {
    params = await Schemas.getOrderSchema.validateAsync(params);
    return this._call(
      "/v1/getOrder",
      "GET",
      {
        orderId: params.orderId
      },
      true
    );
  }

  async placeOrder(params) {
    params = await Schemas.placeOrderSchema.validateAsync(params);
    return this._call(
      "/v1/placeOrder",
      "POST",
      {
        pair: params.pair,
        side: params.side,
        price: params.price,
        amount: params.amount
      },
      true
    );
  }

  async balance() {
    return this._call("/v1/balance", "GET", {}, true);
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
