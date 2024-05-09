// App.js

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import HomePage from "./HomePage";
import Transactions from "./Transactions"; // Import the Transactions component
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [userId, setUserId] = useState(null); // Initialize user ID state
    const [cart, setCart] = useState([]);

    // Function to add item to cart
    const addToCart = (item) => {
        setCart([...cart, { ...item, quantity: 1 }]);
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LoginPage setUserId={setUserId} />} /> {/* Pass setUserId as a prop */}
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/home"
                        element={<HomePage addToCart={addToCart} userId={userId} />} // Pass addToCart function and userId as props
                    />
                    
                    {/* Pass cart as a prop to Transactions component */}
                    <Route path="/transactions" element={<Transactions cart={cart} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
