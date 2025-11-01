using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using YoboApi.Models;

namespace YoboApi.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<BlogPost>()
            .HasIndex(b => b.Slug)
            .IsUnique();

        builder.Entity<BlogPost>()
            .HasIndex(b => b.AuthorId);
    } 
}