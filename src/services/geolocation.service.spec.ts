import { describe, it, expect, vi } from 'vitest';
import { GeolocationService } from './geolocation.service';

describe('GeolocationService', () => {
  const mockGeocodingApiUrl = 'https://mock-geocoding-api.com/search';
  const mockReverseApiUrl = 'https://mock-reverse-api.com/reverse';

  const service = new GeolocationService(
    mockGeocodingApiUrl,
    mockReverseApiUrl
  );

  describe('getCoordinatesFromAddress', () => {
    it('should return coordinates for a valid address', async () => {
      const mockResponse = [
        {
          lat: 40.7128,
          lon: -74.006,
        },
      ];

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await service.getCoordinatesFromAddress('New York');

      expect(result).toEqual({ lat: 40.7128, lng: -74.006 });
      expect(fetch).toHaveBeenCalledWith(
        'https://mock-geocoding-api.com/search?q=New+York&format=json&limit=1'
      );
    });

    it('should throw an error when address is not found', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      });

      await expect(
        service.getCoordinatesFromAddress('Nonexistent Address')
      ).rejects.toThrowError('Address not found.');
    });

    it('should throw an error when there is a fetch failure', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network Error'));

      await expect(
        service.getCoordinatesFromAddress('New York')
      ).rejects.toThrowError('Error during API request: Network Error');
    });
  });

  describe('getAddressFromCoordinates', () => {
    it('should return address for valid coordinates', async () => {
      const mockResponse = {
        display_name: 'New York, USA',
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await service.getAddressFromCoordinates(40.7128, -74.006);

      expect(result).toBe('New York, USA');
      expect(fetch).toHaveBeenCalledWith(
        'https://mock-reverse-api.com/reverse?lat=40.7128&lon=-74.006&format=json&limit=1'
      );
    });

    it('should throw an error when coordinates are not found', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      });

      await expect(
        service.getAddressFromCoordinates(0, 0)
      ).rejects.toThrowError('Coordinates not found.');
    });

    it('should throw an error when there is a fetch failure', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network Error'));

      await expect(
        service.getAddressFromCoordinates(40.7128, -74.006)
      ).rejects.toThrowError('Error during API request: Network Error');
    });
  });
});
