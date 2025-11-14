/**
 * @summary
 * Records a login attempt and updates the user's lockout status based on success or failure.
 * This procedure is central to the brute-force protection mechanism.
 * 
 * @procedure spUserLoginAttempt
 * @schema security
 * @type stored-procedure
 * 
 * @endpoints
 * - POST /api/v1/external/auth/login
 * 
 * @parameters
 * @param {NVARCHAR(255)} emailAttempt
 *   - Required: Yes
 *   - Description: The email address used in the login attempt.
 * @param {VARCHAR(45)} ipAddress
 *   - Required: Yes
 *   - Description: The IP address from which the attempt originated.
 * @param {NVARCHAR(500)} userAgent
 *   - Required: Yes
 *   - Description: The user agent string of the client.
 * @param {BIT} success
 *   - Required: Yes
 *   - Description: A flag indicating if the login attempt was successful (1) or not (0).
 * 
 * @testScenarios
 * - Successful login resets failure count.
 * - Failed login increments failure count.
 * - Fifth failed login locks the account for 15 minutes.
 * - Attempt with a non-existent email is logged correctly.
 */
CREATE OR ALTER PROCEDURE [security].[spUserLoginAttempt]
  @emailAttempt NVARCHAR(255),
  @ipAddress VARCHAR(45),
  @userAgent NVARCHAR(500),
  @success BIT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @idUser INT;
  DECLARE @failedAttempts INT;
  DECLARE @maxFailedAttempts INT = 5;

  -- Find the user to update their status
  SELECT
    @idUser = [usr].[idUser],
    @failedAttempts = [usr].[failedLoginAttempts]
  FROM [security].[user] [usr]
  WHERE [usr].[email] = @emailAttempt
    AND [usr].[deleted] = 0;

  -- Log the attempt regardless of user existence
  INSERT INTO [security].[loginAttempt] 
  ([idUser], [emailAttempt], [ipAddress], [userAgent], [success])
  VALUES
  (@idUser, @emailAttempt, @ipAddress, @userAgent, @success);

  -- If user exists, update their status
  IF @idUser IS NOT NULL
  BEGIN
    IF @success = 1
    BEGIN
      -- On success, reset failed attempts and lockout
      UPDATE [security].[user]
      SET 
        [failedLoginAttempts] = 0,
        [lockoutUntil] = NULL,
        [dateModified] = GETUTCDATE()
      WHERE [idUser] = @idUser;
    END
    ELSE
    BEGIN
      -- On failure, increment failed attempts
      SET @failedAttempts = @failedAttempts + 1;

      IF @failedAttempts >= @maxFailedAttempts
      BEGIN
        -- Lock account if max attempts reached
        UPDATE [security].[user]
        SET
          [failedLoginAttempts] = @failedAttempts,
          [lockoutUntil] = DATEADD(MINUTE, 15, GETUTCDATE()),
          [dateModified] = GETUTCDATE()
        WHERE [idUser] = @idUser;
      END
      ELSE
      BEGIN
        -- Just update the attempt count
        UPDATE [security].[user]
        SET
          [failedLoginAttempts] = @failedAttempts,
          [dateModified] = GETUTCDATE()
        WHERE [idUser] = @idUser;
      END
    END
  END

END;
GO
