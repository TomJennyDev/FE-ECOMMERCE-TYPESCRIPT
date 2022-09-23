import jwtDecode, { JwtPayload } from "jwt-decode";

export const isValidToken = (accessToken: string): boolean => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<JwtPayload>(accessToken);
  const currentTime = Date.now() / 1000;

  return (decoded?.exp as number) > currentTime;
};
