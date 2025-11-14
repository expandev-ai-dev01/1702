/**
 * @schema functional
 * Contains core business logic, entities, and operational tables.
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'functional')
BEGIN
    EXEC('CREATE SCHEMA functional');
END
GO
