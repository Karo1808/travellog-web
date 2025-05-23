using Microsoft.EntityFrameworkCore;
using TravelLog.Api.Data;

namespace server.Services.Interfaces;

public class LocationService : ILocationService
{
    private readonly ApplicationDbContext _db;

    public LocationService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<LocationDto> CreateAsync(CreateLocationRequest dto, string userId)
    {
        var entity = dto.ToEntity(userId);
        await _db.Locations.AddAsync(entity);
        await _db.SaveChangesAsync();
        return entity.ToDto();
    }


    public async Task<IEnumerable<LocationDto>> ListAsync(string userId)
    {
        var list = await _db.Locations
                         .Where(l => l.UserId == userId)
                         .ToListAsync();
        return list.Select(l => l.ToDto());
    }

    public async Task<(byte[] Data, string MimeType)?> GetImageAsync(int id, string userId)
    {
        var img = await _db.Locations
                        .AsNoTracking()
                        .Where(l => l.Id == id && l.UserId == userId)
                        .Select(l => new { l.Image, l.ImageMime })
                        .SingleOrDefaultAsync();

        return img is null || img.Image.Length == 0
            ? null
            : (img.Image, img.ImageMime ?? "application/ocet-stream");
    }
}