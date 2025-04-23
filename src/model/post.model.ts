import mongoose, { Schema } from "mongoose";
import { IPost } from "../types/post.type";

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model<IPost>("post", postSchema);

export default PostModel;
