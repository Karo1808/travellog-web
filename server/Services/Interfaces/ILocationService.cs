namespace server.Services.Interfaces;

public interface ILocationService
{
    Task<LocationDto> CreateAsync(CreateLocationRequest dto, string userId);
    Task<LocationDto?> GetAsync(int id, string userId);
    Task<IEnumerable<LocationDto>> ListAsync(string userId);
    Task<(byte[] Data, string MimeType)?> GetImageAsync(int id, string userId);
    // Task<LocationDto?> UpdateAsync(int id, LocationCreateDto dto, string userId);
    // Task<bool> DeleteAsync(int id, string userId);
}

