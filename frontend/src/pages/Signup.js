// Signup.js
import {Link, useNavigate} from "react-router-dom";
import React from 'react';
import axios from 'axios';


const Signup = () => {

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            username: event.target.username.value,
            email: event.target.email.value,
            password: event.target.password.value,
        };

        try {
            const response = await axios.post('/signup', formData);

            if (response.status === 200) {
                console.log(response.data.message);
                navigate('/login');
            }

        } catch (error) {
            if (error.response && error.response.status === 400) {
                // const falseEmail = document.getElementById("email-input")
                // falseEmail.style.border = "2px solid red"
                // falseEmail.value = ""
                // falseEmail.placeholder = `Can\`t create new user! Email already used.`
            }
        }
    };

    return (<div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className='bg-white p-3 rounded w-25'>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="name"><strong>Name</strong></label>
                    <input type="text" placeholder="Enter your name" id="username" name="username"
                           className="form-control rounded-0" required/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input type="email" placeholder="Enter your email" id="email" name="email"
                           className="form-control rounded-0" required/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" placeholder="Enter your password" id="password" name="password"
                           className="form-control rounded-0" required/>
                </div>
                <button className="btn btn-success w-100 mb-2" type="submit">Sign Up</button>
                <Link to="/login" className="btn btn-default border w-100 bg-light">Log In</Link>
            </form>
        </div>
    </div>);
};

export default Signup;
