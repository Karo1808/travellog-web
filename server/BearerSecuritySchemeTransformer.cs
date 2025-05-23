using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;

internal sealed class BearerSecuritySchemeTransformer(
        IAuthenticationSchemeProvider schemes)
    : IOpenApiDocumentTransformer
{
    public async Task TransformAsync(OpenApiDocument doc,
                                     OpenApiDocumentTransformerContext _,
                                     CancellationToken ct)
    {
        if ((await schemes.GetAllSchemesAsync()).Any(s => s.Name == "Bearer"))
        {
            doc.Components ??= new();
            doc.Components.SecuritySchemes ??= new Dictionary<string, OpenApiSecurityScheme>();

            doc.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header
            };


            foreach (var op in doc.Paths.Values.SelectMany(p => p.Operations))
            {
                op.Value.Security.Add(new OpenApiSecurityRequirement
                {
                    [new OpenApiSecurityScheme
                    {
                        Reference = new()
                        {
                            Id = "Bearer",
                            Type = ReferenceType.SecurityScheme
                        }
                    }] =
                    Array.Empty<string>()
                });
            }
        }
    }
}
