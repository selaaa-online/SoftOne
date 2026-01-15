using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Interfaces;

public interface IAuthService
{
    Task<UserDto?> LoginAsync(LoginRequestDto loginDto);
    Task<UserDto?> GetCurrentUserAsync(int userId);
    Task<bool> RegisterUserAsync(string username, string password);
}
