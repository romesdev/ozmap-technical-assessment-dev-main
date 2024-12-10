export type Result<T> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
};

export type User = {
  _id: string;
  name: string;
  email: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
};
