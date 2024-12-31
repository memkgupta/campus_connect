import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    formName: {
      type: String,
      required: true,
    },
    formType: {
      type: String,
      enum: ['Recruitment', 'Feedback', 'Event', 'Custom'],
      required: true,
    },
    fields: [
      {
        fieldLabel: {
          type: String,  // Label for the field (e.g., 'Name', 'Motivation')
          required: true,
        },
        fieldType: {
          type: String,  // Type of the field (e.g., 'text', 'textarea', 'number', 'date', 'select')
          enum: ['text', 'textarea', 'number', 'date', 'select', 'radio', 'checkbox','image'],
          required: true,
        },
        isRequired: {
          type: Boolean, // Indicates whether the field is mandatory
          default: false,
        },
        options: {
          type: [String], // For select, radio, or checkbox fields (e.g., ['Option 1', 'Option 2'])
        },
        placeholder: {
          type: String,  // Placeholder text (optional)
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Form = mongoose.model('Form', formSchema);
  module.exports = Form;