import prisma from '../config/database.config';
import { Profile, User } from '../interfaces/user.interfaces';
import { mapProfile } from './user.services';
import bcrypt from 'bcrypt';
import { sendPasswordResetEmail } from '../bg-services/mails/password-reset';



/**
 * Function to generate a random code
 * @param length 
 * @returns 
 */
const generateRandomCode = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Function to request a password reset
 * @param email 
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User with this email does not exist');
  }

  const resetCode = generateRandomCode(6);
  const hashedCode = await bcrypt.hash(resetCode, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: hashedCode,
      passwordResetTokenExpiry: new Date(Date.now() + 300000)
    },
  });

  await sendPasswordResetEmail(user.email, resetCode);
};




/**
 * Function to reset a user's password
 * @param email 
 * @param code 
 * @param newPassword 
 */
export const resetPassword = async (email: string, code: string, newPassword: string): Promise<void> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      passwordResetToken: {
        not: null,
      },
      passwordResetTokenExpiry: {
        gte: new Date(),
      },
    },
  });

  if (!user || !user.passwordResetToken) {
    throw new Error('Invalid or expired password reset code');
  }

  // console.log('Reset code:', code);
  // console.log('Stored reset token:', user.passwordResetToken);

  /* Ensure both code and passwordResetToken are strings and trimmed */
  const trimmedCode = code.trim();
  const trimmedToken = user.passwordResetToken.trim();

  const isCodeValid = await bcrypt.compare(trimmedCode, trimmedToken);
  if (!isCodeValid) {
    throw new Error('Invalid or expired password reset code');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiry: null,
    },
  });
};



/**
 * Function to update a user's profile and email
 * @param userId 
 * @param profileData 
 * @param email 
 * @returns 
 */
export const updateProfile = async (userId: string, profileData: Partial<Profile>, email?: string): Promise<Profile> => {
  const { firstName, lastName, phone, imageUrl } = profileData;

  if (email) {
    /*Update email separately to avoid conflicts with Profile update*/
    await prisma.user.update({
      where: { id: userId },
      data: { email },
    });
  }

  const updatedProfile = await prisma.profile.update({
    where: { userId },
    data: {
      firstName,
      lastName,
      phone,
      imageUrl
    },
  });

  return mapProfile(updatedProfile);
};




/**
 * Function to get a user's profile by userId
 * @param userId 
 * @returns 
 */
export const getProfileByUserId = async (userId: string): Promise<Profile | null> => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  return profile ? mapProfile(profile) : null;
};



/**
 * Function to update a user's password
 * @param userId 
 * @param newPassword 
 */
export const updatePassword = async (userId: string, newPassword: string): Promise<void> => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};