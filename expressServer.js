const { error } = require("console");
const express = require("express");
const PORT = "8080";
const app = express();
const fs = require("fs");

const products = [
  {
    id: 1,
    name: "Laptop",
    description: "High-performance laptop for all your needs.",
    price: 3000,
  },
  {
    id: 2,
    name: "smartphone",
    description: "High-performance smartphone for all your needs.",
    price: 2000,
  },
];

app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", (req, res) => {
  const data = req.body;
  console.log(data);
  res.send({
    success: true,
    message: "data was recieved",
  });
});

app.get("/products", (req, res) => {
  try {
    res.send(products);
  } catch (error) {}
  res.status(500).send({ success: false, message: error.message });
});

app.get("/products/:id", (req, res) => {
  try {
    const id = req.params.id;
    const product = products.find((product) => product.id == id);
    if (!product) {
      res.status(404).send({ success: false, message: "product not found" });
      return;
    }
    res.send({
      success: true,
      message: "product was found",
      product: product,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

app.post("/products", (req, res) => {
  try {
    const product = req.body;
    const newProduct = {
      id: new Date().toString(),
      name: product.name,
      description: product.description,
      price: product.price,
    };
    products.push(newProduct);

    fs.writeFile("products.json", JSON.stringify(products), (error) => {
      if (error) {
        console.log("error");
      } else {
        console.log("file created");
      }
    });

    res.send({
      success: true,
      message: "product was created",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
