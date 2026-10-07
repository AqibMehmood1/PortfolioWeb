using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;
using Portfolio.API.Services;

namespace Portfolio.API.Controllers.Admin;

[ApiController]
[Route("api/admin/auth")]
[Route("api/auth")]
public class AdminAuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IAuditLogService _auditLog;
    private readonly ILogger<AdminAuthController> _logger;

    public AdminAuthController(
        ApplicationDbContext context,
        ITokenService tokenService,
        IAuditLogService auditLog,
        ILogger<AdminAuthController> logger)
    {
        _context = context;
        _tokenService = tokenService;
        _auditLog = auditLog;
        _logger = logger;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login([FromBody] LoginRequestDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse.Fail("Invalid login request."));
        }

        var user = await _context.AdminUsers
            .FirstOrDefaultAsync(u => u.Username.ToLower() == dto.Username.ToLower() || u.Email.ToLower() == dto.Username.ToLower());

        if (user == null || !user.IsActive || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return Unauthorized(ApiResponse.Fail("Invalid username or password."));
        }

        var (token, expiresAt) = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken(user.Id);

        await _context.RefreshTokens.AddAsync(refreshToken);
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("Login", "AdminUser", user.Id.ToString(), $"User {user.Username} logged in successfully.", user.Id, user.Username, HttpContext.Connection.RemoteIpAddress?.ToString());

        var response = new LoginResponseDto
        {
            Token = token,
            RefreshToken = refreshToken.Token,
            ExpiresAt = expiresAt,
            User = new UserProfileDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                LastLoginAt = user.LastLoginAt
            }
        };

        return Ok(ApiResponse<LoginResponseDto>.Ok(response, "Login successful."));
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LoginResponseDto>>> RefreshToken([FromBody] RefreshTokenRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.RefreshToken))
        {
            return BadRequest(ApiResponse.Fail("Refresh token is required."));
        }

        var tokenRecord = await _context.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == dto.RefreshToken);

        if (tokenRecord == null || !tokenRecord.IsActiveToken || tokenRecord.User == null || !tokenRecord.User.IsActive)
        {
            return Unauthorized(ApiResponse.Fail("Invalid or expired refresh token."));
        }

        // Revoke old refresh token
        tokenRecord.RevokedAt = DateTime.UtcNow;

        // Generate new tokens
        var (accessToken, expiresAt) = _tokenService.GenerateAccessToken(tokenRecord.User);
        var newRefreshToken = _tokenService.GenerateRefreshToken(tokenRecord.UserId);

        await _context.RefreshTokens.AddAsync(newRefreshToken);
        await _context.SaveChangesAsync();

        var response = new LoginResponseDto
        {
            Token = accessToken,
            RefreshToken = newRefreshToken.Token,
            ExpiresAt = expiresAt,
            User = new UserProfileDto
            {
                Id = tokenRecord.User.Id,
                Username = tokenRecord.User.Username,
                Email = tokenRecord.User.Email,
                FullName = tokenRecord.User.FullName,
                Role = tokenRecord.User.Role,
                LastLoginAt = tokenRecord.User.LastLoginAt
            }
        };

        return Ok(ApiResponse<LoginResponseDto>.Ok(response));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> Logout([FromBody] RefreshTokenRequestDto? dto)
    {
        if (dto != null && !string.IsNullOrWhiteSpace(dto.RefreshToken))
        {
            var tokenRecord = await _context.RefreshTokens
                .FirstOrDefaultAsync(r => r.Token == dto.RefreshToken);

            if (tokenRecord != null)
            {
                tokenRecord.RevokedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        var userId = GetCurrentUserId();
        var username = User.Identity?.Name;
        await _auditLog.LogAsync("Logout", "AdminUser", userId?.ToString(), $"User {username} logged out.", userId, username, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Logged out successfully."));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserProfileDto>>> GetCurrentUser()
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized(ApiResponse.Fail("Unauthorized"));

        var user = await _context.AdminUsers.FindAsync(userId.Value);
        if (user == null || !user.IsActive) return Unauthorized(ApiResponse.Fail("User not found or inactive."));

        var dto = new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role,
            LastLoginAt = user.LastLoginAt
        };

        return Ok(ApiResponse<UserProfileDto>.Ok(dto));
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized(ApiResponse.Fail("Unauthorized"));

        var user = await _context.AdminUsers.FindAsync(userId.Value);
        if (user == null) return Unauthorized(ApiResponse.Fail("User not found"));

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
        {
            return BadRequest(ApiResponse.Fail("Current password is incorrect."));
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("ChangePassword", "AdminUser", user.Id.ToString(), "Password changed successfully.", user.Id, user.Username, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "Password updated successfully."));
    }

    private int? GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return int.TryParse(claim?.Value, out var id) ? id : null;
    }
}
