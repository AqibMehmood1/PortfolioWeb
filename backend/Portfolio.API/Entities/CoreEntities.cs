using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Entities;

public class WebsiteSetting : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Key { get; set; } = string.Empty;

    [Required]
    public string Value { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Group { get; set; } = "General";

    [MaxLength(200)]
    public string? Description { get; set; }
}

public class HomePageContent : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string SectionKey { get; set; } = "hero";

    [MaxLength(300)]
    public string Headline { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Subtitle { get; set; } = string.Empty;

    public string TypedStringsJson { get; set; } = "[]";

    public string StatsJson { get; set; } = "[]";

    public string? AdditionalDataJson { get; set; }
}

public class AboutContent : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string SectionKey { get; set; } = "about-main";

    [MaxLength(300)]
    public string Headline { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Subtitle { get; set; } = string.Empty;

    [MaxLength(300)]
    public string VisionHeadline { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string VisionLead { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string VisionDescription { get; set; } = string.Empty;

    public string FocusAreasJson { get; set; } = "[]";

    public string ExecutionStepsJson { get; set; } = "[]";

    public string ValueCardsJson { get; set; } = "[]";

    public string ThreeStepProcessJson { get; set; } = "[]";
}

public class Service : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Icon { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string ShortDescription { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string FullDescription { get; set; } = string.Empty;

    public string DeliverablesJson { get; set; } = "[]";

    [MaxLength(200)]
    public string EngagementTopic { get; set; } = string.Empty;

    public bool IsPublished { get; set; } = true;
}

public class AccordionServiceItem : BaseEntity
{
    [Required]
    [MaxLength(20)]
    public string IndexTag { get; set; } = "//01";

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string ShortDesc { get; set; } = string.Empty;

    public string BulletsJson { get; set; } = "[]";

    [MaxLength(500)]
    public string Image { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Route { get; set; } = "/services";

    public bool IsPublished { get; set; } = true;
}

public class Project : BaseEntity
{
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

    public string TechnologiesJson { get; set; } = "[]";

    public string HighlightsJson { get; set; } = "[]";

    [MaxLength(500)]
    public string LiveUrl { get; set; } = string.Empty;

    public bool IsFeatured { get; set; } = true;
    public bool IsPublished { get; set; } = true;
}

public class TechnologyCategory : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Key { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Label { get; set; } = string.Empty;

    public virtual ICollection<Technology> Technologies { get; set; } = new List<Technology>();
}

public class Technology : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string CategoryKey { get; set; } = string.Empty;

    public int? CategoryId { get; set; }
    public virtual TechnologyCategory? Category { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Icon { get; set; } = "fas fa-code";

    [MaxLength(50)]
    public string Color { get; set; } = "#2563eb";
}

public class Experience : BaseEntity
{
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

    public string TagsJson { get; set; } = "[]";
}

public class Education : BaseEntity
{
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

public class Certification : BaseEntity
{
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

public class Industry : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Icon { get; set; } = "fas fa-network-wired";

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Project { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Metric { get; set; } = string.Empty;
}

public class Testimonial : BaseEntity
{
    [Required]
    [MaxLength(2000)]
    public string Quote { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Author { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Role { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Tag { get; set; } = string.Empty;

    public int Rating { get; set; } = 5;

    public bool IsPublished { get; set; } = true;
}

public class ContactInquiry : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Company { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [MaxLength(100)]
    public string TechStack { get; set; } = string.Empty;

    [Required]
    [MaxLength(4000)]
    public string Message { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Status { get; set; } = "New"; // New, Read, Contacted, Qualified, Closed, Archived

    public string? AdminNotes { get; set; }
}

public class AdminUser : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Role { get; set; } = "Admin"; // SuperAdmin, Admin

    public DateTime? LastLoginAt { get; set; }

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}

public class RefreshToken : BaseEntity
{
    public int UserId { get; set; }
    public virtual AdminUser? User { get; set; }

    [Required]
    [MaxLength(500)]
    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsRevoked => RevokedAt != null;
    public bool IsActiveToken => !IsRevoked && !IsExpired;
}

public class AuditLog : BaseEntity
{
    public int? UserId { get; set; }

    [MaxLength(100)]
    public string Username { get; set; } = "System";

    [Required]
    [MaxLength(100)]
    public string Action { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string EntityName { get; set; } = string.Empty;

    public string? EntityId { get; set; }

    public string? Details { get; set; }

    [MaxLength(50)]
    public string? IpAddress { get; set; }
}

public class MediaFile : BaseEntity
{
    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    [MaxLength(255)]
    public string OriginalFileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string FilePath { get; set; } = string.Empty;

    [MaxLength(100)]
    public string ContentType { get; set; } = string.Empty;

    public long FileSizeBytes { get; set; }

    [MaxLength(255)]
    public string? AltText { get; set; }

    [MaxLength(100)]
    public string? UploadedBy { get; set; }
}

public class SeoMetadata : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string PageRoute { get; set; } = string.Empty; // "/", "/about", "/services", "/projects", "/expertise", "/contact"

    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Keywords { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? CanonicalUrl { get; set; }

    [MaxLength(200)]
    public string? OgTitle { get; set; }

    [MaxLength(500)]
    public string? OgDescription { get; set; }

    [MaxLength(500)]
    public string? OgImage { get; set; }

    [MaxLength(100)]
    public string Robots { get; set; } = "index, follow";
}
