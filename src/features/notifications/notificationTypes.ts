import { z } from 'zod';

export const createNotificationSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title cannot exceed 50 characters'),
  body: z.string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(250, 'Message cannot exceed 250 characters'),
});

export type CreateNotificationFormData = z.infer<typeof createNotificationSchema>;
