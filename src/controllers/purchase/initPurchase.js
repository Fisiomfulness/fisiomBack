const Purchase = require('../../models/purchase/Purchase');
const { NIUBIZ_MERCHANT_ID, NIUBIZ_CHECKOUT_ENDPOINT } = require('../../config/envConfig');
const { fetchAccessToken, fetchSessionKey } = require('../../services/niubizServices');

const initPurchase = async (req, res) => {
  try {
    const { total, productsMap } = req.body;

    // genero el ID acá, no lo mando del front para evitar manipulaciones / interpreto que después en la respuesta de la transacción podés buscar este número
    const transactionID = Math.floor(100000000000 + Math.random() * 900000000000);

    const newPurchase = new Purchase({
      _userId: req.user?.id,
      transactionID: transactionID,
      purchaseData: productsMap,
      amount: total
    })

    const payload = {
      channel: 'web',
      antifraud: {
        clientIp: '24.212.107.30',
        // The list of MDDs to be considered will be delivered by the integration team,
        // please contact integraciones.niubiz@necomplus.com with your Commercial Code / RUC / Company name
        // with the subject MDDs query
        merchantDefineData: { 
          MDD15:"Valor MDD 15",
          MDD20:"Valor MDD 20",
          MDD33:"Valor MDD 33"
        }      
      },
      dataMap: {
        cardholderCity: req.body.cardholderCity || "",
        cardholderCountry: req.body.cardholderCountry || "",
        cardholderAddress: req.body.cardholderAddress || "",
        cardholderPostalCode: req.body.cardholderPostalCode || "",
        cardholderState: req.body.cardholderState || "",
        cardholderPhoneNumber: req.body.cardholderPhoneNumber || ""
      },
      amount: total,
      merchantId: NIUBIZ_MERCHANT_ID
    };
    
    await newPurchase.save()

    let accessToken, sessionKey;
    try {
    
        // Fetch access token
        accessToken = await fetchAccessToken();  
        
        // Fetch session key
        sessionKey = await fetchSessionKey(accessToken, payload);
        
      } catch (error) {
        // next(error); // Error handling middleware
        console.log(error)
      }
  
      
      const payload2front = {         
        sessiontoken: sessionKey,
        channel: "web",
        merchantid: NIUBIZ_MERCHANT_ID,
        purchasenumber: transactionID,
        amount: total,
        merchantname: "FISIOM FULNESS",
        expirationminutes: "20",
        timeouturl: "about:blank",
        merchantlogo: "fisiom.png",
        formbuttoncolor: "#000000",
        action: '/purchases/renderPaymentResult',    
        }


        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Visanet Checkout</title>
        </head>
        <body>
          <script src="https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true" defer></script>
          <script>
    
            function openForm() {
              VisanetCheckout.configure({
                sessiontoken: "${sessionKey}",
                channel: "${payload.channel}",
                merchantid: "${NIUBIZ_MERCHANT_ID}",
                purchasenumber: ${transactionID},
                amount: ${total},
                merchantname: "FISIOM FULNES",
                expirationminutes: "20",
                timeouturl: "about:blank",
                merchantlogo: "fisiom.png",
                formbuttoncolor: "#000000",
                action: '/purchases/renderPaymentResult'
              });
              VisanetCheckout.open();
            }
    
            window.onload = function() {
              openForm();
            };
          </script>
        </body>
        </html>
      ;`
      // res.setHeader('Content-Type', 'text/html');
      // res.send(htmlContent);
      res.setHeader('Content-Type', 'text/html');
      // res.type('html');
      res.send(htmlContent);
      // Render the web_payment.pug template with the session data
      // res.redirect(`/paymentForm?sessionKey=${payload2front.sessionKey}&amount=${payload2front.amount}&merchantId=${payload2front.merchantId}&channel=${payload2front.channel}&sessionToken=${payload2front.sessionKey}&accessToken=${accesToken}`);
      

    // return res.status(200).json({ Purchase: newPurchase });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
    initPurchase,
};