import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const LOGIN_USER = gql`
        mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      email
    }
  }
}
    
    `
    const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            localStorage.setItem("token", data.login.token);
            navigate("/");
        }
    }, [data, navigate]);

    if (loading) {
        console.log("Loading...");
    }

    if (error) {
        console.error("Error:", error.message);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser({ variables: { email, password } });
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Do not have an account? <Link to="/register" style={{ color: '#007BFF', textDecoration: 'none' }}>Register</Link>
            </p>
        </div>
    );
};

export default Login;
