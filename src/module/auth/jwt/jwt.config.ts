const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const jwtConstants = {
  secret: jwtSecret,
  expiresIn: process.env.JWT_EXPIRATION || '1h',
};
