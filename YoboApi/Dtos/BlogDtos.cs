using System.ComponentModel.DataAnnotations;

namespace YoboApi.Dtos;

public class BlogCreateRequest
{
    [Required, MaxLength(180)]
    public string Title { get; set; } = default!;
    [Required]
    public string Content { get; set; } = default!;
    public bool IsPublished { get; set; } = true;
}

public class BlogUpdateRequest
{
    [Required, MaxLength(180)]
    public string Title { get; set; } = default!;
    [Required]
    public string Content { get; set; } = default!;
    public bool IsPublished { get; set; } = true;
}

public class BlogResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Slug { get; set; } = default!;
    public string Content { get; set; } = default!;
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string AuthorId { get; set; } = default!;
    public string? AuthorEmail { get; set; }
    public string? AuthorFullName { get; set; }
}