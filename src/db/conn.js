const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/registerationForm", {useCreateIndex:true, useFindAndModify:false, useNewUrlParser:true, useUnifiedTopology:true})
.then(() => {
   console.log("Connection SuccessFull");
}).catch((err) => {
  console.log("No Connection");
});