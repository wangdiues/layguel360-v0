export const mockUser = {
  name: "Karma Wangchuk",
  email: "karma.wangchuk@forestry.gov.bt",
  role: "Project Manager",
  initials: "KW",
  bio: "Senior project manager at the Department of Forests and Park Services.",
};

export const mockProjects = [
  {
    id: "proj-1",
    title: "Digital Forestry Service Improvement",
    description:
      "Improving digital workflows and field reporting for forest management across districts.",
    status: "Active",
    priority: "High",
    start_date: "2026-01-10",
    end_date: "2026-12-31",
    department: "Department of Forests and Park Services",
    manager: "Karma Wangchuk",
  },
  {
    id: "proj-2",
    title: "Cordyceps Collection Monitoring",
    description:
      "Tracking seasonal cordyceps harvesting across highland regions.",
    status: "Active",
    priority: "Medium",
    start_date: "2026-03-01",
    end_date: "2026-09-30",
    department: "Department of Agriculture",
    manager: "Pema Lhamo",
  },
  {
    id: "proj-3",
    title: "Forest Carbon Mapping",
    description:
      "GIS-based carbon stock assessment for national forests.",
    status: "Planning",
    priority: "High",
    start_date: "2026-06-01",
    end_date: "2027-05-31",
    department: "Department of Forests and Park Services",
    manager: "Tshering Dorji",
  },
  {
    id: "proj-4",
    title: "Human–Elephant Conflict Mapping",
    description:
      "Mapping conflict zones between human settlements and elephants in Samdrup Jongkhar.",
    status: "Planning",
    priority: "Critical",
    start_date: "2026-04-01",
    end_date: "2026-10-31",
    department: "Nature Conservation Division",
    manager: "Sonam Tobgay",
  },
  {
    id: "proj-5",
    title: "Watershed Restoration Initiative",
    description:
      "Restoration of degraded watersheds across five districts.",
    status: "Completed",
    priority: "Medium",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    department: "Department of Forests and Park Services",
    manager: "Wangdi",
  },
];

export const mockTasks = [
  {
    id: "task-1",
    project_id: "proj-1",
    title: "Conduct stakeholder workshop",
    description:
      "Organize and facilitate a stakeholder consultation workshop in Thimphu.",
    status: "Completed",
    priority: "High",
    due_date: "2026-02-28",
    assignee: "Karma Wangchuk",
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "task-2",
    project_id: "proj-1",
    title: "Develop digital field survey form",
    description:
      "Create mobile-compatible forms for field data collection and reporting.",
    status: "In Progress",
    priority: "High",
    due_date: "2026-05-15",
    assignee: "Pema Lhamo",
    created_at: "2026-02-01T09:00:00Z",
  },
  {
    id: "task-3",
    project_id: "proj-2",
    title: "Map cordyceps harvesting zones",
    description:
      "Delineate and digitize cordyceps collection zones on GIS.",
    status: "In Progress",
    priority: "Medium",
    due_date: "2026-06-30",
    assignee: "Wangdi",
    created_at: "2026-03-10T10:00:00Z",
  },
  {
    id: "task-4",
    project_id: "proj-3",
    title: "Procure remote sensing data",
    description:
      "Acquire satellite imagery for carbon stock mapping and analysis.",
    status: "Pending",
    priority: "High",
    due_date: "2026-07-01",
    assignee: "Tshering Dorji",
    created_at: "2026-04-01T11:00:00Z",
  },
  {
    id: "task-5",
    project_id: "proj-4",
    title: "Field site reconnaissance",
    description:
      "Initial ground-truthing visit to known human–elephant conflict zones.",
    status: "Pending",
    priority: "Critical",
    due_date: "2026-05-20",
    assignee: "Sonam Tobgay",
    created_at: "2026-04-05T08:00:00Z",
  },
  {
    id: "task-6",
    project_id: "proj-1",
    title: "Develop training materials",
    description:
      "Prepare training guides, presentations, and handouts for field staff.",
    status: "Pending",
    priority: "Medium",
    due_date: "2026-06-15",
    assignee: "Karma Wangchuk",
    created_at: "2026-02-20T09:00:00Z",
  },
];

export const mockComments: Record<
  string,
  Array<{ id: string; text: string; created_at: string; author: string }>
> = {
  "task-1": [
    {
      id: "c-1",
      text: "Workshop completed successfully. All 24 stakeholders attended and provided useful feedback.",
      created_at: "2026-02-28T14:30:00Z",
      author: "Karma Wangchuk",
    },
    {
      id: "c-2",
      text: "Minutes have been shared with the project team. Feedback has been incorporated into the action plan.",
      created_at: "2026-03-01T09:15:00Z",
      author: "Pema Lhamo",
    },
  ],
  "task-2": [
    {
      id: "c-3",
      text: "Initial prototype of the form is ready. Awaiting review from the field team.",
      created_at: "2026-04-10T11:00:00Z",
      author: "Pema Lhamo",
    },
  ],
};

export const mockAttachments: Record<
  string,
  Array<{
    id: string;
    filename: string;
    file_type: string;
    file_size: string;
    created_at: string;
  }>
> = {
  "task-1": [
    {
      id: "a-1",
      filename: "Stakeholder Workshop Report.pdf",
      file_type: "PDF document",
      file_size: "2.4 MB",
      created_at: "2026-02-28T15:00:00Z",
    },
  ],
  "task-2": [
    {
      id: "a-2",
      filename: "Field Survey Form Draft.xlsx",
      file_type: "Spreadsheet",
      file_size: "540 KB",
      created_at: "2026-04-10T10:00:00Z",
    },
  ],
};
