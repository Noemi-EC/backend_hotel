import mongoose, { ConnectOptions } from 'mongoose';

let mongooseInstance: typeof mongoose | null = null;

export async function getMongooseInstance(
  uri: string,
  options?: ConnectOptions,
): Promise<typeof mongoose> {
  if (!mongooseInstance) {
    mongooseInstance = await mongoose.connect(uri, options);
  }
  return mongooseInstance;
}