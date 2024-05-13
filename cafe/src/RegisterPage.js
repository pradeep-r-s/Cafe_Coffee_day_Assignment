import React, { useState } from "react";
import Axios from 'axios';
import { Link } from "react-router-dom";
import logo from "./logo.png";

function RegisterPage() {
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const register = () => {
    if (passwordReg !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

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
    <div style={{ background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <img src={logo} alt="Logo" />
      </div>
      <div style={{ background: '#FEECEB', borderRadius: '10px', border: '1.5px solid black', borderColor: '#B7C9E2', padding: '20px', maxWidth: '300px', width: '100%' }}>
        <h1 className="text-center">Register</h1>
        {registrationSuccess ? (
          <div className="text-center">
            <p>Registration successful! You can now </p>
            <Link to="/" className="btn btn-danger">Login</Link>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username..."
                className="form-control"
                value={usernameReg}
                onChange={(e) => setUsernameReg(e.target.value)}
              />
            </div>
            <p></p>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password..."
                className="form-control"
                value={passwordReg}
                onChange={(e) => setPasswordReg(e.target.value)}
              />
            </div>
            <p></p>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password..."
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {passwordMatchError && (
              <p style={{ color: 'red', textAlign: 'center' }}>Passwords do not match!</p>
            )}
            <p></p>
            <div className="text-center">
              <button className="btn btn-danger" onClick={register}>Register</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
