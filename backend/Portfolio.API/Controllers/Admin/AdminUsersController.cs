using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Common;
using Portfolio.API.Data;
using Portfolio.API.DTOs;
using Portfolio.API.Entities;
using Portfolio.API.Services;

namespace Portfolio.API.Controllers.Admin;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "SuperAdmin")]
public class AdminUsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLog;

    public AdminUsersController(ApplicationDbContext context, IAuditLogService auditLog)
    {
        _context = context;
        _auditLog = auditLog;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<UserProfileDto>>>> GetUsers()
    {
        var users = await _context.AdminUsers
            .OrderBy(u => u.Username)
            .Select(u => new UserProfileDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                FullName = u.FullName,
                Role = u.Role,
                LastLoginAt = u.LastLoginAt
            })
            .ToListAsync();

        return Ok(ApiResponse<List<UserProfileDto>>.Ok(users));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserProfileDto>>> CreateUser([FromBody] CreateAdminUserDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse.Fail("Invalid data."));

        if (await _context.AdminUsers.AnyAsync(u => u.Username.ToLower() == dto.Username.ToLower()))
        {
            return BadRequest(ApiResponse.Fail($"Username '{dto.Username}' already exists."));
        }

        if (await _context.AdminUsers.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
        {
            return BadRequest(ApiResponse.Fail($"Email '{dto.Email}' is already registered."));
        }

        var user = new AdminUser
        {
            Username = dto.Username.Trim(),
            Email = dto.Email.Trim(),
            FullName = dto.FullName?.Trim() ?? string.Empty,
            Role = dto.Role,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _context.AdminUsers.AddAsync(user);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("CreateUser", "AdminUser", user.Id.ToString(), $"Created admin user '{user.Username}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        var resultDto = new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role,
            LastLoginAt = user.LastLoginAt
        };

        return Ok(ApiResponse<UserProfileDto>.Ok(resultDto, "Admin user created successfully."));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<UserProfileDto>>> UpdateUser(int id, [FromBody] UpdateAdminUserDto dto)
    {
        var user = await _context.AdminUsers.FindAsync(id);
        if (user == null) return NotFound(ApiResponse.Fail("User not found."));

        if (await _context.AdminUsers.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower() && u.Id != id))
        {
            return BadRequest(ApiResponse.Fail($"Email '{dto.Email}' is already used by another user."));
        }

        user.Email = dto.Email.Trim();
        user.FullName = dto.FullName?.Trim() ?? string.Empty;
        user.Role = dto.Role;
        user.IsActive = dto.IsActive;
        if (!string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        }
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditLog.LogAsync("UpdateUser", "AdminUser", id.ToString(), $"Updated user '{user.Username}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        var resultDto = new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role,
            LastLoginAt = user.LastLoginAt
        };

        return Ok(ApiResponse<UserProfileDto>.Ok(resultDto, "User updated successfully."));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteUser(int id)
    {
        var user = await _context.AdminUsers.FindAsync(id);
        if (user == null) return NotFound(ApiResponse.Fail("User not found."));

        if (user.Username.ToLower() == "admin")
        {
            return BadRequest(ApiResponse.Fail("The primary system administrator account cannot be deleted."));
        }

        _context.AdminUsers.Remove(user);
        await _context.SaveChangesAsync();

        await _auditLog.LogAsync("DeleteUser", "AdminUser", id.ToString(), $"Deleted user '{user.Username}'", null, User.Identity?.Name, HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(ApiResponse<object>.Ok(null, "User deleted successfully."));
    }
}
