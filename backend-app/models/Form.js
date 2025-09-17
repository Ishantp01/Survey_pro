import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  link: { type: String, required: true }, // links the form to the response and is unique
  active: { type: Boolean, default: true }, // to make sure there's only one active form
  createdAt: { type: Date, default: Date.now }, // used to 
});

export default mongoose.model("Form", formSchema);
