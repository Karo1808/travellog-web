// Controllers/GeoCodingController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelLog.Api.DTOs.Geocoding;
using TravelLog.Api.Services.Interfaces;

namespace TravelLog.Api.Controllers;

[ApiController]
[Route("api/geocode")]
[Authorize]
public class GeoCodingController : ControllerBase
{
    private readonly IGeoCodingService _svc;
    public GeoCodingController(IGeoCodingService svc) => _svc = svc;

    [HttpPost("reverse")]
    public async Task<ActionResult<ReverseGeocodeResponse>> Reverse(
        [FromBody] ReverseGeocodeRequest dto)
    {
        var result = await _svc.ReverseGeocodeAsync(dto.Lat, dto.Lon);
        if (result == null) return NotFound();
        return Ok(result);
    }
}
