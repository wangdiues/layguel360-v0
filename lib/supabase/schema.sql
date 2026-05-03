-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Planning',
  priority TEXT NOT NULL DEFAULT 'Medium',
  start_date DATE,
  end_date DATE,
  department TEXT,
  manager TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  priority TEXT NOT NULL DEFAULT 'Medium',
  due_date DATE,
  assignee TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_type TEXT,
  file_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (users) table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for demo)
CREATE POLICY "Allow public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public read attachments" ON attachments FOR SELECT USING (true);
CREATE POLICY "Allow public read profiles" ON profiles FOR SELECT USING (true);

-- Allow public insert (for demo)
CREATE POLICY "Allow public insert projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert attachments" ON attachments FOR INSERT WITH CHECK (true);

-- Seed data for projects
INSERT INTO projects (id, title, description, status, priority, start_date, end_date, department, manager) VALUES
('11111111-1111-1111-1111-111111111111', 'Digital Forestry Service Improvement', 'Improving digital workflows and field reporting for forest management across districts.', 'Active', 'High', '2026-01-10', '2026-12-31', 'Department of Forests and Park Services', 'Karma Wangchuk'),
('22222222-2222-2222-2222-222222222222', 'Cordyceps Collection Monitoring', 'Tracking seasonal cordyceps harvesting across highland regions.', 'Active', 'Medium', '2026-03-01', '2026-09-30', 'Department of Agriculture', 'Pema Lhamo'),
('33333333-3333-3333-3333-333333333333', 'Forest Carbon Mapping', 'GIS-based carbon stock assessment for national forests.', 'Planning', 'High', '2026-06-01', '2027-05-31', 'Department of Forests and Park Services', 'Tshering Dorji'),
('44444444-4444-4444-4444-444444444444', 'Human–Elephant Conflict Mapping', 'Mapping conflict zones between human settlements and elephants in Samdrup Jongkhar.', 'Planning', 'Critical', '2026-04-01', '2026-10-31', 'Nature Conservation Division', 'Sonam Tobgay'),
('55555555-5555-5555-5555-555555555555', 'Watershed Restoration Initiative', 'Restoration of degraded watersheds across five districts.', 'Completed', 'Medium', '2025-01-01', '2025-12-31', 'Department of Forests and Park Services', 'Wangdi')
ON CONFLICT DO NOTHING;

-- Seed data for tasks
INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, assignee, created_at) VALUES
('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Conduct stakeholder workshop', 'Organize and facilitate a stakeholder consultation workshop in Thimphu.', 'Completed', 'High', '2026-02-28', 'Karma Wangchuk', '2026-01-15T08:00:00Z'),
('aaaa2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Develop digital field survey form', 'Create mobile-compatible forms for field data collection and reporting.', 'In Progress', 'High', '2026-05-15', 'Pema Lhamo', '2026-02-01T09:00:00Z'),
('aaaa3333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Map cordyceps harvesting zones', 'Delineate and digitize cordyceps collection zones on GIS.', 'In Progress', 'Medium', '2026-06-30', 'Wangdi', '2026-03-10T10:00:00Z'),
('aaaa4444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Procure remote sensing data', 'Acquire satellite imagery for carbon stock mapping and analysis.', 'Pending', 'High', '2026-07-01', 'Tshering Dorji', '2026-04-01T11:00:00Z'),
('aaaa5555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'Field site reconnaissance', 'Initial ground-truthing visit to known human–elephant conflict zones.', 'Pending', 'Critical', '2026-05-20', 'Sonam Tobgay', '2026-04-05T08:00:00Z'),
('aaaa6666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Develop training materials', 'Prepare training guides, presentations, and handouts for field staff.', 'Pending', 'Medium', '2026-06-15', 'Karma Wangchuk', '2026-02-20T09:00:00Z')
ON CONFLICT DO NOTHING;

-- Seed data for comments
INSERT INTO comments (id, task_id, text, author, created_at) VALUES
('cccc1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'Workshop completed successfully. All 24 stakeholders attended and provided useful feedback.', 'Karma Wangchuk', '2026-02-28T14:30:00Z'),
('cccc2222-2222-2222-2222-222222222222', 'aaaa1111-1111-1111-1111-111111111111', 'Minutes have been shared with the project team. Feedback has been incorporated into the action plan.', 'Pema Lhamo', '2026-03-01T09:15:00Z'),
('cccc3333-3333-3333-3333-333333333333', 'aaaa2222-2222-2222-2222-222222222222', 'Initial prototype of the form is ready. Awaiting review from the field team.', 'Pema Lhamo', '2026-04-10T11:00:00Z')
ON CONFLICT DO NOTHING;

-- Seed data for attachments
INSERT INTO attachments (id, task_id, filename, file_type, file_size, created_at) VALUES
('att11111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'Stakeholder Workshop Report.pdf', 'PDF document', '2.4 MB', '2026-02-28T15:00:00Z'),
('att22222-2222-2222-2222-222222222222', 'aaaa2222-2222-2222-2222-222222222222', 'Field Survey Form Draft.xlsx', 'Spreadsheet', '540 KB', '2026-04-10T10:00:00Z')
ON CONFLICT DO NOTHING;