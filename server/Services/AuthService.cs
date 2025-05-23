using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using server.DTOs.Auth;
using server.Services.Interfaces;
using TravelLog.Api.Entities;

namespace server.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _config;

    public AuthService(UserManager<ApplicationUser> userManger, IConfiguration configuration)
    {
        _userManager = userManger;
        _config = configuration;
    }

    public async Task<IdentityResult> RegisterAsync(RegisterRequest dto)
    {
        var user = new ApplicationUser
        {
            UserName = dto.Username,
            Email = dto.Email
        };

        return await _userManager.CreateAsync(user, dto.Password);
    }

    public async Task<string?> LoginAsync(LoginRequest dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            return null;

        var valid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!valid)
            return null;

        var claims = new[]
        {
                new Claim(JwtRegisteredClaimNames.Sub,  user.Id),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName!),
                new Claim(JwtRegisteredClaimNames.Jti,  Guid.NewGuid().ToString()),
            };

        var keyBytes = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);

        var creds = new SigningCredentials(
          new SymmetricSecurityKey(keyBytes),
          SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.MaxValue,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<ApplicationUser?> MeAsync(ClaimsPrincipal? claims)
    {
        return await _userManager.GetUserAsync(claims);
    }
}