using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using server.DTOs.Auth;
using TravelLog.Api.Entities;

namespace server.Services.Interfaces;

public interface IAuthService
{
    Task<IdentityResult> RegisterAsync(RegisterRequest dto);
    Task<string?> LoginAsync(LoginRequest dto);
    Task<ApplicationUser?> MeAsync(ClaimsPrincipal? claims);
}
