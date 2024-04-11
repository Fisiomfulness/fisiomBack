const { app } = require("./src/app");
const { PORT } = require("./src/config/envConfig");

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
