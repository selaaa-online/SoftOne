namespace TaskManagement.Domain.Entities;

public class User
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }

    // Navigation property
    public virtual ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
