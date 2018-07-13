var commonMethod = require('./src/utils/commonMethod.js');
var apiMethod = require('./src/utils/apiMethod.js');
var Decimal = require('Decimal.js')

let targetSymbol = 'ICC_ETH'
let tagetCurrency = 'ICC'
let useCurrent = 'ETH';
let myStartBDBAssets = '5288.658803977613';


(async function() {
  for (let i = 0; i < 100; i++) {
    try {
      await createOrder(targetSymbol)
      let myCurrentBDBAssets = await getMyBDBAssets()
      let BDBcost = commonMethod.accSub(myStartBDBAssets, myCurrentBDBAssets[0])


      console.warn(`共花费${BDBcost}BDB`)
      console.warn('此次刷单结束！')
    } catch (e) {
      console.warn('捕捉到了错误！', e)
      await cancelAll()
      continue
    }
  }
})()

async function createOrder(symbol) {
  let buyAndSalePrice = await commonMethod.getLatelyBuyAndSalePrice(symbol)


  // let targetPrice = commonMethod.getAverage(buyAndSalePrice[0].price, buyAndSalePrice[1].price)
  let priceDiff = commonMethod.accMul(commonMethod.accSub(buyAndSalePrice[1].price, buyAndSalePrice[0].price), 1 / 4)

  let targetPrice = commonMethod.accAdd(buyAndSalePrice[0].price, commonMethod.accMul(priceDiff, 3))

  do {
    let upFloat = commonMethod.accMul(Math.random(), priceDiff)
    targetPrice = commonMethod.accAdd(upFloat, targetPrice)
  } while (targetPrice > buyAndSalePrice[1].price)



  console.log(`${targetSymbol}市场最高买单价格为:${buyAndSalePrice[0].price} 最低卖单价格为:${buyAndSalePrice[1].price} 挂单的目标价格为${targetPrice}`)

  await commonMethod.createSaleOrder(targetPrice, 2000, symbol)

  await commonMethod.sleep(5)

  await commonMethod.createBuyOrder(targetPrice, 2000, symbol)

  await commonMethod.sleep(200)


  await cancelAll()

  console.warn('已成交')
}



async function cancelAll() {
  let myAllOrder = await commonMethod.findAllOrder()
  let cancelReady
  if (myAllOrder.length > 0) {
    cancelReady = await commonMethod.cancelAppointedOrder(myAllOrder)
    console.warn(`取消了${myAllOrder.length}个订单！成功状态为：${cancelReady}`)
    return cancelReady
  }
}


async function getMyBDBAssets() {
  return await commonMethod.getSpecifiedAccount('BDB')
}
