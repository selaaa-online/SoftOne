using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Interfaces;

namespace TaskManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
    {
        if (string.IsNullOrWhiteSpace(loginDto.Username) || string.IsNullOrWhiteSpace(loginDto.Password))
            return BadRequest(new { message = "Username and password are required" });

        var user = await _authService.LoginAsync(loginDto);

        if (user == null)
            return Unauthorized(new { message = "Invalid username or password" });

        // Store user ID in session
        HttpContext.Session.SetInt32("UserId", user.UserId);
        HttpContext.Session.SetString("Username", user.Username);

        return Ok(new { message = "Login successful", user });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok(new { message = "Logout successful" });
    }

    [HttpGet("current-user")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = HttpContext.Session.GetInt32("UserId");

        if (userId == null)
            return Unauthorized(new { message = "Not authenticated" });

        var user = await _authService.GetCurrentUserAsync(userId.Value);

        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(user);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] LoginRequestDto registerDto)
    {
        if (string.IsNullOrWhiteSpace(registerDto.Username) || string.IsNullOrWhiteSpace(registerDto.Password))
            return BadRequest(new { message = "Username and password are required" });

        if (registerDto.Password.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters long" });

        var success = await _authService.RegisterUserAsync(registerDto.Username, registerDto.Password);

        if (!success)
            return BadRequest(new { message = "Username already exists" });

        return Ok(new { message = "Registration successful" });
    }
}
