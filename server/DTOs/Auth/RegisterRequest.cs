using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Auth;

public class RegisterRequest
{
    [Required]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z0-9_-]+$", ErrorMessage = "Username can only contain letters, digits, underscore or hyphen.")]
    public string Username { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = null!;
}
