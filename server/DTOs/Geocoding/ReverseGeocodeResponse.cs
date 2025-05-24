namespace TravelLog.Api.DTOs.Geocoding;

public class ReverseGeocodeResponse
{
    public string? Name { get; set; }
    public string Details { get; set; } = null!;
    public string Address { get; set; } = null!;
    public IEnumerable<string>? PlaceType { get; set; }
    public double Longitude { get; set; }
    public double Latitude { get; set; }
}
