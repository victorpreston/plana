import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { createRoleChangeRequest, approveRoleChangeRequest, rejectRoleChangeRequest, getRoleChangeRequests } from '../services/role.services';
import { Role } from '../interfaces/user.interfaces';

/**
 * Controller for creating a role change request
 * @param req 
 * @param res 
 */
export const requestRoleChange = async (req: AuthRequest, res: Response) => {
  try {
    const { newRole } = req.body;
    const userId = req.user?.userId; //user ID is set on req.user by the auth middleware
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }
    const request = await createRoleChangeRequest(userId, newRole);
    res.status(201).json(request);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

/**
 * Controller for approving a role change request
 * @param req 
 * @param res 
 */
export const approveRoleChange = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const request = await approveRoleChangeRequest(requestId);
    res.status(200).json(request);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

/**
 * Controller for rejecting a role change request
 * @param req 
 * @param res 
 */
export const rejectRoleChange = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const request = await rejectRoleChangeRequest(requestId);
    res.status(200).json(request);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

/**
 * Controller for getting all role change requests
 * @param req 
 * @param res 
 */
export const getAllRoleChangeRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await getRoleChangeRequests();
    res.status(200).json(requests);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};