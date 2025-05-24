public class LocationDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Details { get; set; } = null!;
    public string Address { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public string Journal { get; set; } = null!;
    public DateTime Date { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}