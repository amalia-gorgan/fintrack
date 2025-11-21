CREATE TABLE dbo.users (
                           id INT IDENTITY PRIMARY KEY,
                           username NVARCHAR(100) NOT NULL,
                           email NVARCHAR(255) NOT NULL UNIQUE,
                           created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

