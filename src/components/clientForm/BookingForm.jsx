import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button } from 'antd';
import './BookingForm.css';
import { PaymentHandler } from '../../utils/paymentHandler';
import Qrgenerator from '../Qrgenerator'; // Import QR generator

const BookingForm = ({ event, visible,onClose,IsCash }) => {
  const [form] = Form.useForm();
  const [qrData, setQrData] = useState(''); // State for QR Code Data
  const [bookingDetails, setBookingDetails] = useState(null); // State for booking details
  
  const handlePayment = (details) => {
    PaymentHandler(details, setQrData)
      .then(() => {
        setBookingDetails(details); // Save booking details for display
      })
      .catch((error) => {
        console.error("Payment Error:", error);
      });
  };

  // function to generate QR code using the paymentID generated for cashdetails
  const handleCashDetails=(details)=>{
    setQrData(details);
    console.log('qrdata', qrData);
  }


  const handleOk = () => {
    const paymentid='aer56718hj';
    form
      .validateFields()
      .then((values) => {
        const inputdata = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          adults: values.adults,
          children: values.children,
          currency: 'INR',
          description: `Booking for ${event.eventName} by ${values.name} for ${values.adults} adults and ${values.children} children`,
          amount: values.adults * 100 + values.children * 50,
        };
      // if (IsCash) {
      //   handleCashDetails(paymentid); // Handle cash payments
        // } else {
        handlePayment(inputdata); // Initiate payment process
      //  }   
     })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };

  return (
    <Modal
      title={`Booking for ${event.eventName}`}
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null} // Remove default footer buttons
    >
      {!qrData ? (
        <Form
          form={form}
          layout="vertical"
          name="bookingForm"
          initialValues={{
            adults: 0,
            children: 0,
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input placeholder="Enter your phone number" max={10} />
          </Form.Item>
          <Form.Item
            name="adults"
            label="No. of Adults"
            rules={[{ required: true, message: 'Please enter the number of adults' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="children"
            label="No. of Children"
            rules={[{ required: true, message: 'Please enter the number of children' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Button type="primary" onClick={handleOk} >
          {IsCash ? 'Confirm Cash Booking' : 'Make Payment'}
          </Button>
        </Form>
      ) : (
        <div>
          <h3>Booking Successful!</h3>
          <p><strong>Event:</strong> {event.eventName}</p>
          <p><strong>Name:</strong> {bookingDetails.name}</p>
          <p><strong>Email:</strong> {bookingDetails.email}</p>
          <p><strong>Phone:</strong> {bookingDetails.phone}</p>
          <p><strong>Adults:</strong> {bookingDetails.adults}</p>
          <p><strong>Children:</strong> {bookingDetails.children}</p>
          <p><strong>Amount Paid:</strong> ₹{bookingDetails.amount }</p>
          <Qrgenerator data={qrData} /> {/* Display the QR code */}
        </div>
      )}
    </Modal>
  );
};

export default BookingForm;
