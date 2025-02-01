import { model, Schema } from 'mongoose';
import { BookModel, TBook } from './book.interface';

const BookSchema = new Schema<TBook, BookModel>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    coverImage: { type: String, trim: true },
    publishedDate: { type: Date, default: new Date() },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

//middlewares

BookSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.where({ isDeleted: { $ne: true }, isPublished: { $ne: false } });
  next();
});

BookSchema.pre('aggregate', function (next) {
  const pipeline = this.pipeline();
  pipeline.unshift({
    $match: { isDeleted: { $ne: true }, isPublished: { $ne: false } },
  });
  next();
});

//statics
BookSchema.statics.isBookExistById = async function (id) {
  const existingBook = Book.findById({ _id: id });
  return existingBook;
};

export const Book = model<TBook, BookModel>('Book', BookSchema);
