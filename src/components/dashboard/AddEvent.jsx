import {useState , useEffect} from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  TimePicker,
  InputNumber,
  Select,
  Upload,
} from "antd";
import { addEventnew, updateEvent } from "../../utils/apiUtils";
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
const csrfToken = Cookies.get('csrftoken');
const token = Cookies.get('jwt');




const AddNewEvent = ({ visible, events, onCancel, onSuccess   ,isEdit}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(''); // To store the image file

  
  useEffect(() => {
    if (isEdit && events) {
      form.setFieldsValue( { eventName:events.eventName,
      eventTiming: dayjs(events.eventTiming,"HH:MM"),// Format time as HH:mm
      eventCapacity:events.eventCapacity,
      eventPriceAdult:events.eventPriceAdult,
      eventPriceChild:events.eventPriceChild,
      eventStatus:events.eventStatus,
      eventDisplay:events.eventDisplay,
      
      
    });// Pre-fill form fields with event data
    }else {
      form.resetFields();
    }
  }, [isEdit, events, form]);

  

 // Handle file upload
  const handleImageUpload = (file) => {
    if (!file) {
      message.error("No file selected!");
      return false;
    }
   // Validate the file type
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
      message.error("Invalid file type! Please upload a JPEG, PNG, GIF, or WebP image.");
      return false;
    }
    // Validate the file size (e.g., limit to 2MB)
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      message.error("File size exceeds the limit of 2MB! Please choose a smaller file.");
      return false;
    }
    // Store the image file for submission
    setImageFile(file);
    // Provide success feedback
    message.success("Image uploaded successfully!");
    return false; // Prevent default upload behavior
  };
  
  
  
  const handleSubmit = async (values) => {
    console.log('values',values);
    try {
        setLoading(true);
                 
        const eventData = {
            eventName: values.eventName,
            eventCapacity:values.eventCapacity,
            eventTiming: values.eventTiming.format("HH:MM"),
            eventStatus: values.eventStatus,
            eventDisplay: values.eventDisplay,
            eventPriceAdult:values.eventPriceAdult,
            eventPriceChild:values.eventPriceChild,
            action: true, // Assuming eventActive is always true for new values
            eventimages: imageFile, // Pass the image file if it exists
        
        };
        
        if (isEdit) {
            await updateEvent(events,token,csrfToken);
            message.success("Event updated successfully!");
        } else {
            await addEventnew(eventData); // Pass both event data and image file
            message.success("Event added successfully!");
        }
        form.resetFields();
        onSuccess(); // To refresh event list in the parent
        onCancel(); // To close the modal after submission
    } catch (error) {
        message.error("Failed to save the event.");
    } finally {
        setLoading(false);
    }
};



  return (
    <Modal  title={isEdit ? 'Edit Event' : 'Add New Event'} visible={visible} onCancel={onCancel} footer={null}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Event Name"
          name="eventName"
          rules={[{ required: true, message: "Please input the event name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Event Timing"
          name="eventTiming"
          rules={[{ required: true, message: "Please select the event timing!" }]}
        >
          <TimePicker showTime />
        </Form.Item>

        <Form.Item
          label="Event Capacity"
          name="eventCapacity"
          rules={[{ required: true, message: "Please input the event capacity!" }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          label="Price (Adult)"
          name="eventPriceAdult"
          rules={[{ required: true, message: "Please input the adult price!" }]}
        >
         <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          label="Price (Child)"
          name="eventPriceChild"
          rules={[{ required: true, message: "Please input the child price!" }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          label="Event Status"
          name="eventStatus"
          rules={[{ required: true, message: "Please select the event status!" }]}
        >
          <Select placeholder="Select Event Status">
            <Select.Option value={true}>Open</Select.Option>
            <Select.Option value={false}>Close</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Event Display"
          name="eventDisplay"
          rules={[{ required: true, message: "Please select the event display!" }]}
        >
          <Select placeholder="Select Display Option">
            <Select.Option value={true}>Yes</Select.Option>
            <Select.Option value={false}>No</Select.Option>
          </Select>
        </Form.Item>
        {!isEdit && (
        <Form.Item label="Upload Event Image"
        name="eventimages">
        <Upload
          beforeUpload={handleImageUpload}
          maxCount={1}
          accept="image/*"
          listType="picture"
        >
          <Button>Click to Upload</Button>
        </Upload>
      </Form.Item>
         )}
   

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
          {isEdit ? 'Update' : 'Add'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewEvent;
