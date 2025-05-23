namespace TravelLog.Api.DTOs.Geocoding;

public class ReverseGeocodeResponse
{
    public string Formatted { get; set; } = null!;
    public string? Name { get; set; }
    public IEnumerable<string>? PlaceType { get; set; }
    public double Longitude { get; set; }
    public double Latitude { get; set; }
}
