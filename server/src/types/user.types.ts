export interface IUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image?: string;
  city?: string;
  bio?: string;
  isActive: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}