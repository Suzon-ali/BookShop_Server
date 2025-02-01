import { model, Schema } from 'mongoose';
import { BlogModel, TBlog } from './blog.interface';

const blogSchema = new Schema<TBlog, BlogModel>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

//middlewares

blogSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.where({ isDeleted: { $ne: true }, isPublished: { $ne: false } });
  next();
});

blogSchema.pre('aggregate', function (next) {
  const pipeline = this.pipeline();
  pipeline.unshift({
    $match: { isDeleted: { $ne: true }, isPublished: { $ne: false } },
  });
  next();
});

//statics
blogSchema.statics.isBlogExistById = async function (id) {
  const existingBlog = Blog.findById({ _id: id });
  return existingBlog;
};

export const Blog = model<TBlog, BlogModel>('Blog', blogSchema);
