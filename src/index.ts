import axios, { AxiosRequestConfig } from "axios";

export default class Gracchi {
  key: string;
  url: string;

  constructor({ key, url }: { key: string; url: string }) {
    this.key = key;
    this.url = url;
  }

  // async trades({ base, quote }: { base: string; quote: string }) {
  //   return this._call(
  //     "/v1/trades",
  //     "GET",
  //     {
  //       base,
  //       quote,
  //     },
  //     false
  //   );
  // }

  async orderbook({ base, quote }: { base: string; quote: string }) {
    return this._call(
      "/v1/orderbook",
      "GET",
      {
        base,
        quote,
      },
      false
    );
  }

  async ticker({ base, quote }: { base: string; quote: string }) {
    return this._call("/v1/ticker", "GET", { base, quote }, false);
  }

  // async myTrades(params) {
  //   params = await Schemas.myTradesSchema.validateAsync(params);
  //   return this._call("/v1/myTrades", "GET", {}, true);
  // }

  async cancelOrder({ orderId }) {
    return this._call(`/v1/trade/orders/${orderId}`, "DELETE", null, true);
  }

  async getOrder({ orderId }) {
    return this._call(`/v1/trade/orders/${orderId}`, "GET", null, true);
  }

  async placeOrder({ base, quote, price, amount, side }) {
    return this._call(
      "/v1/trade/orders",
      "POST",
      {
        base,
        quote,
        price,
        amount,
        side,
      },
      true
    );
  }

  async balance() {
    return this._call("/v1/account/balances", "GET", null, true);
  }

  async _call(
    endpoint: string,
    method: AxiosRequestConfig["method"],
    params = {},
    auth = false
  ) {
    try {
      const config: AxiosRequestConfig = {
        method: method,
        url: `${this.url}${endpoint}`,
      };

      if (method === "GET") {
        config.params = params;
      } else if (method === "POST" || method === "PATCH") {
        config.data = params;
      }

      if (auth) {
        config.headers.authentication = this.key;
      }

      const { data } = await axios(config);
      return data.response;
    } catch (error) {
      throw error?.response?.data?.message || error?.response?.data || error;
    }
  }
}
