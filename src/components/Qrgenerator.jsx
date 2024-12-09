import React from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Use QRCodeCanvas for rendering QR codes

const Qrgenerator = ({ data }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h3>Scan Your Payment QR Code</h3>
      <QRCodeCanvas 
        value={data} // The payment ID or data to encode in the QR code
        size={200} // Size of the QR code
        level="H" // Error correction level (H = High)
        bgColor="#ffffff" // Background color
        fgColor="#000000" // Foreground color
      />
      <p style={{ marginTop: '10px', fontSize: '14px' }}>Payment ID: {data}</p>
    </div>
  );
};

export default Qrgenerator;
