const Purchase = require('../../models/purchase/Purchase');
const { NIUBIZ_MERCHANT_ID, NIUBIZ_CHECKOUT_ENDPOINT} = require('../../config/envConfig');
const { fetchAccessToken, fetchSessionKey } = require('../../services/niubizServices');


const initPurchase = async (req, res) => {
  try {
    const { total, productsMap } = req.body;

    // genero el ID acá, no lo mando del front para evitar manipulaciones / interpreto que después en la respuesta de la transacción podés buscar este número
    const transactionID = Math.floor(100000000000 + Math.random() * 900000000000);



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
      try {
      const newPurchase = new Purchase({
        _userId: req.user?.id,
        transactionID: transactionID,
        purchaseData: productsMap,
        amount: total,
        accessToken: accessToken,
        sessionKey: sessionKey
      })
      
      await newPurchase.save()
   
    }
      catch (error) {
        console.log(error)
      }


  const htmlContent = `
  <script>
    
    (async () => {
      try {
        // Fetch the external script
        const response = await fetch("https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true");
        
        if (!response.ok) {
          throw new Error("Failed to load the external script");
        }


        // Get the script text and evaluate it
        const scriptText = await response.text();
        eval(scriptText);  // This will execute the script and define the classes or objects


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
            action: 'http://localhost:3000/purchases/authorize?transactionID=${transactionID}'
          });

          // Open the checkout form
          VisanetCheckout.open();
        // } else {
        //   console.error("VisanetCheckout class was not found.");
        // }

      } catch (error) {
        console.error("Error in fetching or executing the script:", error);
      }
    })();
  </script>
`;
    const transactions = await Purchase.find({})
    .sort({ createdDate: -1 })
    .limit(3);
    console.log('Last 3 transactions:', transactions);  
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
    initPurchase,
};