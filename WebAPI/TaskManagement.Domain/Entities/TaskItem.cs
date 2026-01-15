namespace TaskManagement.Domain.Entities;

public class TaskItem
{
    public int TaskId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public int Priority { get; set; } // 1=Low, 2=Medium, 3=High
    public DateTime? DueDate { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public int UserId { get; set; }

    // Navigation property
    public virtual User User { get; set; } = null!;
}
