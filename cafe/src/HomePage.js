import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import cafeImage from './coffee.jpg'; // Import the image

const HomePage = ({ userId }) => {
    console.log("userId in HomePage:", userId);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orderPlaced, setOrderPlaced] = useState(false); // State variable for order placed message

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/items');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const addToCart = (product) => {
        const existingItemIndex = cart.findIndex(item => item.item_id === product.item_id);
        if (existingItemIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantity += 1;
            updatedCart[existingItemIndex].totalPrice = updatedCart[existingItemIndex].quantity * product.price;
            setCart(updatedCart);
            console.log('Quantity updated in cart:', product);
        } else {
            setCart([...cart, { ...product, quantity: 1, totalPrice: product.price }]);
            console.log('Product added to cart:', product);
        }
    };

    const removeFromCart = (productId, removeCompletely = false) => {
        const updatedCart = cart.filter(item => item.item_id !== productId || (removeCompletely && item.item_id === productId));
        setCart(updatedCart);
        console.log('Product removed from cart:', productId);
    };

    const handleBuyNow = async () => {
        const transactionsData = cart.map(product => ({
            item_id: product.item_id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            transaction_date: new Date().toISOString(),
            user_id: 1, // Use the userId passed to the component
            totalprice: product.totalPrice
        }));
    
        const grandTotal = cart.reduce((total, item) => total + item.totalPrice, 0); // Calculate grand total
    
        try {
            const response = await axios.post('http://localhost:3001/record-transaction', {
                transactions: transactionsData,
                grandTotal: grandTotal // Send grand total to the backend
            });
            console.log(response.data.message); // Log success message
        } catch (error) {
            console.error('Error recording transactions:', error); // Log error for debugging
        }
    
        // Clear cart and handle order placement logic after successful transaction
        setCart([]);
        setOrderPlaced(true);
    };
    
      

    // Split products into chunks of 4
    const chunkedProducts = [];
    for (let i = 0; i < products.length; i += 4) {
        chunkedProducts.push(products.slice(i, i + 4));
    }

    // Split cart items into chunks of 4
    const chunkedCart = [];
    for (let i = 0; i < cart.length; i += 4) {
        chunkedCart.push(cart.slice(i, i + 4));
    }

    return (
        <div className="container mt-5" style={{ backgroundColor: 'white', padding: '20px' }}>
            <h1 className="text-center mb-4"><b>Products</b></h1>
            {userId && <p>User ID: {userId}</p>}
            {chunkedProducts.map((chunk, index) => (
                <div key={index} className="row">
                    {chunk.map(product => (
                        <div key={product.item_id} className="col-md-3 mb-4">
                            <div className="card" style={{ maxWidth: '200px' }}> {/* Limit card width */}
                                <img 
                                    src={cafeImage} 
                                    className="card-img-top" 
                                    alt="Cafe" 
                                    style={{ width: '200px', height: '150px' }} // Set image dimensions
                                />
                                <div className="card-body" style={{ maxHeight: '180px' }}> {/* Limit card body height */}
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">Price: ${product.price}</p>
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={() => addToCart(product)}
                                    >
                                        Add to Cart
                                    </button>
                                    <div className="mt-2">
                                        <button 
                                            className="btn btn-secondary" 
                                            onClick={() => removeFromCart(product.item_id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <div className="text-center mt-4">
                <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}> {/* Box-like styling */}
                    <h2>Cart Items</h2>
                    {chunkedCart.map((chunk, index) => (
                        <div key={index} className="row">
                            {chunk.map((item, idx) => (
                                <div key={idx} className="col-md-3 mb-4">
                                    <div className="card" style={{ maxWidth: '200px' }}> {/* Limit card width */}
                                        <div className="card-body" style={{ maxHeight: '180px' }}> {/* Limit card body height */}
                                            <h5 className="card-title">{item.name}</h5>
                                            <p className="card-text">Price: ${item.price}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Total Price: ${item.totalPrice}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                    <p><b>Grand Total: ${cart.reduce((total, item) => total + item.totalPrice, 0)}</b></p> {/* Display grand total */}
                    <button className="btn btn-success" onClick={handleBuyNow}>Buy Now</button> {/* Buy Now button */}
                    {orderPlaced && <p style={{ color: 'red' }}>Order placed</p>} {/* Conditionally render order placed message */}
                </div>
            </div >
            <div className="text-left mt-4">
                <Link to="/transactions">View Transactions</Link>
            </div>
        </div>
    );
};

export default HomePage;
