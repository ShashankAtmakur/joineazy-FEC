const STORAGE_KEY = 'joineazy_demo_v1'

const initial = {
  users: [
    { id: 's1', name: 'Alice Student', role: 'student' },
    { id: 's2', name: 'Bob Student', role: 'student' },
    { id: 'a1', name: 'Prof. Smith', role: 'admin' }
  ],
  assignments: [
    {
      id: 'as1',
      title: 'Essay: Modern JS Patterns',
      dueDate: '2025-11-15',
      driveLink: 'https://drive.google.com/example-essay-submission',
      createdBy: 'a1',
      assignedTo: ['s1', 's2']
    },
    {
      id: 'as2',
      title: 'Project: Small React App',
      dueDate: '2025-11-30',
      driveLink: 'https://drive.google.com/example-project-submission',
      createdBy: 'a1',
      assignedTo: ['s1']
    }
  ],
  submissions: [
    // each entry {assignmentId, studentId, submitted:false, confirmed:false, timestamp}
    { assignmentId: 'as1', studentId: 's1', submitted: false, confirmed: false, timestamp: null, submissionLink: null },
    { assignmentId: 'as1', studentId: 's2', submitted: false, confirmed: false, timestamp: Date.now() - 1000*60*60*24, submissionLink: 'https://drive.google.com/example-submission-s2' },
    { assignmentId: 'as2', studentId: 's1', submitted: true, confirmed: false, timestamp: Date.now() - 1000*60*60, submissionLink: null }
  ]
}

export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return initial
  try {
    return JSON.parse(raw)
  } catch (e) {
    console.warn('Failed to parse storage, seeding fresh state')
    return initial
  }
}

export function saveState(patch) {
  const cur = loadState()
  const next = { ...cur, ...patch }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function seedDataIfNeeded() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  }
}

export function getAssignments() {
  const s = loadState()
  return s.assignments
}

export function getUsers() {
  return loadState().users
}

export function getSubmissions() {
  return loadState().submissions
}

export function updateSubmission(updated) {
  const s = loadState()
  const idx = s.submissions.findIndex(x => x.assignmentId === updated.assignmentId && x.studentId === updated.studentId)
  if (idx >= 0) {
    s.submissions[idx] = { ...s.submissions[idx], ...updated }
  } else {
    s.submissions.push(updated)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  emitUpdate()
}

export function addAssignment(assignment) {
  const s = loadState()
  s.assignments.push(assignment)
  // create empty submissions for assigned students
  assignment.assignedTo.forEach(stId => {
    s.submissions.push({ assignmentId: assignment.id, studentId: stId, submitted: false, confirmed: false, timestamp: null })
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  emitUpdate()
}

function emitUpdate() {
  try {
    window.dispatchEvent(new Event('joineazy:update'))
  } catch (e) {
    // no-op in non-browser environments
  }
}

export function addUser(user) {
  const s = loadState()
  s.users.push(user)
  // if creating a student, do not auto-assign any assignments
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  emitUpdate()
}

export function removeUser(userId) {
  const s = loadState()
  // remove user
  s.users = s.users.filter(u => u.id !== userId)
  // remove submissions for this user
  s.submissions = s.submissions.filter(sub => sub.studentId !== userId)
  // remove from assignedTo arrays
  s.assignments = s.assignments.map(a => ({ ...a, assignedTo: a.assignedTo.filter(id => id !== userId) }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  emitUpdate()
}

export function removeAssignment(assignmentId) {
  const s = loadState()
  s.assignments = s.assignments.filter(a => a.id !== assignmentId)
  s.submissions = s.submissions.filter(sub => sub.assignmentId !== assignmentId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  emitUpdate()
}
