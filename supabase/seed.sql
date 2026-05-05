-- ───────────────────────────────────────────────────────────────────────────
-- seed.sql — local-development seed data
--
-- Runs only via `supabase db reset` (NOT via migrations). Idempotent via
-- ON CONFLICT DO NOTHING. UUIDs match the original lib/supabase/schema.sql
-- seed for continuity with any pre-existing local data.
--
-- created_by / author_id / uploader_id are intentionally left NULL because
-- this seed predates real auth users; tighter ownership lands when Phase-4
-- introduces seeded auth users.
-- ───────────────────────────────────────────────────────────────────────────

-- Projects --------------------------------------------------------------
INSERT INTO public.projects (id, title, description, status, priority, start_date, end_date, department, manager) VALUES
('11111111-1111-1111-1111-111111111111', 'Digital Forestry Service Improvement', 'Improving digital workflows and field reporting for forest management across districts.', 'Active',    'High',     '2026-01-10', '2026-12-31', 'Department of Forests and Park Services', 'Karma Wangchuk'),
('22222222-2222-2222-2222-222222222222', 'Cordyceps Collection Monitoring',     'Tracking seasonal cordyceps harvesting across highland regions.',                     'Active',    'Medium',   '2026-03-01', '2026-09-30', 'Department of Agriculture',               'Pema Lhamo'),
('33333333-3333-3333-3333-333333333333', 'Forest Carbon Mapping',               'GIS-based carbon stock assessment for national forests.',                             'Planning',  'High',     '2026-06-01', '2027-05-31', 'Department of Forests and Park Services', 'Tshering Dorji'),
('44444444-4444-4444-4444-444444444444', 'Human–Elephant Conflict Mapping',     'Mapping conflict zones between human settlements and elephants in Samdrup Jongkhar.', 'Planning',  'Critical', '2026-04-01', '2026-10-31', 'Nature Conservation Division',            'Sonam Tobgay'),
('55555555-5555-5555-5555-555555555555', 'Watershed Restoration Initiative',    'Restoration of degraded watersheds across five districts.',                           'Completed', 'Medium',   '2025-01-01', '2025-12-31', 'Department of Forests and Park Services', 'Wangdi')
ON CONFLICT (id) DO NOTHING;

-- Tasks -----------------------------------------------------------------
INSERT INTO public.tasks (id, project_id, title, description, status, priority, due_date, assignee, created_at) VALUES
('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Conduct stakeholder workshop',     'Organize and facilitate a stakeholder consultation workshop in Thimphu.',         'Completed',   'High',     '2026-02-28', 'Karma Wangchuk', '2026-01-15T08:00:00Z'),
('aaaa2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Develop digital field survey form','Create mobile-compatible forms for field data collection and reporting.',         'In Progress', 'High',     '2026-05-15', 'Pema Lhamo',     '2026-02-01T09:00:00Z'),
('aaaa3333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Map cordyceps harvesting zones',   'Delineate and digitize cordyceps collection zones on GIS.',                       'In Progress', 'Medium',   '2026-06-30', 'Wangdi',         '2026-03-10T10:00:00Z'),
('aaaa4444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Procure remote sensing data',      'Acquire satellite imagery for carbon stock mapping and analysis.',                'Pending',     'High',     '2026-07-01', 'Tshering Dorji', '2026-04-01T11:00:00Z'),
('aaaa5555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'Field site reconnaissance',        'Initial ground-truthing visit to known human–elephant conflict zones.',           'Pending',     'Critical', '2026-05-20', 'Sonam Tobgay',   '2026-04-05T08:00:00Z'),
('aaaa6666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Develop training materials',       'Prepare training guides, presentations, and handouts for field staff.',           'Pending',     'Medium',   '2026-06-15', 'Karma Wangchuk', '2026-02-20T09:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Comments --------------------------------------------------------------
INSERT INTO public.comments (id, task_id, text, author, created_at) VALUES
('cccc1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'Workshop completed successfully. All 24 stakeholders attended and provided useful feedback.', 'Karma Wangchuk', '2026-02-28T14:30:00Z'),
('cccc2222-2222-2222-2222-222222222222', 'aaaa1111-1111-1111-1111-111111111111', 'Minutes have been shared with the project team. Feedback has been incorporated into the action plan.', 'Pema Lhamo', '2026-03-01T09:15:00Z'),
('cccc3333-3333-3333-3333-333333333333', 'aaaa2222-2222-2222-2222-222222222222', 'Initial prototype of the form is ready. Awaiting review from the field team.', 'Pema Lhamo', '2026-04-10T11:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Attachments -----------------------------------------------------------
INSERT INTO public.attachments (id, task_id, filename, file_type, file_size, created_at) VALUES
('att11111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'Stakeholder Workshop Report.pdf', 'PDF document', '2.4 MB', '2026-02-28T15:00:00Z'),
('att22222-2222-2222-2222-222222222222', 'aaaa2222-2222-2222-2222-222222222222', 'Field Survey Form Draft.xlsx',    'Spreadsheet',  '540 KB', '2026-04-10T10:00:00Z')
ON CONFLICT (id) DO NOTHING;
