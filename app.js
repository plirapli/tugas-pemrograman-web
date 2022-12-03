require('dotenv').config();
const express = require('express');
const sessions = require('express-session');
const connection = require('./config/database.js');

const port = process.env.PORT || '3002';
const app = express();

app.use(
  sessions({
    secret: '1234567890',
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      expires: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.set('view engine', 'pug');
app.locals.pretty = true;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const command = `SELECT * FROM categories`;
  connection.query(command, (err, result, field) => {
    res.render('kategori', { categories: result });
  });
});

app.get('/kategori/:categoryID', (req, res) => {
  const id = req.params.categoryID;
  const command = `SELECT ProductID, ProductName, UnitPrice FROM products WHERE CategoryID = ${id}`;
  connection.query(command, (err, result, field) => {
    res.render('produk', { products: result });
  });
});

app.get('/produk/:productID', (req, res) => {
  const id = req.params.productID;
  const command = `SELECT * FROM products p
                   INNER JOIN suppliers s ON p.SupplierID = s.SupplierID
                   INNER JOIN categories c ON p.CategoryID = c.CategoryID 
                   WHERE ProductID = ${id}`;
  connection.query(command, (err, result, field) => {
    res.render('produk-detail', { product: result[0] });
  });
});

let carts = [];

app.post('/cart-process', (req, res) => {
  const cart = req.body;
  carts.push(cart);
  req.session.cart = JSON.stringify(carts);

  res.redirect('/');
});

app.get('/cart', (req, res) => {
  const cart = JSON.parse(req.session.cart || '[]');
  let total = 0;
  carts = cart;

  carts.map((c) => {
    total += c.price * c.qty;
  });

  res.render('cart', { carts, total });
});

app.listen(port, () => {
  console.log('Server Connected on PORT: ' + port);
});
