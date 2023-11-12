const http = require("http");
const { parse } = require("querystring");
const fs = require("fs");
const PORT = "8080";

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

const errorResponse = (res, statusCode, message) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ success: false, message: error.message }));
};

http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.url === "/" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("Hello World");
    } else if (req.url === "/" && req.method === "POST") {
      try {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => {
          console.log(parse(data));
        });
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(
          JSON.stringify({
            success: true,
            message: "data was recieved",
          })
        );
      } catch (error) {
        errorResponse(res, 500, error.message);
      }
    } else if (req.url === "/products" && req.method === "GET") {
      try {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            success: true,
            message: "products were loaded",
            products: products,
          })
        );
      } catch (error) {
        errorResponse(res, 500, error.message);
      }
    } else if (req.url === "/products" && req.method === "POST") {
      try {
        let product = "";
        req.on("data", (chunk) => {
          product += chunk;
        });
        req.on("end", () => {
          const data = parse(product);
          const newProduct = {
            id: new Date().toString(),
            name: data.name,
            description: data.description,
            price: data.price,
          };
          products.push(newProduct);
        });
        fs.writeFile("products.json", JSON.stringify(products), (error) => {
          if (error) {
            console.log("error");
          } else {
            console.log("file created");
          }
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: true,
            message: "product was created",
            product: product,
          })
        );
      } catch (error) {
        errorResponse(res, 500, error.message);
      }
    }
  })
  .listen(PORT, () =>
    console.log(`Server running at http://127.0.0.1:${PORT}/`)
  );
