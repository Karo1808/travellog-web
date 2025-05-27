using System.ComponentModel.DataAnnotations;

public class UpdateLocationRequest
{
    [Required]
    public int Id { get; set; }

    [Required, DataType(DataType.DateTime)]
    public DateTime Date { get; set; }

    public IFormFile Image { get; set; } = null!;

    [MaxLength(1_000)]
    public string? Journal { get; set; }
}
