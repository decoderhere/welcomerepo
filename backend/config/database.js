const mongoose = require("mongoose");
const connection= mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => console.log(`database is connected with ${data.connection.host}`))
  .catch((err) => {
    console.log(`data cannot be connected has error ${err}`);
  });

module.exports = connection;
