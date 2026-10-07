using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models;

public class Project
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(50)]
    public string FilterCategory { get; set; } = "all";

    [MaxLength(500)]
    public string Image { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Gif { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Problem { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Architecture { get; set; } = string.Empty;

    [MaxLength(500)]
    public string LiveUrl { get; set; } = string.Empty;

    public string Technologies { get; set; } = string.Empty; // JSON or comma-separated

    public string Highlights { get; set; } = string.Empty; // JSON or comma-separated

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
