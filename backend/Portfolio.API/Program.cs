using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Portfolio.API.Data;
using Portfolio.API.Data.Seed;
using Portfolio.API.Middleware;
using Portfolio.API.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Connection String & EF Core Database Context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? builder.Configuration["ConnectionString"];

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. JWT Authentication Configuration
var jwtKey = builder.Configuration["Jwt:Key"] ?? "NEXVOYS_SuperSecret_Jwt_Security_Key_2026_Enterprise_Architecture_CMS!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "PortfolioAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "PortfolioApp";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 3. Application Services DI
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<IChatbotService, ChatbotService>();

// 4. Controllers & JSON Options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();

// 5. Swagger with JWT Support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "NEXVOYS Portfolio & CMS API",
        Version = "v1",
        Description = "Enterprise CMS API for Portfolio Management, Public Data, and Admin Operations"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// 6. CORS Policy for Angular Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowPortfolioApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200", 
                "https://localhost:4200", 
                "http://127.0.0.1:4200",
                "http://localhost:5175",
                "https://localhost:7163"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// 7. Database Migration & Idempotent Seeding on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        if (context.Database.IsRelational())
        {
            await context.Database.MigrateAsync();
        }
        await DatabaseSeeder.SeedAllAsync(context, logger);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to apply migrations or seed database.");
    }
}

// 8. Middleware Pipeline
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Portfolio & CMS API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseStaticFiles();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowPortfolioApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
