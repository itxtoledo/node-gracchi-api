const Gracchi = require("../dist").default;
require('dotenv').config()
var expect = require('chai').expect
  , foo = 'bar'
  , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };


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
    const balance = await api.balance();
    balance.forEach(body => {
      expect(body).to.have.all.keys('name', 'deposit', 'available', 'onHold', 'symbol', 'withdrawal')
    });
  });
});

describe("market", () => {
  it("should receive orderbook", async () => {
    await api.orderbook({ base, quote }).then((res) => {
      expect(res).to.have.all.keys('asks', 'bids')    
    })

  });

  it("should receive ticker", async () => {
    const ticker = await api.ticker({ base, quote }).then((res) => {
      expect(res).to.have.all.keys('base', 'quote', 'change', 'last', 'vol', 'high', 'low', 'ask', 'bid', 'askAmount', 'bidAmount')
      expect(res.base).to.be.equal(base)
      expect(res.quote).to.be.equal(quote)
    })
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
    api.getOrder({ orderId }).then((res) => {
      expect(res).to.have.all.keys('status', 'averagePrice', 'filledAmount', '_id', 'base', 'quote', 'side', 'price', 'originalAmount', 'remainingAmount', 'fee')
      expect(res._id).to.be.equal(orderId)
      done()
    });
  });

  it("should cancel order", (done) => {
    api.cancelOrder({ orderId }).then((res) => {
      expect(res.orderId).to.be.equal(orderId)
      done()
    });
  });
});
