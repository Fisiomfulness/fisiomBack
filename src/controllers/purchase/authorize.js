const axios = require('axios');

const { NIUBIZ_MERCHANT_ID,
        NIUBIZ_TRANSACTION_AUTORIZATION_ENDPOINT,
        } = require('../../config/envConfig');
const Purchase = require('../../models/purchase/Purchase');
const Transaction = require('../../models/purchase/Transaction');

const authorize = async (req, res) => {
 

    const userId = req.user.id;
    const transactionToken = req.body.transactionToken;
    const record = await Purchase.findOne({ purchaseNumber: req.query.purchaseNumber });

  let response;
  
  try {
    response = await axios.post(
      `${NIUBIZ_TRANSACTION_AUTORIZATION_ENDPOINT}/${NIUBIZ_MERCHANT_ID}`,
      {
        channel: 'web',
        captureType: "manual",
        order: {
          tokenId: transactionToken,
          purchaseNumber: req.query.purchaseNumber,
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

    // Create and save the new transaction

    const newTransaction = new Transaction({
      _userId: userId,
      purchaseNumber: record.purchaseNumber,
      amount: record.amount,
      currency: response.data.order.currency,
      authorizedAmount: response.data.order.authorizedAmount,
      authorizationCode: response.data.order.authorizationCode,
      actionCode: response.data.order.actionCode,
      traceNumber: response.data.order.traceNumber,
      transactionDate: response.data.order.transactionDate,
      transactionId: response.data.order.transactionId,
      cardType: response.data.dataMap?.CARD_TYPE,
      eci_description: response.data.dataMap?.ECI_DESCRIPTION,
      status: response.data.dataMap?.STATUS,
      actionDescription: response.data.dataMap?.ACTION_DESCRIPTION,
      brand: response.data.dataMap?.BRAND
    });


    await newTransaction.save();
    const transaction = await Transaction.findOne({ purchaseNumber: req.query.purchaseNumber });

    res.status(200).json({
      success: true,                  // Indicating the operation was successful
      message: "Data fetched successfully", // Optional message
      data: transaction,                     // Data stored
      status: 200                     // The status code of the response
    });

  } catch (error) {
    if (error.status === 400) {
      res.send(`Transaction error, please try again.\n${record}`);
    } else {
      console.log(error)
      res.status(500).send('An unexpected error occurred.');
    }
  }
};

module.exports = {
  authorize
};
