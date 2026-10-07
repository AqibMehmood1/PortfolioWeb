using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Models;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public ProjectsController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects([FromQuery] string? category)
    {
        var query = _dbContext.Projects.AsQueryable();

        if (!string.IsNullOrEmpty(category) && category != "all")
        {
            query = query.Where(p => p.FilterCategory == category);
        }

        var projects = await query.ToListAsync();
        return Ok(projects);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProjectById(int id)
    {
        var project = await _dbContext.Projects.FindAsync(id);
        if (project == null) return NotFound();
        return Ok(project);
    }
}
