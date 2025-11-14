/**
 * @schema config
 * Contains system-wide settings, enumerations, and non-business related configurations.
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'config')
BEGIN
    EXEC('CREATE SCHEMA config');
END
GO
