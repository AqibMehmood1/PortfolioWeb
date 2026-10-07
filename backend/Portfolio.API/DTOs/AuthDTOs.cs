using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.DTOs;

public class LoginRequestDto
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserProfileDto User { get; set; } = new();
}

public class UserProfileDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime? LastLoginAt { get; set; }
}

public class RefreshTokenRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}

public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}

public class CreateAdminUserDto
{
    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Role { get; set; } = "Admin";
}

public class UpdateAdminUserDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Role { get; set; } = "Admin";

    public bool IsActive { get; set; } = true;

    public string? NewPassword { get; set; }
}
