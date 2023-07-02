const express = require('express');
const app = express();
app.use(express.json());
const { randomUUID } = require('crypto'); //generate produts ids
const fs = require('fs'); //write a file

//products array
let products = [];

fs.readFile('products.json', 'utf-8', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    products = JSON.parse(data);
  }
});

//product insertion
app.post('/product', (req, res) => {
  //recieve product and price info
  const { name, price } = req.body; //recieve product info
  const product = {
    name,
    price,
    id: randomUUID(),
  };

  products.push(product); //append on products list

  createWriteFile();

  return res.json(product);
});

app.get('/product', (req, res) => {
  return res.json(products);
});

//get product info by id
app.get('/product/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(product => product.id === id);
  return res.json(product);
});

//edit product info
app.put('/product/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const productIndex = products.findIndex(product => product.id === id);

  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
  }; //edit the product

  createWriteFile();

  return res.json({ message: 'product info succesfull updated' });
});

//delete a product
app.delete('/product/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(product => product.id === id);
  products.splice(productIndex, 1);
  createWriteFile();
  return res.json({ message: 'Product deleted' });
});

function createWriteFile() {
  fs.writeFile('products.json', JSON.stringify(products), err => {
    if (err) {
      console.log(err);
    } else {
      console.log('Product inserted');
    }
  });
}

app.listen(3001, () => console.log('Server running on 3001 port'));
