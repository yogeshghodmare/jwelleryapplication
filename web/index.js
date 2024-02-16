// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import mysql from "mysql";
import cors from "cors";
import { Session } from "@shopify/shopify-api";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || "3000", 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use(express.json());
app.use(cors());
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "test12",
//   port: 3307,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err.message);
//   } else {
//     console.log("Connected to the database");
//   }
// });

// Handle unexpected errors during the lifetime of the connection
// db.on('error', (err) => {
//   console.error('Database error:', err.message);
// });

// app.post("/daldoismedata", (req, res) => {
//   let sql = "INSERT INTO orders (`id`,`productid`, `title`,`description`) VALUES (?,?,?,?) ";

//   const { id, productid, title, description } = req.body;

//   db.query(sql, [id, productid, title, description], (err, result) => {
//     if (err) {
//       console.log("Error executing ");
//     } else {
//       console.log("Data inserted");
//       res.status(200).send("Data inserted successfully");
//     }
//   });
// });

// app.get("/lelodata", (req, res) => {
//   let sql = 'SELECT * FROM orders';
//   db.query(sql, (err, result) => {
//     if (err) {
//       console.log("Error executing ");
//     } else {
//       console.log("Data Retrieve");
//       res.status(200).send(result);
//     }
//   });
// });

// app.listen(8082, () => {
//   console.log("Listening on port 8082");
// });

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

// Read shop information

app.get("/api/store/info", async (req, res) => {
  let storeInfo = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

  res.status(200).send(storeInfo);
});

app.get("/api/products", async (_req, res) => {
  const countDat = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countDat);
});

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

// Read collection data
app.get("/api/collections/count", async (_req, res) => {
  const count = await shopify.api.rest.CustomCollection.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(count);
});

// Read orders
app.get("/api/orders/all", async (_req, res) => {
  const orderData = await shopify.api.rest.Order.all({
    session: res.locals.shopify.session,
    status: "any"
  });
  res.status(200).send(orderData);
});

app.get("/api/orders", async (_req, res) => {
  try {
    const orders = await shopify.api.rest.Order.all({
      session: res.locals.shopify.session,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.post("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  const { title, bodyHtml } = _req.body;

  try {
    await productCreator(res.locals.shopify.session, { title, bodyHtml });
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.delete("/api/products/delete",async (_req, res) => {
  const { id } = _req.body;
  try {
    const response = await shopify.api.rest.Product.delete({
      session: res.locals.shopify.session,
      id
    });
    res.status(200).send("Product Deleted");
  } catch (e) {
    console.error("Product not Deleted:", e);
    res.status(500).send("Failed to delete product");
  }
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
