using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Portfolio.API.Entities;

namespace Portfolio.API.Services;

public interface ITokenService
{
    (string Token, DateTime ExpiresAt) GenerateAccessToken(AdminUser user);
    RefreshToken GenerateRefreshToken(int userId);
}

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string Token, DateTime ExpiresAt) GenerateAccessToken(AdminUser user)
    {
        var secretKey = _configuration["Jwt:Key"] ?? "NEXVOYS_SuperSecret_Jwt_Security_Key_2026_Enterprise!";
        var issuer = _configuration["Jwt:Issuer"] ?? "PortfolioAPI";
        var audience = _configuration["Jwt:Audience"] ?? "PortfolioApp";
        var expiryMinutes = int.TryParse(_configuration["Jwt:ExpiryMinutes"], out var m) ? m : 120;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role),
            new("FullName", user.FullName)
        };

        var expiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiresAt,
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return (tokenHandler.WriteToken(token), expiresAt);
    }

    public RefreshToken GenerateRefreshToken(int userId)
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);

        var expiryDays = int.TryParse(_configuration["Jwt:RefreshTokenExpiryDays"], out var d) ? d : 7;

        return new RefreshToken
        {
            UserId = userId,
            Token = Convert.ToBase64String(randomNumber),
            ExpiresAt = DateTime.UtcNow.AddDays(expiryDays),
            CreatedAt = DateTime.UtcNow
        };
    }
}
