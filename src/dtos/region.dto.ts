export type Coordinates = [number, number];

export type Geometry = {
  type: "Polygon";
  coordinates: Coordinates[][];
};

export type SaveRegionDTO = {
  name: string;
  geometry: Geometry;
  ownerId: string;
};

export type UpdateRegionDTO = {
  name?: string;
  geometry?: Geometry;
  ownerId?: string;
};

export type QueryByDistanceDTO = {
  lat: string;
  lng: string;
  distance: string;
};

export type CoordinatesPointDTO = {
  lat: string;
  lng: string;
};
