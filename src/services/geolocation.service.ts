import { CoordinatesDTO } from "../dtos/user.dto";

export class GeolocationService {
  private geocodingApiUrl: string;
  private reverseApiUrl: string;

  constructor(geocodingApiUrl: string, reverseApiUrl: string) {
    this.geocodingApiUrl = geocodingApiUrl;
    this.reverseApiUrl = reverseApiUrl;
  }

  private async fetchFromAPI(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error during API request: ${error.message}`);
    }
  }

  async getCoordinatesFromAddress(address: string): Promise<CoordinatesDTO> {
    const url = new URL(this.geocodingApiUrl);
    url.searchParams.append("q", address);
    url.searchParams.append("format", "json");
    url.searchParams.append("limit", "1");

    const [data] = await this.fetchFromAPI(url.toString());

    if (!data) {
      throw new Error("Address not found.");
    }

    const response = {
      lat: data?.lat ?? 0,
      lng: data?.lon ?? 0,
    };
    return response;
  }

  async getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
    const url = new URL(this.reverseApiUrl);
    url.searchParams.append("lat", lat.toString());
    url.searchParams.append("lon", lng.toString());
    url.searchParams.append("format", "json");
    url.searchParams.append("limit", "1");

    const data = await this.fetchFromAPI(url.toString());
    if (!data.display_name) {
      throw new Error("Coordinates not found.");
    }

    return data.display_name;
  }
}
