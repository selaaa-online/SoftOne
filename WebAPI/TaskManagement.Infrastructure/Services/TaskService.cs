using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskItemDto>> GetAllTasksAsync(int userId, string? sortBy = null, bool? isCompleted = null, int? priority = null)
    {
        var query = _context.Tasks.Where(t => t.UserId == userId);

        // Apply filters
        if (isCompleted.HasValue)
            query = query.Where(t => t.IsCompleted == isCompleted.Value);

        if (priority.HasValue)
            query = query.Where(t => t.Priority == priority.Value);

        // Apply sorting
        query = sortBy?.ToLower() switch
        {
            "title" => query.OrderBy(t => t.Title),
            "priority" => query.OrderByDescending(t => t.Priority).ThenBy(t => t.CreatedDate),
            "duedate" => query.OrderBy(t => t.DueDate ?? DateTime.MaxValue),
            _ => query.OrderByDescending(t => t.CreatedDate)
        };

        var tasks = await query.ToListAsync();

        return tasks.Select(t => new TaskItemDto
        {
            TaskId = t.TaskId,
            Title = t.Title,
            Description = t.Description,
            IsCompleted = t.IsCompleted,
            Priority = t.Priority,
            DueDate = t.DueDate,
            CreatedDate = t.CreatedDate,
            UpdatedDate = t.UpdatedDate,
            UserId = t.UserId
        });
    }

    public async Task<TaskItemDto?> GetTaskByIdAsync(int taskId, int userId)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.TaskId == taskId && t.UserId == userId);

        if (task == null)
            return null;

        return new TaskItemDto
        {
            TaskId = task.TaskId,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            Priority = task.Priority,
            DueDate = task.DueDate,
            CreatedDate = task.CreatedDate,
            UpdatedDate = task.UpdatedDate,
            UserId = task.UserId
        };
    }

    public async Task<TaskItemDto> CreateTaskAsync(CreateTaskDto createTaskDto, int userId)
    {
        var task = new TaskItem
        {
            Title = createTaskDto.Title,
            Description = createTaskDto.Description,
            Priority = createTaskDto.Priority,
            DueDate = createTaskDto.DueDate,
            UserId = userId,
            CreatedDate = DateTime.Now,
            IsCompleted = false
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return new TaskItemDto
        {
            TaskId = task.TaskId,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            Priority = task.Priority,
            DueDate = task.DueDate,
            CreatedDate = task.CreatedDate,
            UpdatedDate = task.UpdatedDate,
            UserId = task.UserId
        };
    }

    public async Task<TaskItemDto?> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto, int userId)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.TaskId == taskId && t.UserId == userId);

        if (task == null)
            return null;

        task.Title = updateTaskDto.Title;
        task.Description = updateTaskDto.Description;
        task.Priority = updateTaskDto.Priority;
        task.DueDate = updateTaskDto.DueDate;
        task.UpdatedDate = DateTime.Now;

        await _context.SaveChangesAsync();

        return new TaskItemDto
        {
            TaskId = task.TaskId,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            Priority = task.Priority,
            DueDate = task.DueDate,
            CreatedDate = task.CreatedDate,
            UpdatedDate = task.UpdatedDate,
            UserId = task.UserId
        };
    }

    public async Task<bool> DeleteTaskAsync(int taskId, int userId)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.TaskId == taskId && t.UserId == userId);

        if (task == null)
            return false;

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ToggleTaskCompletionAsync(int taskId, int userId)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.TaskId == taskId && t.UserId == userId);

        if (task == null)
            return false;

        task.IsCompleted = !task.IsCompleted;
        task.UpdatedDate = DateTime.Now;

        await _context.SaveChangesAsync();

        return true;
    }
}
