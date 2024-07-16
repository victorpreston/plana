import bcrypt from 'bcrypt';
import prisma from '../config/database.config';
import { User, Role, Profile } from '../interfaces/user.interfaces';
import { generateToken } from '../config/jwt.config';
import { Prisma } from '@prisma/client';

// Function to map Prisma Role to TypeScript Role
const mapRole = (prismaRole: any): Role => {
  switch (prismaRole) {
    case 'ATTENDEE':
      return Role.ATTENDEE;
    case 'MANAGER':
      return Role.MANAGER;
    case 'ADMIN':
      return Role.ADMIN;
    default:
      throw new Error('Invalid role');
  }
};

// Function to map Prisma Profile to TypeScript Profile
export const mapProfile = (prismaProfile: any): Profile => {
  return {
    id: prismaProfile.id,
    userId: prismaProfile.userId,
    firstName: prismaProfile.firstName,
    lastName: prismaProfile.lastName,
    phone: prismaProfile.phone,
    imageUrl: prismaProfile.imageUrl,
    createdAt: prismaProfile.createdAt,
    updatedAt: prismaProfile.updatedAt,
    isDeleted: prismaProfile.isDeleted,
  };
};

// Function to register a new user
export const registerUser = async (email: string, password: string, firstName: string, lastName: string, phone: string, role: Role = Role.ATTENDEE): Promise<User> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,  // Use the role parameter
        profile: {
          create: {
            firstName,
            lastName,
            phone,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return {
      ...newUser,
      role: mapRole(newUser.role),
      profile: newUser.profile ? mapProfile(newUser.profile) : undefined,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Handle unique constraint violation
        throw new Error(`A user with the email ${email} already exists.`);
      }
    }
    throw error;
  }
};

// Function to login a user
export const loginUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user.id, user.role);

  return {
    user: {
      ...user,
      role: mapRole(user.role),
      profile: user.profile ? mapProfile(user.profile) : undefined,
    },
    token,
  };
};

// Function to fetch user details
export const getUserById = async (userId: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    return null;
  }

  return {
    ...user,
    role: mapRole(user.role),
    profile: user.profile ? mapProfile(user.profile) : undefined,
  };
};

// Function to update user role
export const updateUserRole = async (userId: string, role: Role): Promise<User> => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    include: { profile: true },
  });

  return {
    ...updatedUser,
    role: mapRole(updatedUser.role),
    profile: updatedUser.profile ? mapProfile(updatedUser.profile) : undefined,
  };
};

// Function to get all users
export const getAllUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany({
    where: { isDeleted: false },
    include: { profile: true },
  });

  return users.map(user => ({
    ...user,
    role: mapRole(user.role),
    profile: user.profile ? mapProfile(user.profile) : undefined,
  }));
};

// Function to delete a user (soft delete)
export const deleteUser = async (userId: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true },
  });
};