import React from 'react'
import {Routes , Route} from "react-router-dom";
import Login from"./pages/Login";
import Register from"./pages/Register";
import Chat from"./pages/Chat"
import ProtectedRoute from './routes/ProtectedRoute'
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/chat' element={<ProtectedRoute><Chat /></ProtectedRoute>} />
    </Routes>
  )
}

export default App