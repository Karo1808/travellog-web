using TravelLog.Api.Entities;

public static class LocationMappings
{
    public static LocationDto ToDto(this Location entity)
        => new LocationDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Journal = entity.Journal,
            Date = entity.Date,
            ImageUrl = $"/locations/{entity.Id}/image",
            Latitude = entity.Latitude,
            Longitude = entity.Longitude
        };

    public static Location ToEntity(this CreateLocationRequest dto, string userId)
    {
        var entity = new Location
        {
            UserId = userId,
            Name = dto.Name,
            Journal = dto.Journal,
            Date = dto.Date,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude
        };

        if (dto.Image is { Length: > 0 })
        {
            using var ms = new MemoryStream();
            dto.Image.CopyTo(ms);
            entity.Image = ms.ToArray();
            entity.ImageMime = dto.Image.ContentType;
        }

        return entity;
    }

    public static void UpdateFromDto(this Location entity, CreateLocationRequest dto)
    {
        entity.Name = dto.Name;
        entity.Journal = dto.Journal;
        entity.Date = dto.Date;
        entity.Latitude = dto.Latitude;
        entity.Longitude = dto.Longitude;

        if (dto.Image is { Length: > 0 })
        {
            using var ms = new MemoryStream();
            dto.Image.CopyTo(ms);
            entity.Image = ms.ToArray();
            entity.ImageMime = dto.Image.ContentType;
        }
    }
}
