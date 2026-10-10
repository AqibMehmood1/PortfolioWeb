namespace Portfolio.API.Services;

public interface IFileStorageService
{
    Task<(bool Success, string FilePath, string FileName, string Error)> SaveFileAsync(IFormFile file, string? subDirectory = null);
    bool DeleteFile(string relativeFilePath);
}

public class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly string[] _allowedExtensions =
    [
        ".png", ".jpg", ".jpeg", ".jfif", ".pjpeg", ".pjp",
        ".webp", ".gif", ".svg", ".ico", ".avif", ".bmp",
        ".tiff", ".tif", ".pdf"
    ];
    private const long MaxFileSize = 50 * 1024 * 1024; // 50MB

    public LocalFileStorageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<(bool Success, string FilePath, string FileName, string Error)> SaveFileAsync(IFormFile file, string? subDirectory = null)
    {
        if (file == null || file.Length == 0)
        {
            return (false, string.Empty, string.Empty, "No file provided.");
        }

        if (file.Length > MaxFileSize)
        {
            return (false, string.Empty, string.Empty, "File size exceeds 50MB limit.");
        }

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(ext))
        {
            return (false, string.Empty, string.Empty, $"File extension '{ext}' is not permitted.");
        }

        var uploadsRoot = Path.Combine(_environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot"), "uploads");
        if (!string.IsNullOrEmpty(subDirectory))
        {
            uploadsRoot = Path.Combine(uploadsRoot, subDirectory);
        }

        Directory.CreateDirectory(uploadsRoot);

        var safeFileName = $"{Guid.NewGuid():N}{ext}";
        var physicalPath = Path.Combine(uploadsRoot, safeFileName);

        using (var stream = new FileStream(physicalPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var relativePath = string.IsNullOrEmpty(subDirectory)
            ? $"uploads/{safeFileName}"
            : $"uploads/{subDirectory}/{safeFileName}";

        return (true, relativePath, file.FileName, string.Empty);
    }

    public bool DeleteFile(string relativeFilePath)
    {
        try
        {
            var wwwroot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
            var physicalPath = Path.Combine(wwwroot, relativeFilePath.TrimStart('/', '\\'));
            if (File.Exists(physicalPath))
            {
                File.Delete(physicalPath);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }
}
