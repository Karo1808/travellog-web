using System.ComponentModel;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Services.Interfaces;

namespace TravelLog.Api.Controller;

[Authorize]
[ApiController]
[Route("api/locations")]
public class LocationsController : ControllerBase
{
    private readonly ILocationService _locationSvc;

    public LocationsController(ILocationService locationSvc)
    {
        _locationSvc = locationSvc;
    }

    [HttpPost]
    public async Task<ActionResult<LocationDto>> Create([FromForm] CreateLocationRequest dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var created = await _locationSvc.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LocationDto>>> List()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var locations = await _locationSvc.ListAsync(userId);
        return Ok(locations);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<LocationDto>> GetById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var loc = await _locationSvc.GetAsync(id, userId);
        if (loc is null)
            return NotFound();
        return Ok(loc);
    }

    [HttpGet("{id:int}/image")]
    public async Task<IActionResult> GetImage(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var img = await _locationSvc.GetImageAsync(id, userId);
        if (img == null) return NotFound();

        return File(img.Value.Data,
                    img.Value.MimeType,
                    enableRangeProcessing: true);
    }

}