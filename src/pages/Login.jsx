import API from '../services/api'
import {useNavigate} from'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
const Login = () => {
  const navigate = useNavigate();
  const [formData , setFormData] =useState({
    email:"",
    password:""
  })
  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [ e.target.name]: e.target.value
    })
  }
   const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      const res = await API.post("/login", formData)
      console.log(res.data)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      alert("login successful")
      navigate("/chat")
    }
    catch(error){
      console.log(error.response?.data)
      alert(error.response?.data?.msg ||"Login Failed" )
    }
   }
   useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/chat");
  }
}, [navigate]);
  return (
    <div>
        <h4>Login Page</h4>
        <form onSubmit={handleSubmit}>
          <input type="email" name='email' placeholder='Email' onChange={handleChange}/><br/><br/>
          <input type="password" name='password' placeholder='Password' onChange={handleChange}/><br/><br/>
          <button type='submit'>Login</button>
        </form>
    </div>
  )
}

export default Login