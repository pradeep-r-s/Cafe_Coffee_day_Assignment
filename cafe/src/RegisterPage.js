import React, { useState } from "react";
import Axios from 'axios';
import { Link } from "react-router-dom";

function RegisterPage() {
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const register = () => {
    Axios.post("http://localhost:3001/register", {
      username: usernameReg, 
      password: passwordReg
    })
    .then((response) => {
      console.log(response);
      setRegistrationSuccess(true);
    })
    .catch((error) => {
      console.error('Error registering user:', error);
    });
  };

  return (
    <div className="container">
      <h1>Registration</h1>
      {registrationSuccess ? (
        <div>
          <p>Registration successful! You can now </p>
            <p>
            
            </p>
            <Link to="/" className="btn btn-primary">Login</Link>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text"
              className="form-control"
              value={usernameReg} 
              onChange={(e) => setUsernameReg(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password"
              className="form-control"
              value={passwordReg} 
              onChange={(e) => setPasswordReg(e.target.value)}
            />
          </div>
          <p>

            
          </p>
          <button className="btn btn-primary" onClick={register}>Register</button>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
