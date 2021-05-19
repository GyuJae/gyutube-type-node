import mongoose, { Document, Schema, Model } from "mongoose";

export interface IVideo {
  title: String;
  description: String;
  createdAt: Date;
  hashtags?: [{ type: String }];
  meta: {
    views: Number;
    rating: Number;
  };
}

interface IVideoDocument extends IVideo, Document {
  formatHashtags: (hashtags: String) => Promise<String[]>;
}

interface IVideoModel extends Model<IVideoDocument> {}

const VideoSchema: Schema<IVideoModel> = new Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

VideoSchema.method.formatHashtags = function async(hashtags: String): String[] {
  return hashtags
    .split(",")
    .map((word: any) => (word.startsWith("#") ? word : `#${word}`));
};

const Video = mongoose.model<IVideoDocument, IVideoModel>("Video", VideoSchema);

export default Video;
