import prisma from '../config/database.config';
import { Profile, User } from '../interfaces/user.interfaces';
import { mapProfile } from './user.services';
import bcrypt from 'bcrypt';


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