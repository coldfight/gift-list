export interface User {
  username: string;
  jwtToken: string;
  refreshToken?: string;
  loggedIn: boolean;
}
