export = Gracchi;

declare class Gracchi {
  constructor(options?: Gracchi.constructorOptions);
  /** return ticker for specified pair */
  ticker(options?: Gracchi.tickerOptions): Promise<Gracchi.tickerResult>;
  /** return all tickers */
  summaries(): Promise<Gracchi.tickerResult[]>;
  /** return all fees */
  fees(): Promise<Gracchi.feesResult>;
  /** return all balances */
  balance(): Promise<Gracchi.AssetBalance[]>;
  /** returns recent 50 trades of pair */
  trades(options: Gracchi.tradesOptions): Promise<Gracchi.tradesResult[]>;
  /** place an order */
  placeOrder(
    options: Gracchi.placeOrderOptions
  ): Promise<Gracchi.placeOrderResult>;
}

declare namespace Gracchi {
  enum KlineInterval {
    ONE_MINUTE = "1m",
    THREE_MINUTES = "3m",
    FIVE_MINUTES = "5m",
    FIFTEEN_MINUTES = "15m",
    THIRTY_MINUTES = "30m",
    ONE_HOUR = "1h",
    TWO_HOURS = "2h",
    FOUR_HOURS = "4h",
    SIX_HOURS = "6h",
    EIGHT_HOURS = "8h",
    TWELVE_HOURS = "12h",
    ONE_DAY = "1d",
    THREE_DAYS = "3d",
    ONE_WEEK = "1w",
    ONE_MONTH = "1M"
  }

  /** ask mean sell order and bid is a buy order */
  type OrderSide = "ask" | "bid";
  /** string with containing a number */
  type NumberAsString = String;

  /** object with balance */
  interface AssetBalance {
    asset: String;
    free: String;
    locked: String;
  }

  interface constructorOptions {
    key: String<256>;
    secret: String<256>;
  }

  interface tradesOptions {
    pair: String;
  }

  interface placeOrderOptions {
    pair: String;
    side: OrderSide;
    price: NumberAsString;
    amount: NumberAsString;
  }

  interface placeOrderResult {
    orderId: String;
  }

  interface tickerResult {
    pair: String;
    vol: NumberAsString;
    low: NumberAsString;
    high: NumberAsString;
    last: NumberAsString;
    ask: NumberAsString;
    bid: NumberAsString;
  }

  interface tradesResult {
    date: NumberAsString;
    amount: String;
    total: String;
    op: op;
  }

  interface KlineResult {
    timeframe: KlineInterval;
  }

  interface confirmOfferResult {
    confirmedAt: Date;
    baseAmount: NumberAsString;
    quoteAmount: NumberAsString;
    efPrice: NumberAsString;
    offerId: String;
    orderPrice: NumberAsString;
    op: op;
  }
}
