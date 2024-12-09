class GeoLib {
  public getAddressFromCoordinates(coordinates: [number, number] | { lat: number; lng: number }): Promise<string> {
    return Promise.reject(new Error('Not implemented'));
  };

  public getCoordinatesFromAddress(address: string): Promise<{ lat: number; lng: number }> {
    return Promise.reject(new Error('Not implemented'));
  };
}

export default new GeoLib();
