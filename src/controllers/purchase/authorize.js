const axios = require('axios');
const { NIUBIZ_MERCHANT_ID, NIUBIZ_TRANSACTION_AUTORIZATION_ENDPOINT} = require('../../config/envConfig');
const Purchase = require('../../models/purchase/Purchase');

const authorize = async (req, res) => {
  const transactionToken = req.body.transactionToken

  const record = await Purchase.findOne({ transactionID: req.query.transactionID });
  console.log('esto es record', record)
  
  const response = await axios.post(
    `${NIUBIZ_TRANSACTION_AUTORIZATION_ENDPOINT}/${NIUBIZ_MERCHANT_ID}`,
    {
      channel: 'web',
      captureType: "manual",
      order: {
        tokenId: transactionToken,
        purchaseNumber: record.transactionID,
        amount: record.amount,
        currency: "PEN"
      },
      datamap: {
        urlAddress: "",
        serviceLocationCityName: "",
        serviceLocationCountrySubdivisionCode: "",
        serviceLocationCountryCode: "",
        serviceLocationPostalCode: ""
      }
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${record.accessToken}`
      }
    }
  );
  res.json(response.data);
};

module.exports = {
  authorize
};