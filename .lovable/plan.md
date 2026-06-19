
# Academic Domain — Production Build Plan

This is a large, multi-file build. I'll execute it in 4 sequential batches so the app stays compiling between batches and you can review progress. All work is scoped strictly to the Academic domain — no changes to operations, finance, assets, transport, or infrastructure.

## Foundation (shared, built first)

1. **Store expansion** (`src/lib/store.ts`)
   - Add entities: `Inquiry` (extended with stage history, counselor, follow-ups, notes, comm logs), `StudentRecord` (extended with academic history, medical, transport/hostel links, activity log), `AcademicYear`, `Stream`, `Batch`, `Assignment`, `Submission`, `AttendanceRecord` (daily + period), `ExamResult`, `MarksEntry`, `LessonPlan`, `Notice`.
   - Generic helpers: `archive/restore`, `bulkUpdate`, `bulkDelete`, `activityLog(entity,id,action)`, `attachments`, `notes`.
2. **Reusable components** (`src/components/`)
   - `data-table.tsx` — generic table with search, multi-filter, sort, pagination, bulk-select, bulk actions, CSV import/export, row-click → detail.
   - `detail-shell.tsx` — header + tabs + activity timeline + notes + attachments sidebar.
   - `activity-log.tsx`, `notes-panel.tsx`, `attachments-panel.tsx`.
   - `kanban-board.tsx` — drag/drop columns with stage rules.

## Batch 1 — Admissions + Students

3. **Admissions** (`src/routes/admin.admissions.tsx`, new `admin.admissions.$id.tsx`)
   - Replace static kanban with drag-drop Kanban (7 stages), counselor assignment, source filters, follow-up scheduler, bulk SMS/email, conversion analytics tab.
   - Inquiry detail page with 8 tabs: Student, Parent, Counseling history, Documents, Notes, Communication, Payment, Progress.
4. **Students** (`src/routes/students.tsx`, new `students.$id.tsx`)
   - Convert list to DataTable with bulk Promote/Transfer/Suspend, import/export.
   - Student detail page with 13 tabs (Overview, Personal, Academic, Attendance, Assignments, Results, Fees, Documents, Medical, Transport, Hostel, Parents, Activity).
   - Actions: Promote, Transfer, Suspend, Assign Transport/Hostel, Generate ID card (print view), Generate certificate (print view), Print profile.

## Batch 2 — Classes + Timetable

5. **Classes** (`src/routes/classes.tsx`, new `classes.$id.tsx`)
   - Academic Year, Stream, Batch CRUD; capacity & classroom allocation rules.
   - Class detail page with 8 tabs (Students, Subjects, Timetable, Assignments, Attendance, Exam perf, Teachers, Analytics).
6. **Timetable** (`src/routes/timetable.tsx`)
   - HTML5 drag/drop period cells; teacher & room conflict detection (visual + list); auto-schedule with workload balancing; free-period balancing.
   - Views: Class / Teacher / Room / Conflicts.
   - Actions: assign teacher, assign room, swap, lock, clone, publish; analytics for teacher workload and room utilization.

## Batch 3 — Assignments + Attendance + Exams

7. **Assignments** (`src/routes/assignments.tsx`, new `assignments.$id.tsx`)
   - Full CRUD with rich-text (textarea + markdown), attachments, rubrics editor, late-submission rules.
   - Detail page with 6 tabs (Overview, Submissions, Grading w/ bulk grade, Analytics, Comments, Attachments).
8. **Attendance** (`src/routes/attendance.tsx`)
   - Daily + Period modes; teacher attendance section; QR / Face / Biometric / Geo-fence stub flows; late marking; leave integration link.
   - Analytics: heatmap, chronic absentees, trend chart, low-attendance alerts with parent-notify action.
9. **Exams** (`src/routes/exams.tsx`, new `exams.$id.tsx`)
   - Keep existing question bank; add marks-entry sheet, moderation workflow, publish results, CBSE grade + GPA + co-scholastic + skill grading.
   - Exam detail with 7 tabs (Subjects, Students, Marks, Analytics, Result Summary, Top, Weak).

## Batch 4 — Teacher + Student/Parent portals + Analytics

10. **Teacher portal** — extend existing teacher routes with lesson plans CRUD, online-class link entry, student performance drill-down.
11. **Student portal** — extend with notices feed, study materials list, assignment submit.
12. **Parent portal** (`src/routes/parents.tsx` + detail) — child performance, fee status link, attendance alerts feed, message threads, leave-request submit.
13. **Academic Analytics** (`src/routes/analytics.tsx`) — add Academic tab: performance trends, subject heatmap, weak-student list, teacher utilization, attendance analytics.

## Technical notes

- All data stays client-side in the existing `store.ts` (no DB changes) so everything persists per session and stays consistent across routes.
- New routes follow the dot-naming convention; `routeTree.gen.ts` will be updated to register them.
- All tables use the new `data-table` component for consistent search/filter/sort/pagination/bulk.
- All entity rows are clickable → detail page.
- Activity log entries are written on every create/update/delete/bulk action automatically via the store helpers.

## Delivery

I'll ship Batch 1 in the next turn, verify build + click-through, then continue with 2 → 3 → 4 in subsequent turns. Total ~20–25 files created/modified.

**Approve to start with Foundation + Batch 1 (Admissions + Students)?**
