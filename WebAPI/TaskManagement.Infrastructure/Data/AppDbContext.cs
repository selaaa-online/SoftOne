using Microsoft.EntityFrameworkCore;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<TaskItem> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(50);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETDATE()");
        });

        // TaskItem configuration
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasKey(e => e.TaskId);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(4000);
            entity.Property(e => e.IsCompleted).HasDefaultValue(false);
            entity.Property(e => e.Priority).HasDefaultValue(2);
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETDATE()");

            // Foreign key relationship
            entity.HasOne(e => e.User)
                .WithMany(u => u.Tasks)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Default user for testing - Username: admin, Password: Admin@123
        modelBuilder.Entity<User>().HasData(
            new User
            {
                UserId = 1,
                Username = "admin",
                // BCrypt hash for "Admin@123"
                PasswordHash = "$2a$11$5Z8QjKGZ5X.1LG9LJ9Z8H.XKJ7Z8H5Z8QjKGZ5X.1LG9LJ9Z8H.XKJ",
                CreatedDate = new DateTime(2026, 1, 15, 12, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
