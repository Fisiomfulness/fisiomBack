const Purchase = require('../../models/purchase/Purchase');

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

    await newPurchase.save()
    
    // en este punto en lugar de esta response podés hacer un redirect al inicio de tu cadena de pago 
    return res.status(200).json({ Purchase: newPurchase });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
    initPurchase,
};