const countryCodes = [
  { name: "Estados Unidos", code: "+1" },
  { name: "Canadá", code: "+1" },
  { name: "Argentina", code: "+54" },
  { name: "Brasil", code: "+55" },
  { name: "Chile", code: "+56" },
  { name: "México", code: "+52" },
  { name: "Colombia", code: "+57" },
  { name: "Perú", code: "+51" },
  { name: "Venezuela", code: "+58" },
  { name: "Uruguay", code: "+598" },
  { name: "Paraguay", code: "+595" },
  { name: "Bolivia", code: "+591" },
  { name: "Ecuador", code: "+593" },
  { name: "Panamá", code: "+507" },
  { name: "Costa Rica", code: "+506" },
  { name: "Nicaragua", code: "+505" },
  { name: "Honduras", code: "+504" },
  { name: "El Salvador", code: "+503" },
  { name: "Guatemala", code: "+502" },
  { name: "Belice", code: "+501" },
  { name: "Cuba", code: "+53" },
  { name: "República Dominicana", code: "+1" },
  { name: "Puerto Rico", code: "+1" },
  { name: "Haití", code: "+509" },
  { name: "Jamaica", code: "+1" },
  { name: "Trinidad y Tobago", code: "+1" },
  { name: "Barbados", code: "+1" },
  { name: "Bahamas", code: "+1" },
  { name: "Santa Lucía", code: "+1" },

  // Agregar más países si es necesario
];

function getCountryCode(countryName) {
  const country = countryCodes.find((c) => c.name === countryName);
  return country ? country.code : "";
}

module.exports = { getCountryCode };
