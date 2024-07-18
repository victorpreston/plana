import { Request, Response } from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserById, 
  updateUserRole, 
  getAllUsers, 
  deleteUser, 
  loginUserWithGoogle 
} from '../services/user.services';
import { Role } from '../interfaces/user.interfaces';

/**
 * Controller for registering a new user
 * @param req 
 * @param res 
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;
    const user = await registerUser(email, password, firstName, lastName, phone, role);
    res.status(201).json(user);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};




/**
 * Login a user
 * @param req 
 * @param res 
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.status(200).json({ user, token });
  } catch (error) {
    const err = error as Error;
    res.status(401).json({ error: err.message });
  }
};



/**
 * Login a user with Google
 * @param req 
 * @param res 
 */
export const loginWithGoogle = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const { user, token } = await loginUserWithGoogle(idToken);
    res.status(200).json({ user, token });
  } catch (error) {
    const err = error as Error;
    res.status(401).json({ error: err.message });
  }
};



/**
 * Get user details
 * @param req 
 * @param res 
 * @returns 
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};



/**
 * Update user role
 * @param req 
 * @param res 
 * @returns 
 */
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!Object.values(Role).includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await updateUserRole(id, role);
    res.status(200).json(user);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};



/**
 * Get all users
 * @param req 
 * @param res 
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};



/**
 * Delete user (soft delete)
 * @param req 
 * @param res 
 */
export const removeUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await deleteUser(id);
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  };