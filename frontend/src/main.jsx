import React from 'react'
import ReactDOM from 'react-dom/client'
import App1 from './App1.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <App1 />
   <Toaster />
  </BrowserRouter>
)