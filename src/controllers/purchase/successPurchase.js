const Purchase = require('../../models/purchase/Purchase');

const successPurchase = async (req, res) => {
    try { 
      /* 
      si todo llega bien acá debería hacer un update de la Purchase en el modelo para pasarla a success o similar
      voy a suponer que le mandás a esta ruta un PUT con la respuesta de la transacción en el body
      esto SE VA A ROMPER, vas a tener que acomodar correctamente de dónde tomás los datos correctos de amount, transactionID, etc.
      */
      const transactionResult = req.body;
      const transactionID = transactionResult.transaction;
      const amount = transactionResult.amount;
      const purchase = await Purchase.findOneAndUpdate(
        {transactionID, amount, status: "PENDING", expiration: {$gt: Date.now()}}, 
        {status: "ACCEPTED", paymentData: transactionResult}, 
        {new: true}
      );
      return res.status(200).json({ message: "success" });
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  };
  
  module.exports = {
    successPurchase,
  };