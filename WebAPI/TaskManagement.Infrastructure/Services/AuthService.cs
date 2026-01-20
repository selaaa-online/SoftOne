using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;

    public AuthService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto?> LoginAsync(LoginRequestDto loginDto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

        if (user == null)
            return null;

        // Verify password
        //if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        //    return null;

        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            CreatedDate = user.CreatedDate
        };
    }

    public async Task<UserDto?> GetCurrentUserAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        
        if (user == null)
            return null;

        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            CreatedDate = user.CreatedDate
        };
    }

    public async Task<bool> RegisterUserAsync(string username, string password)
    {
        if (await _context.Users.AnyAsync(u => u.Username == username))
            return false;

        var user = new User
        {
            Username = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            CreatedDate = DateTime.Now
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return true;
    }
}
