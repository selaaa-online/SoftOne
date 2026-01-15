namespace TaskManagement.Application.DTOs;

public class TaskItemDto
{
    public int TaskId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public int Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public int UserId { get; set; }
}
