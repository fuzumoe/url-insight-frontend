export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt?: string;
}
