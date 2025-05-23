using TravelLog.Api.DTOs.Geocoding;

namespace TravelLog.Api.Services.Interfaces;
public interface IGeoCodingService
{
    Task<ReverseGeocodeResponse?> ReverseGeocodeAsync(double lat, double lon);
}
