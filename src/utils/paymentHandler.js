import { useState } from 'react';
import { createPaymentOrder, makePayment } from './apiUtils';
export const PaymentHandler = async (details,setQrData) => {
  
  try {
    const calculateAmount = { amount: details.amount * 100 };
    
    // Create payment order
    const orderResponse = await createPaymentOrder(calculateAmount);
    console.log("Order Response:", orderResponse);

    if (!orderResponse.data) {
      throw new Error("Invalid response from createPaymentOrder API");
    }

    // Razorpay options
    const options = {
      key: orderResponse.data.key, // Razorpay API Key
      amount: calculateAmount.amount, // Amount in the smallest currency unit (e.g., paise for INR)
      currency: details.currency,
      name: details.name,
      description: details.description,
      order_id: orderResponse.data.order_id, // Razorpay order ID

      handler: async function (response) {
        try {
          // Capture payment details and send to server
          const paymentResponse = await makePayment({
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: details.amount * 100, // Match with the original amount
          });

          console.log('Payment Response:', paymentResponse);
       // Set the QR data only for successful payment
       setQrData(response.razorpay_payment_id); // Update qrData with payment ID

        } catch (error) {
          console.error("Error in handler function:", error);
        }
      },

      prefill: {
        name: details.name,
        email: details.email,
        contact: details.contact,
      },
      theme: {
        color: "#F37254", // Customize the Razorpay payment window color
      },
    };

    console.log("Razorpay Options:", options);

    // Initialize and open Razorpay payment modal
    const rzp = new window.Razorpay(options);
    rzp.open();

    // Handle Razorpay close event (optional)
    rzp.on('payment.failed', function (response) {
      console.error("Payment Failed:", response.error);
    });

  } catch (error) {
    console.error("Payment Error:", error);
  }
  
  
};
