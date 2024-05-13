import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import HomePage from "./HomePage";
import Transactions from "./Transactions"; // Import the Transactions component
import 'bootstrap/dist/css/bootstrap.min.css';
import BillingScreen from "./BillingScreen";

function App() {
  const [userId, setUserId] = useState(null); // Initialize user ID state
  const [cart, setCart] = useState([]);

  // Function to add item to cart
  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex(item => item.item_id === item.item_id);
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      updatedCart[existingItemIndex].totalPrice = updatedCart[existingItemIndex].quantity * item.price;
      setCart(updatedCart);
      console.log('Quantity updated in cart:', item);
    } else {
      setCart([...cart, { ...item, quantity: 1, totalPrice: item.price }]);
      console.log('Product added to cart:', item);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage setUserId={setUserId} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/home"
            element={<HomePage addToCart={addToCart} userId={userId} />} // Pass addToCart function and userId as props
          />
          <Route path="/billing" element={<BillingScreen />} />
          <Route path="/transactions" element={<Transactions cart={cart} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
