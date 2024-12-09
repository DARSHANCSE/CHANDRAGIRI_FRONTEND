// src/components/layout/Sidebar.jsx
import React from 'react';
import { Layout, Menu } from 'antd';
import {  StockOutlined,DashboardOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logo from '../../assests/logo.png';
import './layout.css'

const { Sider } = Layout;

const Sidebar = ({}) => {
  return (
    <Sider
      className='layout-sidebar'
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
      {/* Logo Container */}
      <div style={{ textAlign: 'center', padding: '16px' }}>
        <img 
          src={logo} 
          alt="Chandragiri Logo" 
          className='logo'
        />
      </div>
      
      <Menu className='layout-sidebar-menu' mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/events">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<StockOutlined />}>
          <Link to="/eventcards">Cash Details</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
