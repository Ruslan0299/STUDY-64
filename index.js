import express from "express";
import mongoose from "mongoose";

const PORT = 3000;
const app = express();

const ObjectId = mongoose.Types.ObjectId;

mongoose
  .connect(
    "mongodb+srv://Ruslan:0299ee1988@cluster0.wliu6oq.mongodb.net/shop",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    data();
  })
  .catch((error) => {
    console.log("Error connection to Mongo DB:", error);
  });

const customerShema = new mongoose.Schema({
  name: String,
  product_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Customer = mongoose.model("Customer", customerShema);

const productShema = new mongoose.Schema({
  title: String,
  price: Number,
});

const Product = mongoose.model("Product", productShema);

async function data() {
  const mikeProductId1 = new ObjectId("6479a33abc388a217a092a4a");
  const mikeProductId2 = new ObjectId("6479a33abc388a217a092a4c");
  await Customer.updateOne(
    { name: "Mike" },
    { $set: { product_id: [mikeProductId1, mikeProductId2] } }
  );

  const bobProductId = new ObjectId("6479a33abc388a217a092a4b");
  await Customer.updateOne(
    { name: "Bob" },
    { $set: { product_id: [bobProductId] } }
  );

  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

app.get("/", async (req, res) => {
  try {
    const customersWithProducts = await Customer.find().populate("product_id");
    let html =
      "<h1>Wellcome to learn MongoDB</h1><h2>HURD Home_Work</h2><h2>Users purchases</h2>";

    for (const customer of customersWithProducts) {
      const { name, product_id } = customer;

      for (const product of product_id) {
        const { title, price } = product;
        html += `<div class="table"> <div>${name}:</div> <div>${title}</div> Price: <div>${price}</div> USD</div>`;
      }
    }

    res.send(`<style>
      .table {
        display: flex;
        border: 1px solid black;
        padding: 10px 20px;
        width: 250px;
        gap: 10px;     
      }
    </style>
    ${html}`);
  } catch (error) {
    console.log("Error data:", error);
    res.status(500).send("Internal Server Error");
  }
});
