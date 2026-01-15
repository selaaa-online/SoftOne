namespace TaskManagement.Application.DTOs;

public class CreateTaskDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Priority { get; set; } = 2;
    public DateTime? DueDate { get; set; }
}
