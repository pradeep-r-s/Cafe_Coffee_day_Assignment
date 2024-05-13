import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf'; // Import jsPDF library
import 'jspdf-autotable'; // Import autoTable plugin
import moment from 'moment'; // Import moment.js for date parsing
import { Link } from 'react-router-dom';
import logo from "./logo.png";


const BillingScreen = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Retrieve transactions from local storage
        const storedTransactions = JSON.parse(localStorage.getItem('transactions'));
        if (storedTransactions) {
            setTransactions(storedTransactions);
        }
    }, []);

    // Calculate grand total
    const grandTotal = transactions.reduce((total, transaction) => total + transaction.totalPrice, 0);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const formattedDate = moment().format('MMMM Do YYYY, h:mm:ss a');

        const data = transactions.map((transaction, index) => [
            index + 1, // Serial number
            transaction.name,
            `$${transaction.price}`,
            transaction.quantity,
            `$${transaction.totalPrice}`
        ]);

        doc.autoTable({
            head: [['SNo', 'Product Name', 'Price', 'Quantity', 'Total Price']],
            body: data,
        });

        // Add grand total below the table
        doc.text(`Grand Total: $${grandTotal}`, 14, doc.autoTable.previous.finalY + 10);

        doc.text(`Invoice (${formattedDate})`, 14, doc.autoTable.previous.finalY + 20);
        doc.save('invoice.pdf');
    };

    return (
        <div className="container mt-5">
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <img src={logo} alt="Logo" />
            </div>
            <h1 className="text-center mb-4">Billing Screen</h1>
            {transactions.length === 0 ? (
                <p>No recent transactions found.</p>
            ) : (
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>SNo</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{transaction.name}</td>
                                    <td>${transaction.price}</td>
                                    <td>{transaction.quantity}</td>
                                    <td>${transaction.totalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p><b>Grand Total: ${grandTotal}</b></p>
                    <button onClick={handleDownloadPDF} className="btn btn-info">Download PDF</button>
                </div>
            )}
            <div className="text-left mt-4">
                <Link to="/transactions"><b>View All Transactions</b></Link>
            </div>
        </div>

    );
};

export default BillingScreen;
