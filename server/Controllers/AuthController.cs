using Microsoft.AspNetCore.Mvc;
using server.DTOs.Auth;
using server.Services.Interfaces;

namespace TravelLog.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("register")]
    public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var result = await _auth.RegisterAsync(dto);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { Message = "Registration successful" });
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var token = await _auth.LoginAsync(dto);
        if (token == null)
            return Unauthorized(new { Message = "Invalid Credentials" });

        return Ok(new { Token = token });
    }

    [HttpGet("me")]
    public async Task<ActionResult<MeResponse>> Me()
    {
        var user = await _auth.MeAsync(User);

        if (user == null)
        {
            return Unauthorized();
        }

        var result = new
        {
            id = user.Id,
            username = user.UserName,
            email = user.Email,
        };

        return Ok(result);
    }
}
