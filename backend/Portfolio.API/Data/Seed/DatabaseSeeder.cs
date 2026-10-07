namespace Portfolio.API.Data.Seed;

public static class DatabaseSeeder
{
    public static async Task SeedAllAsync(ApplicationDbContext context, ILogger logger)
    {
        try
        {
            logger.LogInformation("Starting idempotent database seeding...");

            await AdminUserSeeder.SeedAsync(context, logger);
            await WebsiteSettingsSeeder.SeedAsync(context, logger);
            await HomePageSeeder.SeedAsync(context, logger);
            await AboutPageSeeder.SeedAsync(context, logger);
            await ServicesSeeder.SeedAsync(context, logger);
            await ProjectsSeeder.SeedAsync(context, logger);
            await TechnologiesSeeder.SeedAsync(context, logger);
            await ExperienceSeeder.SeedAsync(context, logger);
            await EducationCertificationSeeder.SeedAsync(context, logger);
            await IndustriesTestimonialsSeeder.SeedAsync(context, logger);
            await SeoSeeder.SeedAsync(context, logger);
            await MediaSeeder.SeedAsync(context, logger);

            logger.LogInformation("Database seeding completed successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during database seeding.");
            throw;
        }
    }
}
