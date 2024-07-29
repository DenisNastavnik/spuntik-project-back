export interface UserRequest extends Request {
  user: {
    sub: string;
    email: string;
    roles: string;
  };
}
