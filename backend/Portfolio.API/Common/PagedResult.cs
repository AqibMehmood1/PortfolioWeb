namespace Portfolio.API.Common;

public class PaginationQuery
{
    private int _page = 1;
    private int _pageSize = 10;
    private const int MaxPageSize = 100;

    public int Page
    {
        get => _page;
        set => _page = value < 1 ? 1 : value;
    }

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : (value < 1 ? 10 : value);
    }

    public string? Search { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = false;
    public string? Filter { get; set; }
}

public class PagedResult<T>
{
    public IEnumerable<T> Items { get; set; } = new List<T>();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling((double)TotalItems / PageSize) : 0;
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;

    public static PagedResult<T> Create(IEnumerable<T> items, int page, int pageSize, int totalItems) =>
        new()
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems
        };
}
