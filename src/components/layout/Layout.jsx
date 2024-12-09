
import React,{ useEffect, useState } from 'react';
import { Layout, Button, theme } from 'antd';
import { Routes as RouterRoutes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Ensure you have this component
import Dashboard from '../dashboard/Dashboard';
import Cookies from 'js-cookie'; // Import the cookies library
import {jwtDecode} from 'jwt-decode';
import { logoutAuth, refreshAuthToken } from '../../utils/apiUtils';
import EventTable from '../client/EventTable';


const { Header, Content, Footer } = Layout;
const MainLayout = ({ setIsAuthenticated }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const sessionTimeoutLimit = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const tokenRefreshInterval = 15 * 60 * 1000; // 15 minutes in milliseconds

  const [lastActivityTime, setLastActivityTime] = useState(Date.now()); // Track activity time
  const [userType, setUserType] = useState("")

  const handleLogout = async () => {
    const Token = Cookies.get('refresh');

    try {
      await logoutAuth({ token: Token }); // Logout API Call
    } catch (error) {
      console.error('Logout failed:', error);
    }

    // Clean Cookies and Session
    Cookies.remove('jwt');
    Cookies.remove('refresh');
    Cookies.remove('role');

    setIsAuthenticated(false);
    setUserType(null);
    navigate('/login');
  };

  const refreshToken = async () => {
    const Token = Cookies.get('refresh');
    // console.log('refresh',Token);
    if (!Token) {
      handleLogout(); // If no refresh token, logout user
      return;
    }
    const inputData = {
      refresh : Token
    }
    try {
      const response = await refreshAuthToken(inputData);
      console.log("REFRESH API RESPONSE : ",response.data);
      const { access,Token } = response.data;
      Cookies.set('jwt', access, { expires: 4 / 24 }); // Update JWT Token
      Cookies.set('refresh',Token , { expires: 4/24 }); 
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      handleLogout(); // Logout user if token refresh fails
    }
  };

  // 1. Authorization: Check if the JWT is valid
  useEffect(() => {
    const token = Cookies.get('jwt');
    const Token = Cookies.get('refresh');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("DECODED JWT TOKEN : ",decoded);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          Cookies.set('role', decoded.user_type, { expires: 4 / 24 });
          setUserType(decoded.user_type); // Set user type from token
        } else if (Token) {
          refreshToken(); // Try refreshing the token
        } else {
          handleLogout(); // Expired and no refresh token, log out
        }
      } catch (error) {
        console.error('Invalid token:', error);
        handleLogout();
      }
    } else {
      handleLogout(); // No token, log out
    }
  }, []);

  // 2. Refresh the token periodically
  useEffect(() => {
    const tokenRefreshTimer = setInterval(() => {      
      refreshToken(); // Refresh token every 15 minutes
    }, tokenRefreshInterval);

    return () => clearInterval(tokenRefreshTimer); // Clean up interval
  }, []);

  // Check for user inactivity and auto logout
  useEffect(() => {
    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActivityTime >= sessionTimeoutLimit) {
        handleLogout(); // Auto logout after 2 hours of inactivity
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInactivity); // Clean up interval
  }, [lastActivityTime]);

  // Update last activity time on user interaction
  const updateLastActivityTime = () => setLastActivityTime(Date.now());

  useEffect(() => {
    window.addEventListener('mousemove', updateLastActivityTime);
    window.addEventListener('keypress', updateLastActivityTime);

    return () => {
      window.removeEventListener('mousemove', updateLastActivityTime);
      window.removeEventListener('keypress', updateLastActivityTime);
    };
  }, []);

  return (
    <Layout style={{ minHeight: '100vh',minWidth:'100vw' }}>
      <Sidebar userType={userType}/>
      <Layout className='row'>
        <Header className='layout-header'>
          <h2>Chandragiri</h2>
          <Button 
            className='logout-button'
            type="primary" 
            onClick={handleLogout} // Call the logout function on click
          >
            Logout
          </Button>
        </Header>
        
        
     
        <Content className='abc1'
         style={{
          margin: '24px 16px',
          padding: '24px',
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
         
        >
          <div className='abc2'>
            <RouterRoutes>
              <Route path="/events" element={<Dashboard userType = {userType}/>} />
              <Route path="/eventcards" element={<EventTable  Iscash={true} />} />
            </RouterRoutes>
          </div>
        </Content>
        
        <Footer
          style={{
            textAlign: 'center',
            background: colorBgContainer,
            padding: '10px 20px',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          Chandragiri ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
