// Document-> for safety
import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

// MessageSchema ka type is Schema of the above message type
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// This is typescirpt so in string -> s small
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified:boolean;
  isAcceptingMessage: boolean;
  message: Message[];
}

// This is mongoose so in String -> S capital
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true,"User name is required"],
    trim:true,
    unique:true
  },
  email: {
    type: String,
    required: [true,"Email is required"],
    unique:true,
    // this email pattern is called Regexr
    match:[/.+\@.+\.+/,'please use a valid email address']
  },
  password: {
    type: String,
    required: [true,"Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true,"Verification code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true,"Verify code expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default:false
  },
  isAcceptingMessage: {
    type: Boolean,
    default:true
  },
  message: [MessageSchema]

});

// agr backend me already hai toh first vala jayega nhi toh 2nd vala vha backend me model bna dega
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))

export default UserModel
