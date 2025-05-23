using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.OpenApi; // Corrected using directive
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace server.Services.OpenApi
{
    public class OpenApiSecurityTransformer : IOpenApiDocumentTransformer
    {
        public Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
        {
            // 2a) Define a security scheme named "bearerAuth"
            document.Components.SecuritySchemes ??= new Dictionary<string, OpenApiSecurityScheme>();
            document.Components.SecuritySchemes["bearerAuth"] = new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Enter your JWT token as: Bearer {token}"
            };

            // 2b) Apply that scheme globally to all operations
            document.SecurityRequirements = new List<OpenApiSecurityRequirement>
            {
                new OpenApiSecurityRequirement
                {
                    [ new OpenApiSecurityScheme
                      {
                        Reference = new OpenApiReference
                        {
                          Type = ReferenceType.SecurityScheme,
                          Id   = "bearerAuth"
                        }
                      }
                    ] = System.Array.Empty<string>()
                }
            };

            return Task.CompletedTask;
        }
    }
}
