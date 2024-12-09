// src/AdminLogin.js
import React, { useState } from 'react';
import Cookies from 'js-cookie'
import './login.css';
import { Button, Input, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginAuth } from '../../utils/apiUtils';
import logo from '../../assests/logo.png';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try{
      console.log('Login details:', values);
      const response = await loginAuth(values);
      console.log("Login Status",response);

      const {Token, access} = response.data;
      console.log('access:',access);
      Cookies.set('jwt', access, { expires: 4/24 }); 
      Cookies.set('refresh', Token, { expires: 4/24 }); 
      // Cookies.set('username', values.username, { expires: 4/24 });
    

      message.success('Login successful!');
      setIsAuthenticated(true);
      navigate('/events');
  } catch(error) {
    message.error(error.message || 'Invalid credentials, please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className='login-left'>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="login-right">
        <div className='login-box'>
          <h2>Login</h2>
          <Form
            name="loginForm"
            onFinish={handleLogin}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className='login-button'>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login ;
