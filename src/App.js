// src/App.js
import React, {useState } from 'react'; // Import useEffect and useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventTable from './components/client/EventTable';
import Login from './components/auth/login';
import Cookies from 'js-cookie'; // Make sure you import Cookies if you're using it
import './App.css';
import MainLayout from './components/layout/Layout';


const App = (Iscash) => {
  const [isAuthenticated, setIsAuthenticated] = useState(()=>{
    const token = Cookies.get('jwt');
    return Boolean(token); // Initialize based on token presence
  }); // Authentication state

  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<EventTable Iscash={false} />} />
        {!isAuthenticated ? (
          <Route path="/login" element={<Login  setIsAuthenticated={setIsAuthenticated} />} />
        ) : (
          <Route path="/*" element={<MainLayout setIsAuthenticated={setIsAuthenticated} /> }/>
          
        )}
      </Routes>
    </Router>
  );
}

export default App;