import React from 'react'
import {Routes , Route} from "react-router-dom";
import Login from"./pages/Login";
import Register from"./pages/Register";
import Chat from"./pages/Chat"
import ProtectedRoute from './routes/ProtectedRoute'
import {Toaster} from 'react-hot-toast'
import SetProfile from './pages/SetProfile';
import Profile from './pages/Profile';
const App = () => {
  return (
    <>
    <Toaster/>
  <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/chat' element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path='/set-profile' element={<ProtectedRoute><SetProfile/></ProtectedRoute>} />
      <Route
  path='/profile'
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
    </Routes>
    </>
  
  )
}

export default App