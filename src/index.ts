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
  //     "/v1/trade/trades",
  //     "GET",
  //     {
  //       base,
  //       quote,
  //     },
  //     false
  //   );
  // }

  async orderbook({ base, quote }: { base: string; quote: string }) {
    return this._call({
      endpoint: "/v1/trade/orderbook",
      method: "GET",
      params: {
        base,
        quote,
      },
    });
  }

  async ticker({ base, quote }: { base: string; quote: string }) {
    return this._call({
      endpoint: "/v1/trade/ticker",
      method: "GET",
      params: { base, quote },
    });
  }

  // async myTrades(params) {
  //   params = await Schemas.myTradesSchema.validateAsync(params);
  //   return this._call("/v1/myTrades", "GET", {}, true);
  // }

  async cancelOrder({ orderId }) {
    return this._call({
      endpoint: `/v1/trade/orders/${orderId}`,
      method: "DELETE",
      auth: true,
    });
  }

  async getOrder({ orderId }) {
    return this._call({
      endpoint: `/v1/trade/orders/${orderId}`,
      method: "GET",
      auth: true,
    });
  }

  async placeOrder({
    base,
    quote,
    price,
    amount,
    side,
  }: {
    base: string;
    quote: string;
    price: number;
    amount: number;
    side: "ask" | "bid";
  }) {
    return this._call({
      endpoint: "/v1/trade/orders",
      method: "POST",
      params: {
        base,
        quote,
        price,
        amount,
        side,
      },
      auth: true,
    });
  }

  async balance() {
    return this._call({
      endpoint: "/v1/account/balances",
      method: "GET",
      auth: true,
    });
  }

  async _call({
    endpoint,
    method,
    params,
    auth,
  }: {
    endpoint: string;
    method: AxiosRequestConfig["method"];
    params?: object;
    auth?: boolean;
  }) {
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
        config.headers = {};
        config.headers.authorization = this.key;
      }

      const { data } = await axios(config);
      return data;
    } catch (error) {
      throw error?.response?.data?.message || error?.response?.data || error;
    }
  }
}
