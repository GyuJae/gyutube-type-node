import mongoose, { Document, Schema } from "mongoose";

export interface IVideo extends Document {
  title: String;
  description: String;
  createdAt: Date;
  hashtags?: string[];
  meta: {
    views: Number;
    rating: Number;
  };
}

const VideoSchema: Schema<IVideo> = new Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

const Video = mongoose.model<IVideo>("Video", VideoSchema);

export default Video;
