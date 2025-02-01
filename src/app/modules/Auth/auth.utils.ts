import jwt from 'jsonwebtoken';

const createToken = (
  jwtPayload: Record<string, unknown>,

  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export default createToken;
