using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace Portfolio.API.DTOs;

// --- Settings ---
public class WebsiteSettingsDto
{
    public Dictionary<string, string> Settings { get; set; } = new();
    public string CompanyName => Get("CompanyName", "NEXVOYS");
    public string Tagline => Get("Tagline", "Enterprise Technology Partner");
    public string Role => Get("Role", "Enterprise Technology Partner & Solutions Architecture");
    public string Email => Get("Email", "nexvoys@gmail.com");
    public string Phone => Get("Phone", "+923456466188");
    public string DisplayPhone => Get("DisplayPhone", "+92 345 6466188");
    public string Location => Get("Location", "Lahore, Pakistan · Global Remote");
    public string LinkedinUrl => Get("LinkedinUrl", "https://www.linkedin.com/company/nex-voys/posts/?feedView=all");
    public string CvPath => Get("CvPath", "assets/Bilal_CV.pdf");
    public string LogoDark => Get("LogoDark", "assets/nexvoys/black-logo.png");
    public string LogoLight => Get("LogoLight", "assets/nexvoys/white-logo.png");
    public string Favicon => Get("Favicon", "assets/nexvoys/nex-fav.png");
    public string FooterBio => Get("FooterBio", "");
    public string CopyrightText => Get("CopyrightText", "");
    public List<string> TickerTexts { get; set; } = new();

    private string Get(string key, string fallback) =>
        Settings.TryGetValue(key, out var val) ? val : fallback;
}

public class UpdateSettingItemDto
{
    [Required]
    public string Key { get; set; } = string.Empty;
    [Required]
    public string Value { get; set; } = string.Empty;
    public string? Group { get; set; }
    public string? Description { get; set; }
}

public class BulkUpdateSettingsDto
{
    public List<UpdateSettingItemDto> Settings { get; set; } = new();
}

// --- Home ---
public class HomePageDto
{
    public string Headline { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public List<string> TypedStrings { get; set; } = new();
    public List<StatItemDto> Stats { get; set; } = new();
    public object? AdditionalData { get; set; }
}

public class StatItemDto
{
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string? Icon { get; set; }
}

public class UpdateHomePageDto
{
    public string Headline { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public List<string> TypedStrings { get; set; } = new();
    public List<StatItemDto> Stats { get; set; } = new();
    public string? AdditionalDataJson { get; set; }
}

// --- About ---
public class AboutPageDto
{
    public string Headline { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string VisionHeadline { get; set; } = string.Empty;
    public string VisionLead { get; set; } = string.Empty;
    public string VisionDescription { get; set; } = string.Empty;
    public List<string> FocusAreas { get; set; } = new();
    public List<StepItemDto> ExecutionSteps { get; set; } = new();
    public List<ValueCardDto> ValueCards { get; set; } = new();
    public List<StepItemDto> ThreeStepProcess { get; set; } = new();
}

public class StepItemDto
{
    public string Step { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class ValueCardDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpdateAboutPageDto
{
    public string Headline { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string VisionHeadline { get; set; } = string.Empty;
    public string VisionLead { get; set; } = string.Empty;
    public string VisionDescription { get; set; } = string.Empty;
    public List<string> FocusAreas { get; set; } = new();
    public List<StepItemDto> ExecutionSteps { get; set; } = new();
    public List<ValueCardDto> ValueCards { get; set; } = new();
    public List<StepItemDto> ThreeStepProcess { get; set; } = new();
}

// --- Services ---
public class ServiceDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public string Subtitle { get => ShortDescription; set => ShortDescription = value; }
    public string Description { get => FullDescription; set => FullDescription = value; }
    public List<string> Deliverables { get; set; } = new();
    public string EngagementTopic { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsPublished { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get => IsPublished; set => IsPublished = value; }
    public string FeaturesJson { get => "[]"; set {} }
    public string TechnologiesJson { get => "[]"; set {} }
    public string DeliverablesJson { get => JsonSerializer.Serialize(Deliverables); set {} }
}

public class CreateUpdateServiceDto
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

    public List<string> Deliverables { get; set; } = new();

    [MaxLength(200)]
    public string EngagementTopic { get; set; } = string.Empty;

    public int DisplayOrder { get; set; } = 0;
    public bool IsPublished { get; set; } = true;
    public bool IsActive { get; set; } = true;
}

public class AccordionServiceItemDto
{
    public int Id { get; set; }
    public string IndexTag { get; set; } = string.Empty;
    public string Num { get => IndexTag; set => IndexTag = value; }
    public string Title { get; set; } = string.Empty;
    public string ShortDesc { get; set; } = string.Empty;
    public string Description { get => ShortDesc; set => ShortDesc = value; }
    public string Category { get => "ARCHITECTURE"; set {} }
    public List<string> Bullets { get; set; } = new();
    public string DetailsJson { get => JsonSerializer.Serialize(Bullets); set {} }
    public string TagsJson { get => "[]"; set {} }
    public string Image { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsPublished { get; set; }
    public bool IsActive { get => IsPublished; set => IsPublished = value; }
}

public class CreateUpdateAccordionServiceItemDto
{
    [Required]
    [MaxLength(20)]
    public string IndexTag { get; set; } = "//01";

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string ShortDesc { get; set; } = string.Empty;

    public List<string> Bullets { get; set; } = new();

    [MaxLength(500)]
    public string Image { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Route { get; set; } = "/services";

    public int DisplayOrder { get; set; } = 0;
    public bool IsPublished { get; set; } = true;
}

// --- Projects ---
public class ProjectDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Subtitle { get => Category; set => Category = value; }
    public string FilterCategory { get; set; } = "all";
    public string Image { get; set; } = string.Empty;
    public string ThumbnailUrl { get => Image; set => Image = value; }
    public string Gif { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Problem { get; set; } = string.Empty;
    public string Architecture { get; set; } = string.Empty;
    public string LongDescription { get => Architecture; set => Architecture = value; }
    public string Client { get => "Enterprise Client"; set {} }
    public string Duration { get => "Delivered"; set {} }
    public string Role { get => "Solutions Architect"; set {} }
    public List<string> Tech { get; set; } = new();
    public List<string> Highlights { get; set; } = new();
    public string LiveUrl { get; set; } = string.Empty;
    public string GithubUrl { get => LiveUrl; set {} }
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
    public bool Featured { get => IsFeatured; set => IsFeatured = value; }
    public bool IsPublished { get; set; }
    public bool IsActive { get; set; }
    public string TechnologiesJson { get => JsonSerializer.Serialize(Tech); set {} }
    public string ChallengesJson { get => JsonSerializer.Serialize(new[] { Problem }); set {} }
    public string SolutionsJson { get => JsonSerializer.Serialize(new[] { Architecture }); set {} }
    public string ImpactMetricsJson { get => JsonSerializer.Serialize(Highlights); set {} }
}

public class CreateUpdateProjectDto
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

    public List<string> Technologies { get; set; } = new();
    public List<string> Highlights { get; set; } = new();

    [MaxLength(500)]
    public string LiveUrl { get; set; } = string.Empty;

    public int DisplayOrder { get; set; } = 0;
    public bool IsFeatured { get; set; } = true;
    public bool IsPublished { get; set; } = true;
    public bool IsActive { get; set; } = true;
}

// --- Tech Matrix ---
public class TechnologyCategoryDto
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Name { get => !string.IsNullOrEmpty(Label) ? Label : Key; set => Label = value; }
    public string Slug { get => !string.IsNullOrEmpty(Key) ? Key : Label.ToLower().Replace(" ", "-"); set => Key = value; }
    public string Subtitle { get; set; } = string.Empty;
    public string Icon { get; set; } = "fas fa-layer-group";
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public List<TechnologyDto> Technologies { get; set; } = new();
}

public class CreateUpdateTechnologyCategoryDto
{
    [MaxLength(50)]
    public string? Key { get; set; }

    [MaxLength(100)]
    public string? Label { get; set; }

    public string? Name { get; set; }
    public string? Slug { get; set; }
    public string? Subtitle { get; set; }
    public string? Icon { get; set; }

    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}

public class TechnologyDto
{
    public int Id { get; set; }
    public string CategoryKey { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Slug { get => Name.ToLower().Replace(" ", "-"); set {} }
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Level { get; set; } = "Proficient";
    public int ProficiencyPercentage { get; set; } = 90;
    public string Description { get; set; } = string.Empty;
    public int? CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateUpdateTechnologyDto
{
    [MaxLength(50)]
    public string? CategoryKey { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public string? Slug { get; set; }

    [MaxLength(100)]
    public string Icon { get; set; } = "fas fa-code";

    [MaxLength(50)]
    public string Color { get; set; } = "#2563eb";

    public string? Level { get; set; }
    public int? ProficiencyPercentage { get; set; }
    public string? Description { get; set; }
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }

    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}

// --- Experience, Education, Certification ---
public class ExperienceDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Role { get => Title; set => Title = value; }
    public string Period { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Type { get; set; } = "Full-time";
    public string Description { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public string ResponsibilitiesJson { get => "[]"; set {} }
    public string TechnologiesJson { get => JsonSerializer.Serialize(Tags); set {} }
    public bool IsCurrent { get; set; } = true;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateUpdateExperienceDto
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

    public List<string> Tags { get; set; } = new();
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}

public class EducationDto
{
    public int Id { get; set; }
    public string Degree { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public string FieldOfStudy { get => "Software Engineering"; set {} }
    public string GradeOrHonor { get => "First Class"; set {} }
    public string Description { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateUpdateEducationDto
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

    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}

public class CertificationDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string IssuingOrganization { get => Issuer; set => Issuer = value; }
    public string IssueDate { get => "2024"; set {} }
    public string CredentialUrl { get => string.Empty; set {} }
    public string BadgeIcon { get => "fas fa-certificate"; set {} }
    public string Description { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateUpdateCertificationDto
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

    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}

// --- Industry & Testimonials ---
public class IndustryDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Name { get => Title; set => Title = value; }
    public string Icon { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Project { get; set; } = string.Empty;
    public string Metric { get; set; } = string.Empty;
    public string SystemsCount { get => Metric; set => Metric = value; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateUpdateIndustryDto
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

    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}

public class TestimonialDto
{
    public int Id { get; set; }
    public string Quote { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Company { get => Role; set => Role = value; }
    public string Tag { get; set; } = string.Empty;
    public string ProjectDelivered { get => Tag; set => Tag = value; }
    public int Rating { get; set; } = 5;
    public string AvatarUrl { get => "/assets/testimonials/avatar1.jpg"; set {} }
    public int DisplayOrder { get; set; }
    public bool IsPublished { get; set; }
    public bool IsActive { get => IsPublished; set => IsPublished = value; }
    public bool IsFeatured { get => IsPublished; set => IsPublished = value; }
}

public class CreateUpdateTestimonialDto
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
    public int DisplayOrder { get; set; } = 0;
    public bool IsPublished { get; set; } = true;
}

// --- Inquiries ---
public class SubmitContactInquiryDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Phone { get; set; }

    [MaxLength(150)]
    public string? Company { get; set; }

    [MaxLength(200)]
    public string? Subject { get; set; }

    [MaxLength(100)]
    public string? TechStack { get; set; }

    [Required]
    [MaxLength(4000)]
    public string Message { get; set; } = string.Empty;
}

public class ContactInquiryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string TechStack { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? AdminNotes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UpdateInquiryStatusDto
{
    [Required]
    public string Status { get; set; } = "Read"; // New, Read, Contacted, Qualified, Closed, Archived
    public string? AdminNotes { get; set; }
}

// --- Media ---
public class MediaFileDto
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string? AltText { get; set; }
    public DateTime CreatedAt { get; set; }
}

// --- SEO ---
public class SeoMetadataDto
{
    public int Id { get; set; }
    public string PageRoute { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string MetaTitle { get => Title; set => Title = value; }
    public string Description { get; set; } = string.Empty;
    public string MetaDescription { get => Description; set => Description = value; }
    public string Keywords { get; set; } = string.Empty;
    public string MetaKeywords { get => Keywords; set => Keywords = value; }
    public string? CanonicalUrl { get; set; }
    public string? OgTitle { get; set; }
    public string? OgDescription { get; set; }
    public string? OgImage { get; set; }
    public string? OgImageUrl { get => OgImage; set => OgImage = value; }
    public string Robots { get; set; } = "index, follow";
}

public class CreateUpdateSeoMetadataDto
{
    [Required]
    [MaxLength(100)]
    public string PageRoute { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    public string MetaTitle { get => Title; set => Title = value; }

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    public string MetaDescription { get => Description; set => Description = value; }

    [MaxLength(500)]
    public string Keywords { get; set; } = string.Empty;
    public string MetaKeywords { get => Keywords; set => Keywords = value; }

    [MaxLength(500)]
    public string? CanonicalUrl { get; set; }

    [MaxLength(200)]
    public string? OgTitle { get; set; }

    [MaxLength(500)]
    public string? OgDescription { get; set; }

    [MaxLength(500)]
    public string? OgImage { get; set; }
    public string? OgImageUrl { get => OgImage; set => OgImage = value; }

    [MaxLength(100)]
    public string Robots { get; set; } = "index, follow";
}

// --- Dashboard ---
public class DashboardStatsDto
{
    public int TotalProjects { get; set; }
    public int PublishedProjects { get; set; }
    public int TotalServices { get; set; }
    public int TotalTechnologies { get; set; }
    public int TotalTestimonials { get; set; }
    public int TotalInquiries { get; set; }
    public int NewInquiries { get; set; }
    public int TotalMediaFiles { get; set; }
    public List<ContactInquiryDto> RecentInquiries { get; set; } = new();
    public List<ProjectDto> RecentProjects { get; set; } = new();
    public List<AuditLogDto> RecentActivities { get; set; } = new();
}

public class AuditLogDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string? EntityId { get; set; }
    public string? Details { get; set; }
    public string? IpAddress { get; set; }
    public DateTime CreatedAt { get; set; }
}

// --- Chatbot DTOs ---
public class ChatRequestDto
{
    [Required]
    public string Message { get; set; } = string.Empty;
    public string? SessionId { get; set; }
    public List<ChatMessageHistoryDto>? History { get; set; }
}

public class ChatMessageHistoryDto
{
    public string Role { get; set; } = "user"; // "user" or "assistant"
    public string Content { get; set; } = string.Empty;
}

public class ChatActionLinkDto
{
    public string Label { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Type { get; set; } = "internal"; // internal, external, action
    public string? Icon { get; set; }
}

public class ChatResponseDto
{
    public string Reply { get; set; } = string.Empty;
    public List<string> SuggestedActions { get; set; } = new();
    public List<ChatActionLinkDto> Links { get; set; } = new();
    public bool IsLeadCapturePrompt { get; set; }
}

public class SubmitChatInquiryDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Phone { get; set; }

    [MaxLength(150)]
    public string? Company { get; set; }

    [MaxLength(200)]
    public string? Topic { get; set; }

    [Required]
    [MaxLength(4000)]
    public string Message { get; set; } = string.Empty;
}

// --- Dynamic Site Pages & Sections DTOs ---
public class SitePageDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string NavTitle { get; set; } = string.Empty;
    public bool IsVisible { get; set; } = true;
    public bool ShowInNav { get; set; } = true;
    public bool ShowInFooter { get; set; } = true;
    public bool IsSystem { get; set; }
    public int DisplayOrder { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public int SectionCount { get; set; }
    public List<SiteSectionDto> Sections { get; set; } = new();
}

public class SiteSectionDto
{
    public int Id { get; set; }
    public int PageId { get; set; }
    public string PageSlug { get; set; } = string.Empty;
    public string SectionKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string SectionType { get; set; } = "built-in";
    public bool IsVisible { get; set; } = true;
    public bool IsSystem { get; set; }
    public int DisplayOrder { get; set; }
    public string? ContentJson { get; set; }
    public string? CustomHtml { get; set; }
}

public class CreateSitePageDto
{
    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? NavTitle { get; set; }

    public bool IsVisible { get; set; } = true;
    public bool ShowInNav { get; set; } = true;
    public bool ShowInFooter { get; set; } = true;
    public int DisplayOrder { get; set; }

    [MaxLength(300)]
    public string? MetaTitle { get; set; }

    [MaxLength(1000)]
    public string? MetaDescription { get; set; }
}

public class UpdateSitePageDto
{
    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? NavTitle { get; set; }

    public bool IsVisible { get; set; } = true;
    public bool ShowInNav { get; set; } = true;
    public bool ShowInFooter { get; set; } = true;
    public int DisplayOrder { get; set; }

    [MaxLength(300)]
    public string? MetaTitle { get; set; }

    [MaxLength(1000)]
    public string? MetaDescription { get; set; }
}

public class CreateSiteSectionDto
{
    [Required]
    public int PageId { get; set; }

    [Required]
    [MaxLength(100)]
    public string SectionKey { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Subtitle { get; set; }

    [MaxLength(4000)]
    public string? Description { get; set; }

    [MaxLength(50)]
    public string SectionType { get; set; } = "built-in";

    public bool IsVisible { get; set; } = true;
    public int DisplayOrder { get; set; }
    public string? ContentJson { get; set; }
    public string? CustomHtml { get; set; }
}

public class UpdateSiteSectionDto
{
    [Required]
    [MaxLength(100)]
    public string SectionKey { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Subtitle { get; set; }

    [MaxLength(4000)]
    public string? Description { get; set; }

    [MaxLength(50)]
    public string SectionType { get; set; } = "built-in";

    public bool IsVisible { get; set; } = true;
    public int DisplayOrder { get; set; }
    public string? ContentJson { get; set; }
    public string? CustomHtml { get; set; }
}

public class ReorderItemDto
{
    public int Id { get; set; }
    public int DisplayOrder { get; set; }
}
