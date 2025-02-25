const dotenv = require("dotenv");
const connectDB = require("./db/dbConnect");
const app = require("./app");

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening to the port ${process.env.PORT}`);
    });
  })
  .catch((e) => {
    console.log("Error in connecting the database", e);
  });
