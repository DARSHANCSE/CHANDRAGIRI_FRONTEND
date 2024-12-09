import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import { fetchEvents, deleteEvent} from "../../utils/apiUtils"; // Import the delete function
import {ReloadOutlined,EditOutlined, DeleteOutlined} from '@ant-design/icons'; // Import the reload icon
import AddNewEvent from "./AddEvent";
import './dashboard.css';


const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false); 
  const [editEventData,setEditEventData]=useState(null);
  useEffect(() => {
   
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      message.error("Error Fetching events");
    }
  };

  const handleEditEvent = (record) => {
    setEditEventData(record); // Set the selected event detail
    setIsEdit(true);
    setModalVisible(true); // Open the modal
  };


  // Cancel Modal
  const handleCancel = () => {
    setModalVisible(false);
    setIsEdit(false);
    setEditEventData(null);
  };

  // Function to handle event deletion
  const handleDeleteEvent = async (eventData) => {
    try {
      // Pass the entire eventData object to deleteEvent
      const response = await deleteEvent(eventData);
  
      if (response.success) {
        // Update the event's action state to false
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventData.id ? { ...event, action: false } : event
          )
        );
  
        message.success("Event deleted successfully.");
        loadEvents();
      } else {
        message.error("Failed to delete the event.");
      }
    } catch (error) {
      console.error("Error while deleting the event:", error);
      message.error("An error occurred while deleting the event.");
    }
  };
  
  

      
  const columns = [
    { title: "Event Id", dataIndex: "id", key: "id" },
    { title: "Event Name", dataIndex: "eventName", key: "eventName" },
    { title: "Timing", dataIndex: "eventTiming", key: "eventTiming" },
    { title: "Capacity", dataIndex: "eventCapacity", key: "eventCapacity" },
    { title: "Price (Adult)", dataIndex: "eventPriceAdult", key: "eventPriceAdult" },
    { title: "Price (Child)", dataIndex: "eventPriceChild", key: "eventPriceChild" },
    {
      title: "Image",
      dataIndex: "eventimages", 
      key: "eventimages",
      render: (text, record) => (
        <img 
          src={record.eventimages} 
          alt={record.eventName} 
          style={{ width: "100px", height: "auto", objectFit: "cover" }} 
        />
      ),
    },
    

    {
      title: 'Display',
      dataIndex: 'eventDisplay',
      key: 'eventDisplay',
      render: (eventDisplay) => (
       
          <span style={{ cursor: 'pointer', color: eventDisplay ? 'blue' : 'orange' }}>
            {eventDisplay ? 'Display' : 'Not Display'}
          </span>
     
      ),
      filters: [
        { text: 'Display', value: true },
        { text: 'Not Display', value: false },
      ],
      onFilter: (value, record) => record. eventDisplay === value,
    },
    {
      title: 'Status',
      dataIndex: 'eventStatus',
      key: 'eventStatus',
      render: (_, record) => (
      
          <span style={{ color: record.eventStatus ? 'green' : 'red' ,cursor: 'pointer'}}>
            {record.eventStatus ? 'Open' : 'Close'} 
          </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditOutlined
          style={{ color: '#1890ff', cursor: 'pointer', marginRight: '12px' }} onClick={() => handleEditEvent(record)}/>
    
         
          <Popconfirm
            title="Are you sure you want to delete this event?"
            onConfirm={() => handleDeleteEvent(record)} // Pass event for deletion
            okText="Yes"
            cancelText="No"
          >
             <DeleteOutlined
        style={{ color: '#ff4d4f', cursor: 'pointer' }}/>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="main-container"> 
      <div className="table-header">
        <h2 style={{color:"black"}}>Admin Dashboard</h2>
        <div className="container">
          <Button
              type="primary"
              className="add-event-button"
              onClick={() => setModalVisible(true)}
              style={{ marginBottom: '16px' }}
          >
              Add New Event
          </Button>
          <Button 
              icon={<ReloadOutlined />} 
              onClick={loadEvents} 
              style={{ marginBottom: '16px' }}
              className="reload-button"
              loading={loading} 
          />
        </div>
      </div>
      <Table className="event-table"
          columns={columns}
          dataSource={events}
          pagination={{ pageSize: 11 }}
          rowKey="id"
        />

      {isModalVisible && (
        <AddNewEvent
          visible={isModalVisible}
          events={editEventData}
          onCancel={handleCancel}
          onSuccess={loadEvents}
          isEdit={isEdit}
        />
      )}

    </div>
  );
};

export default Dashboard;