// Program.cs
using server.Services;
using server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using TravelLog.Api.Data;
using TravelLog.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Scalar.AspNetCore;
using TravelLog.Api.Services;
using TravelLog.Api.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);


if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

builder.Services
    .AddHttpClient<IGeoCodingService, GeoCodingService>(client =>
    {
        client.BaseAddress = new Uri("https://api.geoapify.com/v1/geocode/");
    });

builder.Services.AddDbContext<ApplicationDbContext>(opts =>
    opts.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.Configure<IdentityOptions>(opts =>
{
    opts.User.AllowedUserNameCharacters =
        "abcdefghijklmnopqrstuvwxyz" +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "0123456789-_.";
    opts.User.RequireUniqueEmail = true;
});

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddOpenApi("v1", opts =>
{
    opts.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ILocationService, LocationService>();

var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opts =>
{
    opts.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Issuer"],
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.MapScalarApiReference(options =>
    {
        options.WithTheme(ScalarTheme.Kepler).WithPreferredScheme("Bearer");
        options.WithLayout(ScalarLayout.Classic);

        options.WithDefaultHttpClient(
              ScalarTarget.JavaScript,
              ScalarClient.Fetch
            );
    });
}

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/health", () =>
    Results.Ok(new { status = "Healthy", timestamp = DateTime.UtcNow })
)
.AllowAnonymous()
.WithName("HealthCheck");

app.MapGet("/api/test/protected", (ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    var userName = user.Identity?.Name;
    var userRoles = user.FindAll(ClaimTypes.Role).Select(c => c.Value);

    return Results.Ok(new
    {
        message = "Access granted to protected endpoint!",
        authenticatedUser = userName,
        userId,
        roles = userRoles,
        claims = user.Claims.Select(c => new { c.Type, c.Value }).ToList(),
        timestamp = DateTime.UtcNow
    });
})
.RequireAuthorization()
.WithName("ProtectedTest")
.WithTags("Test Endpoints");

app.MapControllers();

app.Run();
