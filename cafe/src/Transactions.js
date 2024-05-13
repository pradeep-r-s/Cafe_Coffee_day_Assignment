import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf'; // Import jsPDF library
import 'jspdf-autotable'; // Import autoTable plugin
import moment from 'moment'; // Import moment.js for date parsing
import logo from "./logo.png";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/transactions');
        console.log('Response from server:', response.data);
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleDateFilter = () => {
    if (!startDate || !endDate) {
      console.error('Please select both start and end dates.');
      return; // Prevent filtering if dates are empty
    }

    const startDateObj = moment(startDate).toDate(); // Parse to Date
    const endDateObj = moment(endDate).toDate(); // Parse to Date

    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transaction_date);
      return transactionDate >= startDateObj && transactionDate <= endDateObj;
    });

    setFilteredTransactions(filtered);
  };

  const generateInvoice = () => {
    if (!startDate || !endDate) {
      console.error('Please select both start and end dates.');
      return;
    }

    // Create a new PDF document
    const doc = new jsPDF();
    doc.autoTable({ html: '#transactions-table' }); // Generate table using autoTable plugin

    // Download the generated PDF
    doc.save('transaction_report.pdf');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4"><b>All Transactions</b></h1>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
      <img src={logo} alt="Logo"  />
      </div>

      {/* Invoice Section */}
      <div className="mb-4">
        <h2>Invoice Section</h2>
        <div>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />{"\t"}
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <p></p>
          <button onClick={handleDateFilter} class="btn btn-danger">Generate Invoices</button>
        </div>
      </div>

      {/* Report Section */}
      <div>
        <h2>Report Section</h2>
        <table id="transactions-table" className="table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Invoice No</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.transaction_id}>
                <td>{moment(transaction.transaction_date).format('YYYY-MM-DD HH:mm:ss')}</td> {/* Format date and time */}
                <td>{transaction.transaction_id}</td>
                <td>{transaction.product_name}</td>
                <td>${transaction.price}</td>
                <td>{transaction.quantity}</td>
                <td>${transaction.totalprice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generate Invoice Button */}
      <div className="text-center">
        {filteredTransactions.length > 0 ? (
          <button onClick={generateInvoice} className="btn btn-info" >Generate Invoice PDF</button>
        ) : (
          <p>Select dates to filter and generate invoice.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
