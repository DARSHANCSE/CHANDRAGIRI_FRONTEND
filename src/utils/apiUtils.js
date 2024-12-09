import axios from "axios";
import apiClient from "../components/Api/apiClient";
import Cookies from 'js-cookie'; // Import the cookies library
const BASE_URL= " http://127.0.0.1:8000";

//  * Function to create a new purchase.
//  * This function makes a POST request to the 'purchase' endpoint.
 /**  
  * @param {Object} eventData   //The data for the new event to be added.
   *@returns {Promise}         //Axios promise with response data or error.

*/
const token = Cookies.get('jwt');
console.log('TOKEN FROM UTIL FILE : ',token);

// Fuction to authenticate login
export const loginAuth= async(userData) => {
    try{
        const response = await axios.post(`${BASE_URL}/login/`, userData);
        console.log('Api login post successfully',response);
        return response;
    } catch(error){
        console.error('Error fetching login authentication:', error);
        throw new Error(error.response?.data?.message || 'Failed to login');
    }
};

// Function to authenticate logout
export const logoutAuth = async (userData) => {
    try{
      const response = await axios.post(`${BASE_URL}/logout`, userData);
      console.log('Api login post successfully',response);
      return response; 
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to logout');
    }
  }

  export const refreshAuthToken = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth-token-refresh/`, data); // Replace with your API endpoint
      return response;
    } catch (error) {
      throw error;
    }
  };
  

// Funtion to get event data
export const fetchEvents= async() => {
    try{
        const response = await apiClient.get(`/event/`);
        console.log('Api event fetched successfully',response);
        return response.data;
    } catch(error){
        console.error('Error fetching event data:', error);
        throw error;
    }
};

// Fuction to add event
export const makeEvent = async(eventData) => {
    try{
        const response = await apiClient.post(`/event/`, eventData);
        console.log('Api login post  successfully',response);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create event');
    }
};

export const deleteEvent = async (eventData) => {
    try {
      const response = await apiClient.delete(`/event/${eventData.id}/`);
      console.log("API event deleted successfully:", response);
  
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error deleting event:", error);
  
      throw new Error(
        error.response?.data?.message || "Failed to delete the event"
      );
    }
  };
  
// function to update event
export const updateEvent = async (events, token,csrfToken) => {
  if (!events.id) {
      throw new Error("Event ID is required to update an event.");
  }

  try {
      // Add headers for token authentication

      const response = await apiClient.put(
          `/event/${events.id}`, 
          events, 
          {
              headers: {
                  Authorization: `Bearer ${token}`, // Include the token
                  'Content-Type': 'multipart/form-data',
                    'X-CSRFToken ': csrfToken,        // CSRF token
                    'Content-Type': 'application/json', // Adjust if necessary // Assuming you are sending form data
              },
          }
      );

      console.log('API event updated successfully', response);
      return response;
  } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
  }
};

  export const addEventnew = async (eventData) => {
    try {
        // // Create a FormData object
        const formData = new FormData();

        // Append event data to FormData
        formData.append('eventName', eventData.eventName);
        formData.append('eventTiming', eventData.eventTiming);
        formData.append('eventStatus', eventData.eventStatus);
        formData.append('eventDisplay', eventData.eventDisplay);
        formData.append('eventActive', eventData.action);
        formData.append('eventPriceAdult', eventData.eventPriceAdult);
        formData.append('eventPriceChild', eventData.eventPriceChild);
        formData.append('eventCapacity', eventData.eventCapacity);
        // If an image is provided, append it to the form data
       
        formData.append('eventimages',eventData.eventimages);
        

        // Send the request with multipart/form-data
        const response = await apiClient.post(`/event/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('API event added successfully', response);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add event');
    }
};


// function to create payment order
export const createPaymentOrder = async (amount) => {
    try {
      // Step 1: Get the order ID from your backend
      const response = await apiClient.post(`/create-order/`, amount);
      console.log('Payment Order ID Recieved', response);
      return response;
    } catch (error) {
        console.error("Unable to create order:", error);
        throw new Error(error.response?.data?.message || "Unable to create order");
    }
};

// function to make payment
export const makePayment = async (paymentOrder) => {
    try{
        const response = await apiClient.post(`/payment/`,paymentOrder);
        console.log('Payment made successfully',response);
        return response;
        } catch (error) {
            console.error("Failed to make payment:", error);
            throw new Error(error.response?.data?.message || 'Failed to make payment');
    }
};

// function to fetch the booking history 
export const fetchBookingHistory = async (Id) => {
    try {
    const response = await apiClient.get(`/payment/${Id}/`
    );
    console.log('Booking history fetched successfully', response
    );
    return response
    } catch (error) {
        console.error("Failed to fetch booking history:", error);
        throw new Error(error.response?.data?.message || 'Failed to fetch booking history');
    }
};

