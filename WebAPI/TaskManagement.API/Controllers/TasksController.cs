using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Interfaces;

namespace TaskManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    private int? GetCurrentUserId()
    {
        return HttpContext.Session.GetInt32("UserId");
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTasks([FromQuery] string? sortBy, [FromQuery] bool? isCompleted, [FromQuery] int? priority)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized(new { message = "Not authenticated" });

        var tasks = await _taskService.GetAllTasksAsync(userId.Value, sortBy, isCompleted, priority);
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTaskById(int id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized(new { message = "Not authenticated" });

        var task = await _taskService.GetTaskByIdAsync(id, userId.Value);

        if (task == null)
            return NotFound(new { message = "Task not found" });

        return Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto createTaskDto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized(new { message = "Not authenticated" });

        if (string.IsNullOrWhiteSpace(createTaskDto.Title))
            return BadRequest(new { message = "Task title is required" });

        if (createTaskDto.Priority < 1 || createTaskDto.Priority > 3)
            return BadRequest(new { message = "Priority must be between 1 and 3" });

        var task = await _taskService.CreateTaskAsync(createTaskDto, userId.Value);
        return CreatedAtAction(nameof(GetTaskById), new { id = task.TaskId }, task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskDto updateTaskDto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized(new { message = "Not authenticated" });

        if (string.IsNullOrWhiteSpace(updateTaskDto.Title))
            return BadRequest(new { message = "Task title is required" });

        if (updateTaskDto.Priority < 1 || updateTaskDto.Priority > 3)
            return BadRequest(new { message = "Priority must be between 1 and 3" });

        var task = await _taskService.UpdateTaskAsync(id, updateTaskDto, userId.Value);

        if (task == null)
            return NotFound(new { message = "Task not found" });

        return Ok(task);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized(new { message = "Not authenticated" });

        var success = await _taskService.DeleteTaskAsync(id, userId.Value);

        if (!success)
            return NotFound(new { message = "Task not found" });

        return Ok(new { message = "Task deleted successfully" });
    }

    [HttpPatch("{id}/complete")]
    public async Task<IActionResult> ToggleTaskCompletion(int id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized(new { message = "Not authenticated" });

        var success = await _taskService.ToggleTaskCompletionAsync(id, userId.Value);

        if (!success)
            return NotFound(new { message = "Task not found" });

        return Ok(new { message = "Task status toggled successfully" });
    }
}
