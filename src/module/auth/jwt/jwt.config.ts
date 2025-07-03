export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'a489253b509211d612feef5b378ff422',
  expiresIn: process.env.JWT_EXPIRATION || '1h',
};
