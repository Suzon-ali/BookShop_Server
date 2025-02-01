import { Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Search blogs by title or content
  search(searchableFields: string[]) {
    const search = this?.query?.search as string;
    if (search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        })),
      });
    }
    return this;
  }

  // Filter blogs by author ID
  filter() {
    const filter = this?.query?.filter;
    if (filter) {
      this.modelQuery = this.modelQuery.find({
        author: filter,
      });
    }
    return this;
  }

  // Sort blogs by specific fields and order
  sort() {
    const sortBy = (this?.query?.sortBy as string) || 'createdAt';
    const sortOrder = (this?.query?.sortOrder as string) === 'asc' ? '' : '-';
    const sort = `${sortOrder}${sortBy}`;

    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  // Paginate
  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // Field search
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',').join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
}

export default QueryBuilder;
