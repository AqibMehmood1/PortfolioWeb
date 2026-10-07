using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models;

public class ServiceEntity
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Icon { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string ShortDescription { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string FullDescription { get; set; } = string.Empty;

    public string Deliverables { get; set; } = string.Empty;

    [MaxLength(200)]
    public string EngagementTopic { get; set; } = string.Empty;
}

public class Experience
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Period { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Company { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Location { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    public string Tags { get; set; } = string.Empty;
}

public class Education
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Degree { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Period { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Institution { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
}

public class Certification
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Level { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Issuer { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
}
