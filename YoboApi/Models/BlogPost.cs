using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YoboApi.Models;

public class BlogPost
{
    public int Id { get; set; }

    [Required, MaxLength(180)]
    public string Title { get; set; } = default!;

    [Required, MaxLength(200)]
    public string Slug { get; set; } = default!;

    [Required]
    public string Content { get; set; } = default!;

    [Required]
    public string AuthorId { get; set; } = default!;

    [ForeignKey(nameof(AuthorId))]
    public AppUser? Author { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdateAt { get; set; }
    public bool IsPublished { get; set; } = true;
}