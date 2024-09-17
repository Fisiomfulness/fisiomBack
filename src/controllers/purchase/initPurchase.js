// debería importar el modelo Purchase y crear una Purchase con estado pending

const initPurchase = async (req, res) => {
  try {
    const { total, transactionID, productsMap } = req.body;
    console.log(total, transactionID, productsMap);

    // en lugar de esta response, iniciar el proceso de pago
    return res.status(200).json({ total, transactionID, productsMap });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
    initPurchase,
};