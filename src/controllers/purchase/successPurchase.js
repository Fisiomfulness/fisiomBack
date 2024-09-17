// debería importar el modelo Purchase y pasar la purchase que estaba pending a completed

const successPurchase = async (req, res) => {
    try { 
      // si todo llega bien acá debería hacer un update de la Purchase en el modelo para pasarla a success o similar
      return res.status(200).json({ message: "success" });
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  };
  
  module.exports = {
    successPurchase,
  };