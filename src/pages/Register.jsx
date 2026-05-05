import React from 'react'
import { useState } from 'react'
import API from '../services/api'
const Register = () => {
    const [fromData, setFromData] = useState({
        username:"",
        email:"",
        password:"",
        age:""
    })
const handleChange = (e) =>{
    setFromData({
        ...fromData,
        [e.target.name]:e.target.value
    })
};
const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
        const res = await API.post("/register", fromData)
        console.log(res.data)
        alert("registration successful")
    }
    catch(error){
        console.log(error.response.data);
        alert("error.response.data" || "Error");
    }
}    
  return (
    <div><h1>Register Page</h1>
    <form onSubmit={handleSubmit}>
        <input type='text'
        name='username'
        placeholder='Username'
        onChange={handleChange}
        />
        <br/><br/>
        <input
        type='email'
        name='email'
        placeholder='Email'
        onChange={handleChange}
         />
        <br/><br/>
        <input
        type='password'
        name='password'
        placeholder='Password'
        onChange={handleChange}
         />
        <br/><br/> 
        <input
        type='number'
        name='age'
        placeholder='Age'
        onChange={handleChange}
         />
        <br/><br/> 
        <button type='submit'>Register</button>
    </form>
    </div>
  )
}

export default Register