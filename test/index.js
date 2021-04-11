const Gracchi = require("../dist").default;

const base = "BNB",
  quote = "CBRL";

const api = new Gracchi({
  key: process.env.GRACCHI_KEY,
  url: "https://cex-api-staging.coinsamba.com",
});

function delay(interval) {
  return it("should delay", (done) => {
    setTimeout(() => done(), interval);
  }).timeout(interval + 100); // The extra 100ms should guarantee the test will not fail due to exceeded timeout
}

describe("account", () => {
  it("should receive balances", async () => {
    await api.balance();
  });
});

describe("market", () => {
  it("should receive orderbook", async () => {
    await api.orderbook({ base, quote });
  });

  it("should receive ticker", async () => {
    await api.ticker({ base, quote });
  });
});

describe("order flow", () => {
  let orderId = "";

  it("should place order", (done) => {
    api
      .placeOrder({
        base,
        quote,
        price: 99999,
        amount: 1,
        side: "ask",
      })
      .then((res) => {
        orderId = res.orderId;
        done();
      });
  });

  delay(1000);

  it("should receive order", (done) => {
    api.getOrder({ orderId }).then(() => done());
  });

  it("should cancel order", (done) => {
    api.cancelOrder({ orderId }).then(() => done());
  });
});
