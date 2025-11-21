-- Remove old incorrectly structured table
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL
BEGIN
DROP TABLE dbo.users;
END;
GO

-- Correct table definition for your User entity
CREATE TABLE dbo.users (
                           userId BIGINT IDENTITY(1,1) PRIMARY KEY,
                           email NVARCHAR(255) NOT NULL UNIQUE,
                           passwordHash NVARCHAR(255) NOT NULL,
                           firstName NVARCHAR(100) NOT NULL,
                           lastName NVARCHAR(100) NOT NULL,
                           createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO
