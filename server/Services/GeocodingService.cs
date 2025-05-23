using TravelLog.Api.DTOs.Geocoding;
using TravelLog.Api.Services.Interfaces;

namespace TravelLog.Api.Services;
public class GeoCodingService : IGeoCodingService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;

    public GeoCodingService(HttpClient http, IConfiguration cfg)
    {
        _http = http;
        _apiKey = cfg["Geoapify:ApiKey"]
            ?? throw new InvalidOperationException("Geoapify key not configured");
    }

    public async Task<ReverseGeocodeResponse?> ReverseGeocodeAsync(double lat, double lon)
    {
        var url = $"reverse?lat={lat}&lon={lon}&lang=pl&limit=1&apiKey={_apiKey}";
        var wrapper = await _http.GetFromJsonAsync<GeoapifyWrapper>(url);
        var feat = wrapper?.Features?.FirstOrDefault();
        if (feat == null) return null;

        return new ReverseGeocodeResponse
        {
            Formatted = $"{feat.Properties.Name ?? feat.Properties.Street ?? feat.Properties.County}, {feat.Properties.City}, {feat.Properties.Country}",
            Name = feat.Properties.Name,
            PlaceType = feat.Properties.PlaceType,
            Longitude = feat.Geometry.Coordinates[0],
            Latitude = feat.Geometry.Coordinates[1],
        };
    }

    private class GeoapifyWrapper
    {
        public List<Feature>? Features { get; set; }
        public class Feature
        {
            public Geometry Geometry { get; set; } = null!;
            public Properties Properties { get; set; } = null!;
        }
        public class Geometry { public double[] Coordinates { get; set; } = null!; }
        public class Properties
        {
            public string Formatted { get; set; } = null!;
            public string Street { get; set; } = null!;
            public string City { get; set; } = null!;
            public string Country { get; set; } = null!;
            public string County { get; set; } = null!;
            public string? Name { get; set; }
            public string[]? PlaceType { get; set; }
        }
    }
}
