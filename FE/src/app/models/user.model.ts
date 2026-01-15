export interface User {
  userId: number;
  username: string;
  createdDate: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}
