import React, { useEffect, useState } from "react";
import { Card, Button, message, Tag } from "antd";
import BookingForm from "../clientForm/BookingForm";
import "./EventTable.css";
import { fetchEvents } from "../../utils/apiUtils";

function EventTable(Iscash) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const[isModalVisible,setModalVisible]= useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      console.log("Events Data:", data);
      setEvents(data); // Ensure data is in the correct format (array of objects).
    } catch (error) {
      console.error("Error fetching events:", error);
      message.error("Error Fetching events");
    }
  };

  // const handleCashDetail=(record)=>{
  //   setIscash(true);
  //   setModalVisible(true);
  // }

  const handleBookTickets = (event) => {
    setSelectedEvent(event);
  };
  
  const closeForm = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="container">
      <h2 className="welcome">Welcome to Chandragiri</h2>
      <div className="cards-grid">
        {events.length > 0 ? (
          events.map((event) => (
            <Card
              key={event.id}
              hoverable
              cover={
                <div className="custom-cover">
                  <img
                    className="image"
                    alt="example"
                    src={event.eventimages}/>
                    {console.log(event.eventimages)}
                </div>
              }
              className="event-card"
              bordered={true}
              style={{ width: 300, margin: '10px' }}
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleBookTickets(event)}
                  disabled={!event.eventStatus}
                >
                  Book
                </Button>,
              ]}
            >
            <div className="custom-title"><b>{event.eventName}</b></div>

              <p>
                <strong>Time:</strong> {event.eventTiming}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {event.eventStatus ? (
                  <Tag color="green">Open</Tag>
                ) : (
                  <Tag color="red">Close</Tag>
                )}
              </p>
            </Card>
          ))
        ) : (
          <p>No events available at the moment.</p>
        )}
      </div>
      {selectedEvent && (
        <BookingForm
          event={selectedEvent}
          visible={!!selectedEvent}
          onClose={closeForm}
          IsCash={Iscash}
        />
      )}
    </div>
  );
}

export default EventTable;
