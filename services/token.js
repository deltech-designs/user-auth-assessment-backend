import randomstring from 'randomstring';
import Token from '../models/token.js';
import User from '../models/user.js';

const generateToken = async (user) => {
  try {
    const options = { charset: 'numeric', length: 6 };
    let token;
    let checkToken;
    do {
      token = randomstring.generate(options);
      checkToken = await Token.findOne({ token, userId: user?._id });
    } while (checkToken);
    return token;
  } catch (error) {
    console.error('Error during generateToken:', error);
    return null;
  }
};

export const createToken = async (user, type, hours, data = {}) => {
  try {
    const token = await generateToken(user);
    if (!token) {
      throw new Error('Failed to generate OTP');
    }
    await Token.deleteMany({ userId: user?._id, type });
    await Token.create({
      userId: user._id,
      type,
      token,
      expiresAt: Date.now() + hours * 60 * 60 * 1000,
      data,
    });
    return { status: true, message: 'Token Created', data: token };
  } catch (error) {
    console.error('Error during createToken:', error);
    return { status: false, message: 'Token creation failed' };
  }
};

export const verifyToken = async (token, email, type, password = null) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return { status: false, message: 'Invalid Token' };

    const foundToken = await Token.findOne({ userId: user?._id, token, type });
    if (!foundToken || Date.now() > foundToken.expiresAt)
      return { status: false, message: 'Expired Token' };

    await Token.deleteMany({ userId: user?._id, type });

    if (type === 'verifyEmail') {
      user.isVerified = true;
    } else if (type === 'resetPassword' && password) {
      user.password = password; // In production, hash the password
    }

    await user.save();
    return { status: true, message: 'Token verified successfully' };
  } catch (error) {
    console.error('Error during verifyToken:', error);
    return { status: false, message: 'Verification failed' };
  }
};
