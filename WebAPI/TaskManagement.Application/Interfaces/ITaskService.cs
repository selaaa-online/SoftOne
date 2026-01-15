using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskItemDto>> GetAllTasksAsync(int userId, string? sortBy = null, bool? isCompleted = null, int? priority = null);
    Task<TaskItemDto?> GetTaskByIdAsync(int taskId, int userId);
    Task<TaskItemDto> CreateTaskAsync(CreateTaskDto createTaskDto, int userId);
    Task<TaskItemDto?> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto, int userId);
    Task<bool> DeleteTaskAsync(int taskId, int userId);
    Task<bool> ToggleTaskCompletionAsync(int taskId, int userId);
}
