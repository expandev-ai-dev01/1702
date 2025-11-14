/**
 * @schema security
 * Manages authentication, authorization, users, roles, and permissions.
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'security')
BEGIN
    EXEC('CREATE SCHEMA security');
END
GO

/*
DROP TABLE [security].[loginAttempt];
DROP TABLE [security].[userSession];
DROP TABLE [security].[user];
*/

/**
 * @table user Stores user account information, including credentials.
 * @multitenancy false
 * @softDelete true
 * @alias usr
 */
CREATE TABLE [security].[user] (
  [idUser] INTEGER IDENTITY(1, 1) NOT NULL,
  [name] NVARCHAR(100) NOT NULL,
  [email] NVARCHAR(255) NOT NULL,
  [passwordHash] NVARCHAR(255) NOT NULL,
  [failedLoginAttempts] INTEGER NOT NULL DEFAULT (0),
  [lockoutUntil] DATETIME2 NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table loginAttempt Logs every login attempt for security and auditing.
 * @multitenancy false
 * @softDelete false
 * @alias lga
 */
CREATE TABLE [security].[loginAttempt] (
  [idLoginAttempt] BIGINT IDENTITY(1, 1) NOT NULL,
  [idUser] INTEGER NULL,
  [emailAttempt] NVARCHAR(255) NOT NULL,
  [ipAddress] VARCHAR(45) NOT NULL,
  [userAgent] NVARCHAR(500) NOT NULL,
  [attemptTime] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [success] BIT NOT NULL
);
GO

/**
 * @table userSession Manages active user sessions and tokens.
 * @multitenancy false
 * @softDelete false
 * @alias uss
 */
CREATE TABLE [security].[userSession] (
  [idUserSession] INTEGER IDENTITY(1, 1) NOT NULL,
  [idUser] INTEGER NOT NULL,
  [token] NVARCHAR(500) NOT NULL,
  [ipAddress] VARCHAR(45) NOT NULL,
  [userAgent] NVARCHAR(500) NOT NULL,
  [expiresAt] DATETIME2 NOT NULL,
  [createdAt] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

-- Constraints for [security].[user]
/**
 * @primaryKey pkUser
 * @keyType Object
 */
ALTER TABLE [security].[user]
ADD CONSTRAINT [pkUser] PRIMARY KEY CLUSTERED ([idUser]);
GO

/**
 * @check dfUser_failedLoginAttempts Ensures failed login attempts defaults to 0.
 */
ALTER TABLE [security].[user]
ADD CONSTRAINT [dfUser_failedLoginAttempts] DEFAULT (0) FOR [failedLoginAttempts];
GO

/**
 * @check dfUser_dateCreated Sets default creation date.
 */
ALTER TABLE [security].[user]
ADD CONSTRAINT [dfUser_dateCreated] DEFAULT (GETUTCDATE()) FOR [dateCreated];
GO

/**
 * @check dfUser_dateModified Sets default modification date.
 */
ALTER TABLE [security].[user]
ADD CONSTRAINT [dfUser_dateModified] DEFAULT (GETUTCDATE()) FOR [dateModified];
GO

/**
 * @check dfUser_deleted Sets default soft delete flag.
 */
ALTER TABLE [security].[user]
ADD CONSTRAINT [dfUser_deleted] DEFAULT (0) FOR [deleted];
GO

-- Constraints for [security].[loginAttempt]
/**
 * @primaryKey pkLoginAttempt
 * @keyType Object
 */
ALTER TABLE [security].[loginAttempt]
ADD CONSTRAINT [pkLoginAttempt] PRIMARY KEY CLUSTERED ([idLoginAttempt]);
GO

/**
 * @foreignKey fkLoginAttempt_User Links attempt to a user if they exist.
 * @target security.user
 */
ALTER TABLE [security].[loginAttempt]
ADD CONSTRAINT [fkLoginAttempt_User] FOREIGN KEY ([idUser])
REFERENCES [security].[user]([idUser]);
GO

-- Constraints for [security].[userSession]
/**
 * @primaryKey pkUserSession
 * @keyType Object
 */
ALTER TABLE [security].[userSession]
ADD CONSTRAINT [pkUserSession] PRIMARY KEY CLUSTERED ([idUserSession]);
GO

/**
 * @foreignKey fkUserSession_User Links session to a user.
 * @target security.user
 */
ALTER TABLE [security].[userSession]
ADD CONSTRAINT [fkUserSession_User] FOREIGN KEY ([idUser])
REFERENCES [security].[user]([idUser]);
GO

-- Indexes
/**
 * @index uqUser_Email Enforces unique email addresses for active users.
 * @type Search
 * @unique true
 * @filter To allow multiple nulls or soft-deleted users with the same email.
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqUser_Email]
ON [security].[user]([email])
WHERE [deleted] = 0;
GO

/**
 * @index ixLoginAttempt_EmailAttempt Optimizes lookups for login attempts by email.
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixLoginAttempt_EmailAttempt]
ON [security].[loginAttempt]([emailAttempt]);
GO

/**
 * @index ixUserSession_User Optimizes session lookups by user.
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixUserSession_User]
ON [security].[userSession]([idUser]);
GO
