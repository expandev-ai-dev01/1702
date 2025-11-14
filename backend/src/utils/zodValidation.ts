import { z } from 'zod';

// Reusable Zod schemas for common data types.

/**
 * Foreign Key (ID) validation.
 * Must be a positive integer.
 */
export const zId = z.coerce.number().int().positive({ message: 'ID must be a positive integer.' });

/**
 * Optional Foreign Key (ID) validation.
 */
export const zNullableId = zId.nullable();

/**
 * Standard name validation.
 * Must be a string between 1 and 100 characters.
 */
export const zName = z
  .string()
  .min(1, 'Name is required.')
  .max(100, 'Name must be 100 characters or less.');

/**
 * Standard description validation.
 * Must be a string up to 500 characters. Can be null.
 */
export const zNullableDescription = z
  .string()
  .max(500, 'Description must be 500 characters or less.')
  .nullable();

/**
 * Email validation.
 */
export const zEmail = z.string().email({ message: 'Invalid email address.' });

/**
 * Boolean (BIT) validation.
 * Coerces input to a boolean.
 */
export const zBit = z.coerce.boolean();
