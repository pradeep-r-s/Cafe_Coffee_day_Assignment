// const express = require("express");
// const mysql = require("mysql");
// const cors = require("cors");

// const app = express();
// const port = process.env.PORT || 3001;

// // MySQL database connection
// const db = mysql.createConnection({
//   user: "root",
//   host: "localhost",
//   database: "loginsystems",
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection error:", err);
//     return;
//   }
//   console.log("Connected to the database");
// });

// // Middleware
// app.use(cors());
// app.use(express.json()); // Parse JSON bodies

// // User registration endpoint
// app.post("/register", (req, res) => {
//   const { username, password } = req.body;

//   db.query(
//     "INSERT INTO users (username, password) VALUES (?, ?)",
//     [username, password],
//     (err, result) => {
//       if (err) {
//         console.error("Error registering user:", err);
//         res.status(500).send({ error: "Error registering user" });
//       } else {
//         console.log("User registered successfully");
//         res.status(200).send({ message: "User registered successfully" });
//       }
//     }
//   );
// });

// // User login endpoint
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;

//   db.query(
//     "SELECT * FROM users WHERE username = ? AND password = ?",
//     [username, password],
//     (err, result) => {
//       if (err) {
//         console.error("Database error:", err);
//         res.status(500).send({ error: "Database error" });
//       } else {
//         if (result.length > 0) {
//           console.log("Login successful");
//           res.status(200).send({ message: "Login successful" });
//         } else {
//           console.log("Wrong username or password");
//           res.status(401).send({ error: "Wrong username or password" });
//         }
//       }
//     }
//   );
// });

// // Fetch all products endpoint
// app.get("/items", (req, res) => {
//   db.query("SELECT * FROM items", (err, result) => {
//     if (err) {
//       console.error("Error fetching products:", err);
//       res.status(500).send({ error: "Error fetching products" });
//     } else {
//       res.status(200).send(result);
//     }
//   });
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

// MySQL database connection
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  database: "loginsystems",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to the database");
});

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// User registration endpoint
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    (err, result) => {
      if (err) {
        console.error("Error registering user:", err);
        res.status(500).send({ error: "Error registering user" });
      } else {
        console.log("User registered successfully");
        res.status(200).send({ message: "User registered successfully" });
      }
    }
  );
});

// User login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        res.status(500).send({ error: "Database error" });
      } else {
        if (result.length > 0) {
          console.log("Login successful");
          res.status(200).send({ message: "Login successful" });
        } else {
          console.log("Wrong username or password");
          res.status(401).send({ error: "Wrong username or password" });
        }
      }
    }
  );
});

// Fetch all products endpoint
app.get("/items", (req, res) => {
  db.query("SELECT * FROM items", (err, result) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).send({ error: "Error fetching products" });
    } else {
      res.status(200).send(result);
    }
  });
});

app.post("/record-transaction", (req, res) => {
  console.log("Request body:", req.body); // Log the request body

  const { transactions, grandTotal } = req.body;

  // Process each transaction
  transactions.forEach(transaction => {
      const { user_id, item_id, quantity, transaction_date, name, price, totalprice } = transaction;

      // Insert the transaction into the database
      db.query(
          "INSERT INTO transactions (user_id, item_id, quantity, transaction_date, product_name, price, totalprice) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [user_id, item_id, quantity, transaction_date, name, price, totalprice],
          (err, result) => {
              if (err) {
                  console.error("Error recording transaction:", err);
                  res.status(500).send({ error: "Error recording transaction" });
              } else {
                  console.log("Transaction recorded successfully");
              }
          }
      );
  });

  // Optionally, you can save the grandTotal in a separate table or handle it as needed
  console.log("Grand Total:", grandTotal);

  res.status(200).send({ message: "Transactions recorded successfully" });
});



app.get("/transactions", (req, res) => {
  db.query("SELECT * FROM transactions", (err, result) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).send({ error: "Error fetching transactions" });
    } else {
      res.status(200).send(result);
    }
  });
});

const pdfkit = require('pdfkit');
const fs = require('fs');

// Route to generate PDF invoice
app.get("/generate-invoice", (req, res) => {
  const doc = new pdfkit();
  const invoiceFileName = `invoice_${Date.now()}.pdf`;
  const invoicePath = `./invoices/${invoiceFileName}`; // Directory where invoices will be stored

  // Fetch transaction data from the database and generate PDF
  // For simplicity, let's assume transaction data is fetched and stored in a variable named 'transactionData'

  doc.pipe(fs.createWriteStream(invoicePath));

  // Write content to PDF
  doc.fontSize(12).text('Invoice', { align: 'center' });
  // Write transaction details to PDF

  doc.end();

  res.status(200).send({ fileName: invoiceFileName });
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
