var commonMethod = require('./src/utils/commonMethod.js');
var apiMethod = require('./src/utils/apiMethod.js');
var Decimal = require('Decimal.js');


(async function() {
    let BDBAssets = await getMyBDBAssets()
    console.warn(`我的BDB资产为:${BDBAssets[0]}可用，${BDBAssets[1]}冻结`);
  })()





async function getMyBDBAssets() {
  return await commonMethod.getSpecifiedAccount('BDB')
}
