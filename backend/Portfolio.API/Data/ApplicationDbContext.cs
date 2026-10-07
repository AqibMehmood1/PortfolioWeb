using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<WebsiteSetting> WebsiteSettings => Set<WebsiteSetting>();
    public DbSet<HomePageContent> HomePageContents => Set<HomePageContent>();
    public DbSet<AboutContent> AboutContents => Set<AboutContent>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<AccordionServiceItem> AccordionServices => Set<AccordionServiceItem>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<TechnologyCategory> TechnologyCategories => Set<TechnologyCategory>();
    public DbSet<Technology> Technologies => Set<Technology>();
    public DbSet<Experience> Experiences => Set<Experience>();
    public DbSet<Education> Educations => Set<Education>();
    public DbSet<Certification> Certifications => Set<Certification>();
    public DbSet<Industry> Industries => Set<Industry>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<ContactInquiry> ContactInquiries => Set<ContactInquiry>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<MediaFile> MediaFiles => Set<MediaFile>();
    public DbSet<SeoMetadata> SeoMetadata => Set<SeoMetadata>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Unique Constraints & Indexes
        modelBuilder.Entity<WebsiteSetting>()
            .HasIndex(s => s.Key)
            .IsUnique();

        modelBuilder.Entity<HomePageContent>()
            .HasIndex(h => h.SectionKey)
            .IsUnique();

        modelBuilder.Entity<AboutContent>()
            .HasIndex(a => a.SectionKey)
            .IsUnique();

        modelBuilder.Entity<Service>()
            .HasIndex(s => s.Slug)
            .IsUnique();

        modelBuilder.Entity<Project>()
            .HasIndex(p => p.Slug)
            .IsUnique();

        modelBuilder.Entity<TechnologyCategory>()
            .HasIndex(c => c.Key)
            .IsUnique();

        modelBuilder.Entity<AdminUser>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<AdminUser>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<SeoMetadata>()
            .HasIndex(s => s.PageRoute)
            .IsUnique();

        // Relationships
        modelBuilder.Entity<Technology>()
            .HasOne(t => t.Category)
            .WithMany(c => c.Technologies)
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<RefreshToken>()
            .HasOne(r => r.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
