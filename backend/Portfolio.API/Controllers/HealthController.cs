using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<HealthController> _logger;

    public HealthController(ApplicationDbContext dbContext, ILogger<HealthController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetStatus()
    {
        return Ok(new
        {
            status = "Online",
            service = "Portfolio.API",
            timestamp = DateTime.UtcNow
        });
    }

    [HttpGet("db-check")]
    public async Task<IActionResult> CheckDatabaseConnection()
    {
        try
        {
            bool canConnect = await _dbContext.Database.CanConnectAsync();
            return Ok(new
            {
                databaseConnected = canConnect,
                databaseProvider = _dbContext.Database.ProviderName,
                databaseName = _dbContext.Database.GetDbConnection().Database,
                dataSource = _dbContext.Database.GetDbConnection().DataSource,
                message = canConnect ? "Successfully connected to SQL Server database." : "Unable to reach SQL Server database."
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking database connection");
            return StatusCode(500, new
            {
                databaseConnected = false,
                error = ex.Message
            });
        }
    }
}
