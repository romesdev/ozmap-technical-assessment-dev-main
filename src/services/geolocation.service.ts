const GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/search';
const REVERSE_API_URL = 'https://nominatim.openstreetmap.org/reverse?';

export class GeolocationService {
  static async getCoordinatesFromAddress(address: string) {
    try {
      const url = new URL(GEOCODING_API_URL);
      url.searchParams.append('q', address);
      url.searchParams.append('format', 'json');
      url.searchParams.append('limit', '1');

      const response = await fetch(url.toString());
      console.log(response);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch coordinates. Status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.length === 0) {
        throw new Error('Address not found.');
      }

      const { lat, lon } = data[0];
      return { lat, lng: lon };
    } catch (error: any) {
      throw new Error(`Error fetching coordinates: ${error.message}`);
    }
  }

  static async getAddressFromCoordinates(lat: number, lng: number) {
    try {
      console.log(lat, lng);
      const url = new URL(REVERSE_API_URL);
      url.searchParams.append('lat', lat.toString());
      url.searchParams.append('lon', lng.toString());
      url.searchParams.append('format', 'json');
      url.searchParams.append('limit', '1');

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to fetch address. Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.length === 0) {
        throw new Error('Coordinates not found.');
      }

      return data.display_name;
    } catch (error: any) {
      throw new Error(`Error fetching address: ${error.message}`);
    }
  }
}
