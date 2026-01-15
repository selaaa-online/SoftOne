namespace TaskManagement.Application.DTOs;

public class UserDto
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}
