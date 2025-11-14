/**
 * @summary
 * Retrieves a user's details by their email address, including information
 * needed for authentication checks like password hash and lockout status.
 * 
 * @procedure spUserGetByEmail
 * @schema security
 * @type stored-procedure
 * 
 * @parameters
 * @param {NVARCHAR(255)} email 
 *   - Required: Yes
 *   - Description: The email address of the user to retrieve.
 * 
 * @output {UserDetails, 1, n}
 * @column {INT} idUser - The unique identifier for the user.
 * @column {NVARCHAR(100)} name - The user's full name.
 * @column {NVARCHAR(255)} email - The user's email address.
 * @column {NVARCHAR(255)} passwordHash - The hashed password.
 * @column {INTEGER} failedLoginAttempts - Count of consecutive failed login attempts.
 * @column {DATETIME2} lockoutUntil - The timestamp until which the account is locked.
 */
CREATE OR ALTER PROCEDURE [security].[spUserGetByEmail]
  @email NVARCHAR(255)
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    [usr].[idUser],
    [usr].[name],
    [usr].[email],
    [usr].[passwordHash],
    [usr].[failedLoginAttempts],
    [usr].[lockoutUntil]
  FROM [security].[user] [usr]
  WHERE [usr].[email] = @email
    AND [usr].[deleted] = 0;

END;
GO
