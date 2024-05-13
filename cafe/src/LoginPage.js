import React, { useState } from "react";
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import logo from "./logo.png";

const LoginPage = ({ setUserId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const login = () => {
  // Send a POST request to the login endpoint with username and password
  Axios.post("http://localhost:3001/login", {
    username: username,
    password: password
  })
  .then((response) => {
    console.log(response);
    // Check if the login was successful
    if (response.data && response.data.message === "Login successful") {
      // If successful, set the userId received from the server
      setUserId(response.data.userId);
      console.log("UserId after login:", response.data.userId); // Log userId
      // Navigate to the home page
      navigate('/home');
      // Clear any previous login error
      setLoginError('');
    } else {
      // If login was not successful, show an error message
      console.log("Invalid username or password");
      setLoginError("Invalid username or password");
    }
  })
  .catch((error) => {
    // If there's an error with the request, show an error message
    console.error('Error logging in:', error);
    setLoginError("Error logging in. Please try again.");
  });
};


  return (
    <div style={{ background:'white',display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
      <img src={logo} alt="Logo"  />
      </div>
      <div style={{ background:'#FEECEB',display: 'flex',borderRadius: '10px', justifyContent: 'center',border: '1.5px solid black', borderColor: '#B7C9E2' }}>
      <div className="container">
        <h1>Login</h1>
        <p></p><p></p>
        <div className="form-group" style={{ width: '100%' }}>
          <input 
            type="text" 
            placeholder="Username..."
            className="form-control"
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <p></p>
        <div className="form-group" style={{ width: '100%' }}>
          <input 
            type="password" 
            placeholder="Password..."
            className="form-control"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p></p>
        <button className="btn btn-danger" onClick={login}>Login</button>
        {loginError && <p className="text-danger">{loginError}</p>}
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
    </div>
  );
}

export default LoginPage;
