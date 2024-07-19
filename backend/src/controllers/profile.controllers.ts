import { Request, Response } from 'express';
import { 
  updateProfile, 
  getProfileByUserId, 
  updatePassword,
  requestPasswordReset as requestPasswordResetService,
  resetPassword as resetPasswordService
} from '../services/profile.services';




/**
 * Function to request password reset
 * @param req 
 * @param res 
 */
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await requestPasswordResetService(email);
    res.status(200).json({ message: 'Password reset code sent to email' });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};


/**
 * Function to reset password
 * @param req 
 * @param res 
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, resetCode, newPassword } = req.body;  // Correct key name
    await resetPasswordService(email, resetCode, newPassword);  // Correct key name
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};



/**
 * Get profile by user ID
 * @param req 
 * @param res 
 * @returns 
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const profile = await getProfileByUserId(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};



/**
 * Update profile
 * @param req 
 * @param res 
 */
export const editProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { email, ...profileData } = req.body;
    const profile = await updateProfile(userId, profileData, email);
    res.status(200).json(profile);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};



/**
 * Update password
 * @param req 
 * @param res 
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    await updatePassword(userId, newPassword);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};