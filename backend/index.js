const express = require("express");
const app = express();
const db = require("./models");
const bodyParser = require("body-parser");
const cors = require("cors");

var corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
      ];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        console.log("CORS Allowed for:", origin);
        callback(null, true);
      } else {
        console.log("CORS Denied for:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization", 
      "X-Requested-With",
    ],
  };

app.use(cors(corsOptions));

// Ensure preflight OPTIONS requests are handled
app.options("*", cors(corsOptions));

// Use bodyParser middleware for JSON
app.use(bodyParser.json());
app.use(express.json());  // to parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // to parse URL-encoded bodies

app.get('/', (req,res)=>{
    res.send('Welcome');
});

const orderRoute = require("./routes/order.route");
const productRoute = require("./routes/product.route");
const userRoute = require("./routes/user.route");
app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/", orderRoute);


module.exports = app;
const PORT = process.env.PORT || 8083;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

// const customerRoute = require("./routes/policies.route");
