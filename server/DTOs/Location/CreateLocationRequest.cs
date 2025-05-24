using System.ComponentModel.DataAnnotations;

public class CreateLocationRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = null!;


    [Required, MaxLength(100)]
    public string Details { get; set; } = null!;

    [Required, MaxLength(100)]
    public string Address { get; set; } = null!;

    public IFormFile Image { get; set; } = null!;

    [MaxLength(1_000)]
    public string Journal { get; set; } = null!;

    [Required, DataType(DataType.DateTime)]
    public DateTime Date { get; set; }

    [Range(-90, 90)]
    public double Latitude { get; set; }

    [Range(-180, 180)]
    public double Longitude { get; set; }
}