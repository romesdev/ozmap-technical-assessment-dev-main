type CoordinatesDTO = {
  lat: number;
  lng: number;
};

export type SaveUserDTO = {
  name: string;
  email: string;
  address?: string;
  coordinates?: CoordinatesDTO;
};
