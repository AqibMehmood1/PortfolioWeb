using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data.Seed;

public static class MediaSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        var mediaFiles = new List<MediaFile>
        {
            new() { FileName = "black-logo.png", OriginalFileName = "black-logo.png", FilePath = "assets/nexvoys/black-logo.png", ContentType = "image/png", AltText = "NEXVOYS Dark Logo", UploadedBy = "System" },
            new() { FileName = "white-logo.png", OriginalFileName = "white-logo.png", FilePath = "assets/nexvoys/white-logo.png", ContentType = "image/png", AltText = "NEXVOYS White Logo", UploadedBy = "System" },
            new() { FileName = "nex-fav.png", OriginalFileName = "nex-fav.png", FilePath = "assets/nexvoys/nex-fav.png", ContentType = "image/png", AltText = "NEXVOYS Favicon", UploadedBy = "System" },
            new() { FileName = "Bilal_CV.pdf", OriginalFileName = "Bilal_CV.pdf", FilePath = "assets/Bilal_CV.pdf", ContentType = "application/pdf", AltText = "NEXVOYS Capabilities Document", UploadedBy = "System" },
            new() { FileName = "scrole.png", OriginalFileName = "scrole.png", FilePath = "assets/img/scrole.png", ContentType = "image/png", AltText = "Scrole Web Platform Preview", UploadedBy = "System" },
            new() { FileName = "Scrole.gif", OriginalFileName = "Scrole.gif", FilePath = "assets/img/Scrole.gif", ContentType = "image/gif", AltText = "Scrole Web Platform Animation", UploadedBy = "System" },
            new() { FileName = "ODTool.png", OriginalFileName = "ODTool.png", FilePath = "assets/img/ODTool.png", ContentType = "image/png", AltText = "ODTool Quotation Engine Preview", UploadedBy = "System" },
            new() { FileName = "OdooTools.gif", OriginalFileName = "OdooTools.gif", FilePath = "assets/img/OdooTools.gif", ContentType = "image/gif", AltText = "ODTool Calculation Animation", UploadedBy = "System" },
            new() { FileName = "Eurobank.png", OriginalFileName = "Eurobank.png", FilePath = "assets/img/Eurobank.png", ContentType = "image/png", AltText = "Eurobank Banking Portal Preview", UploadedBy = "System" },
            new() { FileName = "EUROBank.gif", OriginalFileName = "EUROBank.gif", FilePath = "assets/img/EUROBank.gif", ContentType = "image/gif", AltText = "Eurobank Banking Animation", UploadedBy = "System" },
            new() { FileName = "Cloudoor.png", OriginalFileName = "Cloudoor.png", FilePath = "assets/img/Cloudoor.png", ContentType = "image/png", AltText = "Cloudoor Cloud SaaS Preview", UploadedBy = "System" },
            new() { FileName = "CloudoorG.gif", OriginalFileName = "CloudoorG.gif", FilePath = "assets/img/CloudoorG.gif", ContentType = "image/gif", AltText = "Cloudoor SaaS Animation", UploadedBy = "System" },
            new() { FileName = "Medikea.png", OriginalFileName = "Medikea.png", FilePath = "assets/img/Medikea.png", ContentType = "image/png", AltText = "Medikea Healthtech Preview", UploadedBy = "System" },
            new() { FileName = "Medikea.gif", OriginalFileName = "Medikea.gif", FilePath = "assets/img/Medikea.gif", ContentType = "image/gif", AltText = "Medikea Telemedicine Animation", UploadedBy = "System" },
            new() { FileName = "linkcenter2.png", OriginalFileName = "linkcenter2.png", FilePath = "assets/img/linkcenter2.png", ContentType = "image/png", AltText = "LinksCenter Portal Preview", UploadedBy = "System" },
            new() { FileName = "LinksWeb.gif", OriginalFileName = "LinksWeb.gif", FilePath = "assets/img/LinksWeb.gif", ContentType = "image/gif", AltText = "LinksCenter Animation", UploadedBy = "System" }
        };

        foreach (var m in mediaFiles)
        {
            if (!await context.MediaFiles.AnyAsync(x => x.FilePath == m.FilePath))
            {
                await context.MediaFiles.AddAsync(m);
            }
        }

        await context.SaveChangesAsync();
    }
}
