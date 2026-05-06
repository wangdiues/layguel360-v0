-- ───────────────────────────────────────────────────────────────────────────
-- 0002_storage.sql — task-attachments Storage bucket + RLS policies
-- ───────────────────────────────────────────────────────────────────────────

-- Create a private bucket capped at 10 MB per file, limited to common
-- document / spreadsheet / presentation / text MIME types.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'task-attachments',
  'task-attachments',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Any authenticated user may upload.
CREATE POLICY "auth_upload_task_attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'task-attachments'
    AND auth.uid() IS NOT NULL
  );

-- Any authenticated user may read (download).
CREATE POLICY "auth_read_task_attachments"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'task-attachments'
    AND auth.uid() IS NOT NULL
  );

-- Any authenticated user may delete their own uploads.
CREATE POLICY "auth_delete_own_task_attachments"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'task-attachments'
    AND auth.uid() IS NOT NULL
  );
