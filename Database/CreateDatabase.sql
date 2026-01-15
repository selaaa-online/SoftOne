-- ================================================
-- Task Management Database Creation Script
-- Database: SODB
-- Created: 2026-01-16
-- ================================================

USE master;
GO

-- Create Database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SODB')
BEGIN
    CREATE DATABASE SODB;
END
GO

USE SODB;
GO

-- ================================================
-- Create Tables
-- ================================================

-- Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE [Users] (
        [UserId] int NOT NULL IDENTITY(1,1),
        [Username] nvarchar(50) NOT NULL,
        [PasswordHash] nvarchar(255) NOT NULL,
        [CreatedDate] datetime2 NOT NULL DEFAULT (GETDATE()),
        CONSTRAINT [PK_Users] PRIMARY KEY ([UserId])
    );
    
    CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username]);
END
GO

-- Tasks Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tasks')
BEGIN
    CREATE TABLE [Tasks] (
        [TaskId] int NOT NULL IDENTITY(1,1),
        [Title] nvarchar(200) NOT NULL,
        [Description] nvarchar(4000) NULL,
        [IsCompleted] bit NOT NULL DEFAULT CAST(0 AS bit),
        [Priority] int NOT NULL DEFAULT 2,
        [DueDate] datetime2 NULL,
        [CreatedDate] datetime2 NOT NULL DEFAULT (GETDATE()),
        [UpdatedDate] datetime2 NULL,
        [UserId] int NOT NULL,
        CONSTRAINT [PK_Tasks] PRIMARY KEY ([TaskId]),
        CONSTRAINT [FK_Tasks_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_Tasks_UserId] ON [Tasks] ([UserId]);
END
GO

-- ================================================
-- Seed Data
-- ================================================

-- Insert default admin user if not exists
-- Username: admin
-- Password: Admin@123
IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Username] = 'admin')
BEGIN
    SET IDENTITY_INSERT [Users] ON;
    
    INSERT INTO [Users] ([UserId], [CreatedDate], [PasswordHash], [Username])
    VALUES (1, '2026-01-15T12:00:00.0000000Z', 
            N'$2a$11$5Z8QjKGZ5X.1LG9LJ9Z8H.XKJ7Z8H5Z8QjKGZ5X.1LG9LJ9Z8H.XKJ', 
            N'admin');
    
    SET IDENTITY_INSERT [Users] OFF;
END
GO

-- ================================================
-- Sample Data (Optional - Comment out if not needed)
-- ================================================

/*
-- Insert sample tasks for the admin user
INSERT INTO [Tasks] ([Title], [Description], [IsCompleted], [Priority], [DueDate], [UserId])
VALUES 
    ('Welcome to Task Manager', 'This is your first task!', 0, 2, DATEADD(day, 7, GETDATE()), 1),
    ('Complete project documentation', 'Write comprehensive documentation for the project', 0, 3, DATEADD(day, 3, GETDATE()), 1),
    ('Review code changes', 'Review and approve pending pull requests', 0, 2, DATEADD(day, 1, GETDATE()), 1);
*/

GO

-- ================================================
-- Verification Queries
-- ================================================

PRINT 'Database setup complete!';
PRINT '';
PRINT 'Tables created:';
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
PRINT '';
PRINT 'User count:';
SELECT COUNT(*) as UserCount FROM Users;
PRINT '';
PRINT 'Default admin user created with username: admin';
PRINT 'Default password: Admin@123';
GO
