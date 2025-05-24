
namespace TravelLog.Api.Entities;

public class Location
{
    public int Id { get; set; }
    public string UserId { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Details { get; set; } = null!;
    public string Address { get; set; } = null!;
    public byte[] Image { get; set; } = [];
    public string? ImageMime { get; set; }
    public string Journal { get; set; } = null!;
    public DateTime Date { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
