import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IVideo extends Document {
  title: String;
  fileUrl: String;
  description: String;
  createdAt: Date;
  hashtags?: string[];
  meta: {
    views: Number;
    rating: Number;
  };
  owner: IUser["_id"];
}

const VideoSchema: Schema<IVideo> = new Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

const Video = mongoose.model<IVideo>("Video", VideoSchema);

export default Video;
