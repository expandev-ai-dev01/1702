/**
 * @schema subscription
 * Handles account management, multi-tenancy, and subscription plans.
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'subscription')
BEGIN
    EXEC('CREATE SCHEMA subscription');
END
GO
