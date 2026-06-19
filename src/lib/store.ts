import { useSyncExternalStore } from "react";
import {
  students as initStudents,
  employees as initEmployees,
  institutes as initInstitutes,
  type Student,
  type Employee,
} from "./mock";
import type { UserRole } from "./auth";

export type Institute = {
  id: string;
  name: string;
  city: string;
  students: number;
  plan: "Growth" | "Business" | "Enterprise";
  status: "Active" | "Trial" | "Suspended";
  mrr: number;
  type?: string;
  board?: string;
  academicYear?: string;
  address?: string;
  state?: string;
  pin?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  principalName?: string;
  principalPhone?: string;
  adminName?: string;
  adminPhone?: string;
  gst?: string;
  pan?: string;
  primaryColor?: string;
  createdAt?: string;
  documents?: string[];
};

export type AppUser = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  instituteId: string;
  status: "Active" | "Suspended";
  createdAt: string;
};

type Listener = () => void;

function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    set: (updater: (s: T) => T) => {
      state = updater(state);
      listeners.forEach((l) => l());
    },
    subscribe: (l: Listener) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
  };
}

const studentStore = createStore<Student[]>(initStudents);
const employeeStore = createStore<Employee[]>(initEmployees);

export type FeeTxn = {
  id: string;
  studentId: string;
  student: string;
  class: string;
  head: string;
  amount: number;
  mode: "UPI" | "Card" | "NetBanking" | "Cash" | "Cheque";
  status: "Success" | "Pending" | "Failed";
  date: string;
};

const initTx: FeeTxn[] = [
  {
    id: "TX10421",
    studentId: "STU1000",
    student: "Aarav Sharma",
    class: "X-B",
    head: "Term 2 Tuition",
    amount: 48000,
    mode: "UPI",
    status: "Success",
    date: "Today, 2:14 PM",
  },
  {
    id: "TX10420",
    studentId: "STU1001",
    student: "Ananya Iyer",
    class: "VIII-A",
    head: "Transport + Tuition",
    amount: 36500,
    mode: "Card",
    status: "Success",
    date: "Today, 1:48 PM",
  },
  {
    id: "TX10419",
    studentId: "STU1002",
    student: "Vihaan Patel",
    class: "XI-C",
    head: "Exam Fee",
    amount: 4200,
    mode: "UPI",
    status: "Pending",
    date: "Today, 12:11 PM",
  },
  {
    id: "TX10418",
    studentId: "STU1003",
    student: "Diya Verma",
    class: "IX-A",
    head: "Hostel Fee Q3",
    amount: 62000,
    mode: "NetBanking",
    status: "Success",
    date: "Yesterday",
  },
  {
    id: "TX10417",
    studentId: "STU1004",
    student: "Kiara Mehta",
    class: "XII-A",
    head: "Tuition + Lab",
    amount: 51200,
    mode: "UPI",
    status: "Failed",
    date: "Yesterday",
  },
];
const txStore = createStore<FeeTxn[]>(initTx);

export type PayrollRun = {
  id: string;
  month: string;
  employeeCount: number;
  gross: number;
  net: number;
  tds: number;
  status: "Draft" | "Approved" | "Paid";
  runDate: string;
};

const initPay: PayrollRun[] = [
  {
    id: "PR-NOV25",
    month: "November 2025",
    employeeCount: 186,
    gross: 3540000,
    net: 3240000,
    tds: 210000,
    status: "Paid",
    runDate: "30 Nov 2025",
  },
  {
    id: "PR-OCT25",
    month: "October 2025",
    employeeCount: 184,
    gross: 3490000,
    net: 3196000,
    tds: 205000,
    status: "Paid",
    runDate: "31 Oct 2025",
  },
  {
    id: "PR-SEP25",
    month: "September 2025",
    employeeCount: 182,
    gross: 3455000,
    net: 3168000,
    tds: 198000,
    status: "Paid",
    runDate: "30 Sep 2025",
  },
];
const payStore = createStore<PayrollRun[]>(initPay);

function useStore<T>(s: ReturnType<typeof createStore<T>>): T {
  return useSyncExternalStore(s.subscribe, s.get, s.get);
}

export const useStudents = () => useStore(studentStore);
export const useEmployees = () => useStore(employeeStore);
export const useFeeTxns = () => useStore(txStore);
export const usePayrollRuns = () => useStore(payStore);

let _sn = 2000;
let _en = 3000;

export const studentsApi = {
  add: (s: Omit<Student, "id">) =>
    studentStore.set((arr) => [{ ...s, id: "STU" + ++_sn } as Student, ...arr]),
  update: (id: string, patch: Partial<Student>) =>
    studentStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
  remove: (id: string) => studentStore.set((arr) => arr.filter((x) => x.id !== id)),
};

export const employeesApi = {
  add: (e: Omit<Employee, "id">) =>
    employeeStore.set((arr) => [{ ...e, id: "EMP" + ++_en } as Employee, ...arr]),
  update: (id: string, patch: Partial<Employee>) =>
    employeeStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
  remove: (id: string) => employeeStore.set((arr) => arr.filter((x) => x.id !== id)),
};

let _tn = 10422;
export const feeApi = {
  add: (t: Omit<FeeTxn, "id" | "date">) =>
    txStore.set((arr) => [{ ...t, id: "TX" + ++_tn, date: "Just now" } as FeeTxn, ...arr]),
  update: (id: string, patch: Partial<FeeTxn>) =>
    txStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
  remove: (id: string) => txStore.set((arr) => arr.filter((x) => x.id !== id)),
};

// ============ Fee Structures & Late Fee ============
export type FeeComponent = {
  id: string;
  label: string;
  amount: number;
  frequency: "Monthly" | "Quarterly" | "Annual" | "One-time";
};

export type FeeStructure = {
  id: string;
  name: string;
  class: string;
  course?: string;
  components: FeeComponent[];
  dueDay: number; // day of month
  lateFeePerMonth: number;
  graceDays: number;
  createdAt: string;
};

const initStructures: FeeStructure[] = [
  {
    id: "FS001",
    name: "Class 6 — Standard 2025-26",
    class: "VI",
    course: "CBSE",
    components: [
      { id: "c1", label: "Base Fee", amount: 5000, frequency: "Monthly" },
      { id: "c2", label: "Tuition Fee", amount: 4000, frequency: "Monthly" },
      { id: "c3", label: "Transport Fee", amount: 1500, frequency: "Monthly" },
      { id: "c4", label: "Annual Charges", amount: 12000, frequency: "Annual" },
    ],
    dueDay: 10,
    lateFeePerMonth: 500,
    graceDays: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "FS002",
    name: "Class 7 — Standard 2025-26",
    class: "VII",
    course: "CBSE",
    components: [
      { id: "c1", label: "Base Fee", amount: 5500, frequency: "Monthly" },
      { id: "c2", label: "Tuition Fee", amount: 4500, frequency: "Monthly" },
      { id: "c3", label: "Hostel Fee", amount: 8000, frequency: "Monthly" },
    ],
    dueDay: 10,
    lateFeePerMonth: 600,
    graceDays: 2,
    createdAt: new Date().toISOString(),
  },
];
const structureStore = createStore<FeeStructure[]>(initStructures);
export const useFeeStructures = () => useStore(structureStore);

let _fsn = 100;
export const feeStructureApi = {
  add: (s: Omit<FeeStructure, "id" | "createdAt">) =>
    structureStore.set((arr) => [
      { ...s, id: "FS" + String(++_fsn).padStart(3, "0"), createdAt: new Date().toISOString() },
      ...arr,
    ]),
  update: (id: string, patch: Partial<FeeStructure>) =>
    structureStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
  remove: (id: string) => structureStore.set((arr) => arr.filter((x) => x.id !== id)),
};

// Track which months have been paid per student (keyed by `${studentId}:${YYYY-MM}`)
const paidStore = createStore<Record<string, boolean>>({});
export const usePaidMonths = () => useStore(paidStore);
export const paidApi = {
  markPaid: (studentId: string, ym: string) =>
    paidStore.set((m) => ({ ...m, [`${studentId}:${ym}`]: true })),
  markUnpaid: (studentId: string, ym: string) =>
    paidStore.set((m) => {
      const c = { ...m };
      delete c[`${studentId}:${ym}`];
      return c;
    }),
};

export function monthlyTotal(s: FeeStructure): number {
  return s.components
    .filter((c) => c.frequency === "Monthly")
    .reduce((a, c) => a + c.amount, 0);
}

export function annualTotal(s: FeeStructure): number {
  return s.components.reduce((a, c) => {
    const mult = c.frequency === "Monthly" ? 12 : c.frequency === "Quarterly" ? 4 : 1;
    return a + c.amount * mult;
  }, 0);
}

export type DueLine = {
  ym: string;
  label: string;
  monthly: number;
  lateFee: number;
  paid: boolean;
};

export function computeStudentDues(
  studentClass: string,
  studentId: string,
  structures: FeeStructure[],
  paid: Record<string, boolean>,
  monthsBack = 6,
): { structure?: FeeStructure; lines: DueLine[]; totalDue: number; totalLate: number } {
  const structure = structures.find((s) => s.class === studentClass);
  if (!structure) return { lines: [], totalDue: 0, totalLate: 0 };
  const monthly = monthlyTotal(structure);
  const today = new Date();
  const lines: DueLine[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-IN", { month: "short", year: "numeric" });
    const isPaid = !!paid[`${studentId}:${ym}`];
    let lateFee = 0;
    if (!isPaid) {
      const dueDate = new Date(d.getFullYear(), d.getMonth(), structure.dueDay);
      const cutoff = new Date(dueDate);
      cutoff.setDate(cutoff.getDate() + structure.graceDays);
      if (today > cutoff) lateFee = structure.lateFeePerMonth;
    }
    lines.push({ ym, label, monthly, lateFee, paid: isPaid });
  }
  const totalDue = lines.filter((l) => !l.paid).reduce((a, l) => a + l.monthly + l.lateFee, 0);
  const totalLate = lines.filter((l) => !l.paid).reduce((a, l) => a + l.lateFee, 0);
  return { structure, lines, totalDue, totalLate };
}

export const payrollApi = {
  add: (p: Omit<PayrollRun, "id" | "runDate">) =>
    payStore.set((arr) => [
      {
        ...p,
        id: "PR-" + Date.now().toString(36).slice(-5).toUpperCase(),
        runDate: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      } as PayrollRun,
      ...arr,
    ]),
  update: (id: string, patch: Partial<PayrollRun>) =>
    payStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
  remove: (id: string) => payStore.set((arr) => arr.filter((x) => x.id !== id)),
};

// ============ Institutes (Super Admin) ============
const instituteStore = createStore<Institute[]>(initInstitutes as Institute[]);
export const useInstitutes = () => useStore(instituteStore);

let _in = 100;
export const institutesApi = {
  add: (i: Omit<Institute, "id" | "createdAt">) =>
    instituteStore.set((arr) => [
      {
        ...i,
        id: "INS" + String(++_in).padStart(3, "0"),
        createdAt: new Date().toISOString(),
      } as Institute,
      ...arr,
    ]),
  update: (id: string, patch: Partial<Institute>) =>
    instituteStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
  remove: (id: string) => instituteStore.set((arr) => arr.filter((x) => x.id !== id)),
  get: (id: string) => instituteStore.get().find((x) => x.id === id),
};

// ============ Users (Super Admin managed) ============
const initUsers: AppUser[] = [
  {
    id: "U001",
    userId: "admin.dps",
    name: "Rahul Kapoor",
    email: "admin@dps.edu.in",
    phone: "+91 98100 12345",
    role: "admin",
    instituteId: "INS001",
    status: "Active",
    createdAt: "2024-04-01",
  },
  {
    id: "U002",
    userId: "principal.dps",
    name: "Meera Iyer",
    email: "principal@dps.edu.in",
    phone: "+91 98100 22345",
    role: "principal",
    instituteId: "INS001",
    status: "Active",
    createdAt: "2024-04-02",
  },
  {
    id: "U003",
    userId: "admin.gfi",
    name: "Arjun Reddy",
    email: "admin@greenfield.edu.in",
    phone: "+91 99100 11122",
    role: "admin",
    instituteId: "INS002",
    status: "Active",
    createdAt: "2024-05-15",
  },
];
const userStore = createStore<AppUser[]>(initUsers);
export const useAppUsers = () => useStore(userStore);

let _un = 100;
export const appUsersApi = {
  add: (u: Omit<AppUser, "id" | "createdAt">) =>
    userStore.set((arr) => [
      {
        ...u,
        id: "U" + String(++_un).padStart(3, "0"),
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...arr,
    ]),
  update: (id: string, patch: Partial<AppUser>) =>
    userStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
  remove: (id: string) => userStore.set((arr) => arr.filter((x) => x.id !== id)),
  list: () => userStore.get(),
};

// ============ Academic: Sections, Subjects ============
export type Section = {
  id: string;
  name: string;
  class: string;
  students: number;
  cap: number;
  teacher: string;
  subjects: number;
  room: string;
  archived?: boolean;
};
export type Subject = {
  id: string;
  code: string;
  name: string;
  dept: string;
  classes: number;
  faculty: number;
  type: "Core" | "Elective" | "Skill";
  archived?: boolean;
};
export type SubjectMapping = {
  id: string;
  sectionId: string;
  subjectId: string;
  teacher: string;
  periods: number;
  room: string;
  assessment: "Theory" | "Practical" | "Both";
  archived?: boolean;
};
export type CalendarEvent = {
  id: string;
  date: string;
  event: string;
  type: "Event" | "Exam" | "Holiday" | "PTM" | "Activity" | "Other";
  customType?: string;
  audience: string;
  notes: string;
  archived?: boolean;
};

const initSections: Section[] = [
  {
    id: "SEC1",
    name: "VI-A",
    class: "VI",
    students: 38,
    cap: 40,
    teacher: "M. Joshi",
    subjects: 8,
    room: "R-201",
  },
  {
    id: "SEC2",
    name: "VI-B",
    class: "VI",
    students: 40,
    cap: 40,
    teacher: "P. Iyer",
    subjects: 8,
    room: "R-202",
  },
  {
    id: "SEC3",
    name: "VII-A",
    class: "VII",
    students: 36,
    cap: 40,
    teacher: "R. Khanna",
    subjects: 8,
    room: "R-203",
  },
  {
    id: "SEC4",
    name: "VIII-A",
    class: "VIII",
    students: 39,
    cap: 40,
    teacher: "S. Bose",
    subjects: 9,
    room: "R-101",
  },
  {
    id: "SEC5",
    name: "IX-A",
    class: "IX",
    students: 42,
    cap: 42,
    teacher: "V. Nair",
    subjects: 9,
    room: "R-102",
  },
  {
    id: "SEC6",
    name: "X-B",
    class: "X",
    students: 42,
    cap: 42,
    teacher: "A. Mehta",
    subjects: 9,
    room: "R-104",
  },
  {
    id: "SEC7",
    name: "XI-C",
    class: "XI",
    students: 34,
    cap: 36,
    teacher: "K. Das",
    subjects: 5,
    room: "R-301",
  },
  {
    id: "SEC8",
    name: "XII-A",
    class: "XII",
    students: 32,
    cap: 36,
    teacher: "N. Patel",
    subjects: 5,
    room: "R-302",
  },
];
const initSubjects: Subject[] = [
  {
    id: "SUB1",
    code: "MTH101",
    name: "Mathematics",
    dept: "Mathematics",
    classes: 12,
    faculty: 6,
    type: "Core",
  },
  {
    id: "SUB2",
    code: "SCI101",
    name: "Science",
    dept: "Science",
    classes: 10,
    faculty: 8,
    type: "Core",
  },
  {
    id: "SUB3",
    code: "ENG101",
    name: "English",
    dept: "Languages",
    classes: 14,
    faculty: 5,
    type: "Core",
  },
  {
    id: "SUB4",
    code: "SOC101",
    name: "Social Studies",
    dept: "Humanities",
    classes: 8,
    faculty: 4,
    type: "Core",
  },
  {
    id: "SUB5",
    code: "CS201",
    name: "Computer Science",
    dept: "Computer Sci",
    classes: 6,
    faculty: 3,
    type: "Elective",
  },
  {
    id: "SUB6",
    code: "BIO301",
    name: "Biology",
    dept: "Science",
    classes: 4,
    faculty: 2,
    type: "Elective",
  },
  {
    id: "SUB7",
    code: "ECO301",
    name: "Economics",
    dept: "Commerce",
    classes: 4,
    faculty: 2,
    type: "Elective",
  },
  {
    id: "SUB8",
    code: "PE101",
    name: "Physical Education",
    dept: "Sports",
    classes: 14,
    faculty: 3,
    type: "Skill",
  },
];
const initMappings: SubjectMapping[] = [
  {
    id: "MAP1",
    sectionId: "SEC6",
    subjectId: "SUB1",
    teacher: "A. Mehta",
    periods: 6,
    room: "R-104",
    assessment: "Theory",
  },
  {
    id: "MAP2",
    sectionId: "SEC6",
    subjectId: "SUB2",
    teacher: "V. Nair",
    periods: 5,
    room: "Lab-2",
    assessment: "Both",
  },
  {
    id: "MAP3",
    sectionId: "SEC6",
    subjectId: "SUB3",
    teacher: "S. Bose",
    periods: 5,
    room: "R-104",
    assessment: "Theory",
  },
];
const initCalendar: CalendarEvent[] = [
  {
    id: "CAL1",
    date: "2025-11-10",
    event: "Children's Day Celebration",
    type: "Event",
    audience: "All Classes",
    notes: "House-wise cultural programme",
  },
  {
    id: "CAL2",
    date: "2025-11-25 to 2025-12-05",
    event: "Unit Test 3",
    type: "Exam",
    audience: "VI-XII",
    notes: "Manual timetable and invigilation to be published",
  },
  {
    id: "CAL3",
    date: "2025-12-25",
    event: "Christmas Holiday",
    type: "Holiday",
    audience: "All",
    notes: "Campus closed",
  },
];
const sectionStore = createStore<Section[]>(initSections);
const subjectStore = createStore<Subject[]>(initSubjects);
const subjectMappingStore = createStore<SubjectMapping[]>(initMappings);
const calendarStore = createStore<CalendarEvent[]>(initCalendar);
export const useSections = () => useStore(sectionStore);
export const useSubjects = () => useStore(subjectStore);
export const useSubjectMappings = () => useStore(subjectMappingStore);
export const useAcademicCalendar = () => useStore(calendarStore);
let _secN = 100,
  _subN = 100,
  _mapN = 100,
  _calN = 100;
export const sectionsApi = {
  add: (s: Omit<Section, "id">) =>
    sectionStore.set((arr) => { const id = "SEC" + ++_secN; activityApi.log("section", id, "Created"); return [{ ...s, id }, ...arr]; }),
  update: (id: string, patch: Partial<Section>) => {
    sectionStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    activityApi.log("section", id, "Updated");
  },
  remove: (id: string) => { sectionStore.set((arr) => arr.filter((x) => x.id !== id)); activityApi.log("section", id, "Deleted"); },
  archive: (id: string, archived = true) => { sectionStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, archived } : x))); activityApi.log("section", id, archived ? "Archived" : "Restored"); },
  get: (id: string) => sectionStore.get().find((x) => x.id === id),
};
export const subjectsApi = {
  add: (s: Omit<Subject, "id">) =>
    subjectStore.set((arr) => { const id = "SUB" + ++_subN; activityApi.log("subject", id, "Created"); return [{ ...s, id }, ...arr]; }),
  update: (id: string, patch: Partial<Subject>) => {
    subjectStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    activityApi.log("subject", id, "Updated");
  },
  remove: (id: string) => { subjectStore.set((arr) => arr.filter((x) => x.id !== id)); activityApi.log("subject", id, "Deleted"); },
  archive: (id: string, archived = true) => { subjectStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, archived } : x))); activityApi.log("subject", id, archived ? "Archived" : "Restored"); },
  get: (id: string) => subjectStore.get().find((x) => x.id === id),
};
export const subjectMappingsApi = {
  add: (m: Omit<SubjectMapping, "id">) =>
    subjectMappingStore.set((arr) => [{ ...m, id: "MAP" + ++_mapN }, ...arr]),
  update: (id: string, patch: Partial<SubjectMapping>) =>
    subjectMappingStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
  remove: (id: string) => subjectMappingStore.set((arr) => arr.filter((x) => x.id !== id)),
  archive: (id: string, archived = true) => subjectMappingStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, archived } : x))),
};
export const academicCalendarApi = {
  add: (e: Omit<CalendarEvent, "id">) =>
    calendarStore.set((arr) => [{ ...e, id: "CAL" + ++_calN }, ...arr]),
  update: (id: string, patch: Partial<CalendarEvent>) =>
    calendarStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
  remove: (id: string) => calendarStore.set((arr) => arr.filter((x) => x.id !== id)),
  archive: (id: string, archived = true) => calendarStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, archived } : x))),
};

// ============ Exams ============
export type Exam = {
  id: string;
  name: string;
  class: string;
  from: string;
  to: string;
  subjects: number;
  status: "Draft" | "Scheduled" | "In Progress" | "Completed";
};
export type Question = {
  id: string;
  subject: string;
  chapter: string;
  question: string;
  answer: string;
  diff: "Easy" | "Medium" | "Hard";
  marks: number;
  pdfName?: string;
  pdfUrl?: string;
  createdAt?: string;
};

const initExams: Exam[] = [
  {
    id: "EX1",
    name: "Term 2 — Pre-board",
    class: "XII",
    from: "12 Dec 25",
    to: "22 Dec 25",
    subjects: 6,
    status: "Scheduled",
  },
  {
    id: "EX2",
    name: "Unit Test 3",
    class: "X",
    from: "5 Dec 25",
    to: "9 Dec 25",
    subjects: 5,
    status: "Scheduled",
  },
  {
    id: "EX3",
    name: "Practical Exam — Science",
    class: "XI",
    from: "28 Nov 25",
    to: "30 Nov 25",
    subjects: 3,
    status: "In Progress",
  },
  {
    id: "EX4",
    name: "Term 2",
    class: "IX",
    from: "18 Dec 25",
    to: "26 Dec 25",
    subjects: 6,
    status: "Draft",
  },
];
const initQuestions: Question[] = [
  {
    id: "Q-1042",
    subject: "Math",
    chapter: "Trigonometry",
    question: "Prove that tan²A + 1 = sec²A and solve for A = 45°.",
    answer: "Use sin²A + cos²A = 1 and divide by cos²A.",
    diff: "Medium",
    marks: 4,
    createdAt: "Seed",
  },
  {
    id: "Q-1041",
    subject: "Science",
    chapter: "Electricity",
    question: "Explain Ohm's law with a circuit diagram and one daily-life example.",
    answer: "V = IR; current is proportional to potential difference when temperature is constant.",
    diff: "Hard",
    marks: 5,
    createdAt: "Seed",
  },
  {
    id: "Q-1040",
    subject: "English",
    chapter: "The Last Lesson",
    question: "Write a short character sketch of M. Hamel in 80 words.",
    answer: "M. Hamel is disciplined, patriotic, emotional, and devoted to teaching French.",
    diff: "Easy",
    marks: 2,
    createdAt: "Seed",
  },
  {
    id: "Q-1039",
    subject: "Math",
    chapter: "Quadratic Eq.",
    question: "Find the roots of x² - 5x + 6 = 0 by factorisation.",
    answer: "x² - 5x + 6 = (x-2)(x-3), so x = 2, 3.",
    diff: "Medium",
    marks: 3,
    createdAt: "Seed",
  },
  {
    id: "Q-1038",
    subject: "Social",
    chapter: "Nationalism",
    question: "Describe any five factors that led to the rise of nationalism in Europe.",
    answer: "Common identity, print culture, wars, revolutions, and political reforms.",
    diff: "Hard",
    marks: 5,
    createdAt: "Seed",
  },
  {
    id: "Q-1037",
    subject: "CS",
    chapter: "Python Lists",
    question: "Write a Python program to print the largest number from a list.",
    answer: "Use max(list) or iterate through the list while comparing values.",
    diff: "Medium",
    marks: 4,
    createdAt: "Seed",
  },
];
const examStore = createStore<Exam[]>(initExams);
const questionStore = createStore<Question[]>(initQuestions);
export const useExams = () => useStore(examStore);
export const useQuestions = () => useStore(questionStore);
let _exN = 100,
  _qN = 1043;
export const examsApi = {
  add: (e: Omit<Exam, "id">) => { const id = "EX" + ++_exN; examStore.set((arr) => [{ ...e, id }, ...arr]); activityApi.log("exam", id, "Created"); return id; },
  update: (id: string, patch: Partial<Exam>) => { examStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))); activityApi.log("exam", id, "Updated"); },
  remove: (id: string) => { examStore.set((arr) => arr.filter((x) => x.id !== id)); activityApi.log("exam", id, "Deleted"); },
  get: (id: string) => examStore.get().find((x) => x.id === id),
  archive: (id: string, archived = true) => { examStore.set((arr) => arr.map((x) => x.id === id ? { ...x, status: archived ? "Completed" : "Scheduled" } : x)); activityApi.log("exam", id, archived ? "Archived" : "Restored"); },
  advance: (id: string) => {
    const order: Exam["status"][] = ["Draft","Scheduled","In Progress","Completed"];
    examStore.set((arr) => arr.map((x) => { if (x.id !== id) return x; const next = order[Math.min(order.indexOf(x.status) + 1, order.length - 1)]; return { ...x, status: next }; }));
    activityApi.log("exam", id, "Status advanced");
  },
};

export const questionsApi = {
  add: (q: Omit<Question, "id">) =>
    questionStore.set((arr) => [
      { ...q, id: "Q-" + ++_qN, createdAt: q.createdAt ?? "Just now" },
      ...arr,
    ]),
  update: (id: string, patch: Partial<Question>) =>
    questionStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
  remove: (id: string) => questionStore.set((arr) => arr.filter((x) => x.id !== id)),
};

// ============ Custom Roles + matrix overrides ============
export type PermAction = "view" | "create" | "update" | "delete" | "export" | "approve";
export type RoleTabPerms = Record<string, PermAction[]>; // tabKey -> actions
export type RoleModulePerms = { enabled: boolean; tabs: RoleTabPerms };
export type RolePerms = Record<string, RoleModulePerms>; // moduleKey -> module perms
export type CustomRole = {
  id: string;
  name: string;
  level: "Read only" | "Read/Write" | "Full Admin" | "Custom";
  scope: "Institute" | "Department" | "Class" | "Self";
  desc: string;
  perms?: RolePerms;
  createdAt?: string;
  updatedAt?: string;
};
export type PermVal = "RW" | "R" | "—";
const customRoleStore = createStore<CustomRole[]>([]);
const permOverrideStore = createStore<Record<string, PermVal>>({});
export const useCustomRoles = () => useStore(customRoleStore);
export const usePermOverrides = () => useStore(permOverrideStore);
let _crN = 100;
export const customRolesApi = {
  add: (r: Omit<CustomRole, "id">) => {
    const id = "CR" + ++_crN;
    customRoleStore.set((arr) => [{ ...r, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...arr]);
    return id;
  },
  update: (id: string, patch: Partial<CustomRole>) =>
    customRoleStore.set((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: new Date().toISOString() } : x))),
  remove: (id: string) => customRoleStore.set((arr) => arr.filter((x) => x.id !== id)),
};
export const permOverridesApi = {
  set: (role: string, mod: string, v: PermVal) =>
    permOverrideStore.set((m) => ({ ...m, [`${role}:${mod}`]: v })),
};


// ============ Timetable manual overrides ============
export type TtCell = { subject: string; teacher: string; room: string; locked?: boolean };
export type TtMeta = { published?: boolean; publishedAt?: string; archived?: boolean; version?: number };
const ttStore = createStore<Record<string, TtCell>>({});
const ttMetaStore = createStore<Record<string, TtMeta>>({});
export const useTimetable = () => useStore(ttStore);
export const useTimetableMeta = () => useStore(ttMetaStore);
export const timetableApi = {
  set: (klass: string, day: number, period: number, cell: TtCell) => {
    ttStore.set((m) => ({ ...m, [`${klass}:${day}:${period}`]: cell }));
    activityApi.log("timetable", klass, `Set ${day}/${period} → ${cell.subject}`);
  },
  clear: (klass: string, day: number, period: number) =>
    ttStore.set((m) => {
      const c = { ...m };
      delete c[`${klass}:${day}:${period}`];
      return c;
    }),
  swap: (klass: string, aDay: number, aPeriod: number, bDay: number, bPeriod: number, getDefault: (d: number, p: number) => TtCell) => {
    ttStore.set((m) => {
      const ak = `${klass}:${aDay}:${aPeriod}`;
      const bk = `${klass}:${bDay}:${bPeriod}`;
      const aCell = m[ak] ?? getDefault(aDay, aPeriod);
      const bCell = m[bk] ?? getDefault(bDay, bPeriod);
      if (aCell.locked || bCell.locked) return m;
      return { ...m, [ak]: bCell, [bk]: aCell };
    });
    activityApi.log("timetable", klass, `Swapped ${aDay}/${aPeriod} ↔ ${bDay}/${bPeriod}`);
  },
  lock: (klass: string, day: number, period: number, locked: boolean, getDefault: (d: number, p: number) => TtCell) => {
    ttStore.set((m) => {
      const k = `${klass}:${day}:${period}`;
      const cur = m[k] ?? getDefault(day, period);
      return { ...m, [k]: { ...cur, locked } };
    });
    activityApi.log("timetable", klass, `${locked ? "Locked" : "Unlocked"} ${day}/${period}`);
  },
  clone: (srcKlass: string, destKlass: string) => {
    ttStore.set((m) => {
      const next = { ...m };
      Object.keys(m).filter((k) => k.startsWith(srcKlass + ":")).forEach((k) => {
        const rest = k.slice(srcKlass.length);
        next[destKlass + rest] = { ...m[k], locked: false };
      });
      return next;
    });
    activityApi.log("timetable", destKlass, `Cloned from ${srcKlass}`);
  },
  publish: (klass: string) => {
    ttMetaStore.set((m) => ({ ...m, [klass]: { ...(m[klass] || {}), published: true, publishedAt: new Date().toISOString(), version: ((m[klass]?.version) || 0) + 1 } }));
    activityApi.log("timetable", klass, "Published");
  },
  archive: (klass: string, archived = true) => {
    ttMetaStore.set((m) => ({ ...m, [klass]: { ...(m[klass] || {}), archived } }));
    activityApi.log("timetable", klass, archived ? "Archived" : "Restored");
  },
  resetClass: (klass: string) => {
    ttStore.set((m) => {
      const next: Record<string, TtCell> = {};
      Object.keys(m).forEach((k) => { if (!k.startsWith(klass + ":")) next[k] = m[k]; });
      return next;
    });
    activityApi.log("timetable", klass, "Reset to defaults");
  },
};

// ============ Activity Log / Notes (generic) ============
export type ActivityEntry = { id: string; entity: string; entityId: string; action: string; by: string; at: string; meta?: string };
export type NoteEntry = { id: string; entity: string; entityId: string; text: string; by: string; at: string };
const activityStore = createStore<ActivityEntry[]>([]);
const noteStore = createStore<NoteEntry[]>([]);
export const useActivity = () => useStore(activityStore);
export const useNotes = () => useStore(noteStore);
let _actN = 0, _noteN = 0;
export const activityApi = {
  log: (entity: string, entityId: string, action: string, by = "You", meta?: string) =>
    activityStore.set((arr) => [{ id: "ACT" + ++_actN, entity, entityId, action, by, at: new Date().toISOString(), meta }, ...arr]),
  for: (entity: string, entityId: string) => activityStore.get().filter((a) => a.entity === entity && a.entityId === entityId),
};
export const notesApi = {
  add: (entity: string, entityId: string, text: string, by = "You") =>
    noteStore.set((arr) => [{ id: "NOTE" + ++_noteN, entity, entityId, text, by, at: new Date().toISOString() }, ...arr]),
  remove: (id: string) => noteStore.set((arr) => arr.filter((n) => n.id !== id)),
  for: (entity: string, entityId: string) => noteStore.get().filter((n) => n.entity === entity && n.entityId === entityId),
};

// ============ Admissions Inquiries (deep) ============
export type AdmStage = "Inquiry" | "Lead" | "Counseling" | "Admission Test" | "Doc Verification" | "Fee Payment" | "Enrolled";
export const ADM_STAGES: AdmStage[] = ["Inquiry", "Lead", "Counseling", "Admission Test", "Doc Verification", "Fee Payment", "Enrolled"];
export type StageHistory = { stage: AdmStage; at: string; by: string };
export type CommLog = { id: string; channel: "Email" | "SMS" | "WhatsApp" | "Call"; subject: string; body: string; at: string; by: string };
export type FollowUp = { id: string; due: string; note: string; done: boolean };
export type Inquiry = {
  id: string; name: string; class: string; parent: string; motherName?: string;
  phone: string; email: string; source: "Walk-in" | "Website" | "Referral" | "Ad Campaign" | "Phone";
  stage: AdmStage; counselor?: string; dob?: string; gender?: "Male" | "Female" | "Other";
  prevSchool?: string; address?: string; notes?: string;
  documents?: { name: string; ok: boolean }[];
  testScore?: number; feePaid?: number; feeTotal?: number; archived?: boolean;
  createdAt: string; updatedAt: string;
  history: StageHistory[]; comms: CommLog[]; followUps: FollowUp[];
  /** Set when an Enrolled inquiry has been promoted into the Students table. */
  studentId?: string;
  /** Optional pre-filled detailed admission payload captured at intake. */
  studentDraft?: Partial<Omit<import("./mock").Student, "id">>;
};

const seedInquiry = (id: string, name: string, klass: string, parent: string, phone: string, source: Inquiry["source"], stage: AdmStage, counselor: string): Inquiry => ({
  id, name, class: klass, parent, phone,
  email: parent.toLowerCase().replace(/\s+/g, ".") + "@gmail.com",
  source, stage, counselor,
  gender: "Male", prevSchool: "Various Public School",
  documents: [
    { name: "Birth Certificate", ok: stage !== "Inquiry" },
    { name: "Aadhar Card", ok: ["Doc Verification","Fee Payment","Enrolled"].includes(stage) },
    { name: "Transfer Certificate", ok: ["Fee Payment","Enrolled"].includes(stage) },
    { name: "Previous Marksheet", ok: ["Doc Verification","Fee Payment","Enrolled"].includes(stage) },
    { name: "Passport Photo", ok: true },
  ],
  testScore: ["Admission Test","Doc Verification","Fee Payment","Enrolled"].includes(stage) ? 75 : undefined,
  feePaid: stage === "Enrolled" ? 85000 : stage === "Fee Payment" ? 25000 : 0,
  feeTotal: 85000,
  createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
  history: [{ stage: "Inquiry", at: new Date(Date.now() - 15 * 86400000).toISOString(), by: "System" }, { stage, at: new Date().toISOString(), by: counselor }],
  comms: [], followUps: [],
});

const initInquiries: Inquiry[] = [
  seedInquiry("ADM-001", "Riya Mehra", "VI", "Anil Mehra", "+91 98101 22344", "Walk-in", "Inquiry", "Sneha K."),
  seedInquiry("ADM-002", "Kabir Singh", "IX", "Harpreet Singh", "+91 98101 22345", "Website", "Lead", "Sneha K."),
  seedInquiry("ADM-003", "Tara Iyer", "XI", "Lakshmi Iyer", "+91 98101 22346", "Referral", "Counseling", "Rohit M."),
  seedInquiry("ADM-004", "Arjun Patel", "VII", "Nikhil Patel", "+91 98101 22347", "Website", "Admission Test", "Sneha K."),
  seedInquiry("ADM-005", "Saanvi Joshi", "X", "Pooja Joshi", "+91 98101 22348", "Walk-in", "Doc Verification", "Rohit M."),
  seedInquiry("ADM-006", "Vivaan Khanna", "VIII", "Aman Khanna", "+91 98101 22349", "Ad Campaign", "Fee Payment", "Sneha K."),
  seedInquiry("ADM-007", "Ananya Das", "XII", "Subir Das", "+91 98101 22350", "Referral", "Enrolled", "Rohit M."),
  seedInquiry("ADM-008", "Reyansh Bose", "VI", "Tanmoy Bose", "+91 98101 22351", "Website", "Lead", "Sneha K."),
];

const inquiryStore = createStore<Inquiry[]>(initInquiries);
export const useInquiries = () => useStore(inquiryStore);
let _iqN = 100;
export const inquiriesApi = {
  add: (i: Omit<Inquiry, "id" | "createdAt" | "updatedAt" | "history" | "comms" | "followUps" | "documents">) => {
    const now = new Date().toISOString();
    const id = "ADM-" + String(++_iqN).padStart(3, "0");
    inquiryStore.set((arr) => [{
      ...i, id, createdAt: now, updatedAt: now,
      history: [{ stage: i.stage, at: now, by: "You" }],
      comms: [], followUps: [],
      documents: [{ name: "Birth Certificate", ok: false }, { name: "Aadhar Card", ok: false }, { name: "Transfer Certificate", ok: false }, { name: "Previous Marksheet", ok: false }, { name: "Passport Photo", ok: false }],
    } as Inquiry, ...arr]);
    activityApi.log("inquiry", id, "Inquiry created");
    return id;
  },
  update: (id: string, patch: Partial<Inquiry>) => {
    inquiryStore.set((arr) => arr.map((x) => x.id === id ? { ...x, ...patch, updatedAt: new Date().toISOString() } : x));
    activityApi.log("inquiry", id, "Profile updated");
  },
  remove: (id: string) => { inquiryStore.set((arr) => arr.filter((x) => x.id !== id)); activityApi.log("inquiry", id, "Deleted"); },
  archive: (id: string, archived = true) => { inquiryStore.set((arr) => arr.map((x) => x.id === id ? { ...x, archived } : x)); activityApi.log("inquiry", id, archived ? "Archived" : "Restored"); },
  moveStage: (id: string, stage: AdmStage, by = "You") => {
    inquiryStore.set((arr) => arr.map((x) => x.id === id ? { ...x, stage, updatedAt: new Date().toISOString(), history: [...x.history, { stage, at: new Date().toISOString(), by }] } : x));
    activityApi.log("inquiry", id, `Moved to ${stage}`, by);
    if (stage === "Enrolled") {
      const inq = inquiryStore.get().find((x) => x.id === id);
      if (inq && !inq.studentId) {
        const draft = inq.studentDraft ?? {};
        const payload = {
          name: draft.name ?? inq.name,
          admissionNo: draft.admissionNo ?? `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`,
          class: draft.class ?? inq.class,
          section: draft.section ?? "A",
          rollNo: draft.rollNo ?? Math.floor(1 + Math.random() * 60),
          gender: draft.gender ?? (inq.gender ?? "Male"),
          parent: draft.parent ?? inq.parent,
          phone: draft.phone ?? inq.phone,
          feeStatus: draft.feeStatus ?? ("Pending" as const),
          attendance: draft.attendance ?? 100,
          email: draft.email ?? inq.email,
          motherName: draft.motherName ?? inq.motherName,
          dob: draft.dob ?? inq.dob,
          address: draft.address ?? inq.address,
          previousSchool: draft.previousSchool ?? inq.prevSchool,
          ...draft,
        } as Omit<import("./mock").Student, "id">;
        const sid = "STU" + ++_sn;
        studentStore.set((arr) => [{ ...payload, id: sid } as import("./mock").Student, ...arr]);
        inquiryStore.set((arr) => arr.map((x) => x.id === id ? { ...x, studentId: sid } : x));
        activityApi.log("inquiry", id, `Enrolled → added to Students as ${sid}`, by);
        activityApi.log("student", sid, `Enrolled from admission ${id}`, by);
      }
    }
  },
  assignCounselor: (id: string, counselor: string) => {
    inquiryStore.set((arr) => arr.map((x) => x.id === id ? { ...x, counselor } : x));
    activityApi.log("inquiry", id, `Counselor → ${counselor}`);
  },
  addComm: (id: string, c: Omit<CommLog, "id" | "at" | "by">) => {
    const entry: CommLog = { ...c, id: "C" + Date.now(), at: new Date().toISOString(), by: "You" };
    inquiryStore.set((arr) => arr.map((x) => x.id === id ? { ...x, comms: [entry, ...x.comms] } : x));
    activityApi.log("inquiry", id, `${c.channel} sent — ${c.subject}`);
  },
  addFollowUp: (id: string, due: string, note: string) => {
    const entry: FollowUp = { id: "F" + Date.now(), due, note, done: false };
    inquiryStore.set((arr) => arr.map((x) => x.id === id ? { ...x, followUps: [entry, ...x.followUps] } : x));
    activityApi.log("inquiry", id, `Follow-up set for ${due}`);
  },
  toggleFollowUp: (id: string, fid: string) => {
    inquiryStore.set((arr) => arr.map((x) => x.id === id ? { ...x, followUps: x.followUps.map((f) => f.id === fid ? { ...f, done: !f.done } : f) } : x));
  },
  toggleDoc: (id: string, name: string) => {
    inquiryStore.set((arr) => arr.map((x) => x.id === id ? { ...x, documents: (x.documents || []).map((d) => d.name === name ? { ...d, ok: !d.ok } : d) } : x));
    activityApi.log("inquiry", id, `Document toggled: ${name}`);
  },
  get: (id: string) => inquiryStore.get().find((x) => x.id === id),
  bulkRemove: (ids: string[]) => { inquiryStore.set((arr) => arr.filter((x) => !ids.includes(x.id))); ids.forEach((id) => activityApi.log("inquiry", id, "Bulk deleted")); },
  bulkArchive: (ids: string[]) => { inquiryStore.set((arr) => arr.map((x) => ids.includes(x.id) ? { ...x, archived: true } : x)); ids.forEach((id) => activityApi.log("inquiry", id, "Bulk archived")); },
};

// ============ ASSIGNMENTS — deep workflow ============
export type AssignmentStatus = "Draft" | "Published" | "Closed" | "Archived";
export type SubStatus = "Pending" | "Submitted" | "Late" | "Graded" | "Returned" | "Resubmitted";
export type Assignment = {
  id: string;
  title: string;
  subject: string;
  klass: string;
  teacher: string;
  due: string;
  maxMarks: number;
  instructions: string;
  attachments: string[];
  status: AssignmentStatus;
  publishedAt?: string;
  createdAt: string;
  archived?: boolean;
};
export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt?: string;
  files: string[];
  text?: string;
  status: SubStatus;
  marks?: number;
  feedback?: string;
  draftGrade?: number;
  publishedAt?: string;
  late?: boolean;
  resubmissionCount?: number;
};
export type Comment = { id: string; entity: string; entityId: string; text: string; by: string; at: string };

const initAssignments: Assignment[] = [
  { id: "AS-204", title: "Chapter 4 — Quadratic Equations Worksheet", subject: "Math", klass: "X-B", teacher: "A. Mehta", due: "2025-11-28", maxMarks: 20, instructions: "Solve all 10 problems and show full working. Submit as a single PDF.", attachments: ["worksheet.pdf"], status: "Published", publishedAt: new Date(Date.now()-5*86400000).toISOString(), createdAt: new Date(Date.now()-6*86400000).toISOString() },
  { id: "AS-203", title: "Essay: My Role Models", subject: "English", klass: "IX-A", teacher: "S. Bose", due: "2025-11-26", maxMarks: 15, instructions: "Write a 400-word essay. Cite at least two examples.", attachments: [], status: "Published", publishedAt: new Date(Date.now()-7*86400000).toISOString(), createdAt: new Date(Date.now()-8*86400000).toISOString() },
  { id: "AS-202", title: "Lab Report — Acids & Bases", subject: "Science", klass: "XI-C", teacher: "K. Das", due: "2025-11-30", maxMarks: 25, instructions: "Submit a typed lab report with observation table and conclusion.", attachments: ["rubric.pdf"], status: "Published", publishedAt: new Date(Date.now()-3*86400000).toISOString(), createdAt: new Date(Date.now()-4*86400000).toISOString() },
  { id: "AS-201", title: "Python Functions Practice", subject: "CS", klass: "XII-A", teacher: "N. Patel", due: "2025-11-24", maxMarks: 20, instructions: "Complete the 6 function-writing exercises.", attachments: [], status: "Closed", publishedAt: new Date(Date.now()-14*86400000).toISOString(), createdAt: new Date(Date.now()-15*86400000).toISOString() },
  { id: "AS-200", title: "History Timeline Project", subject: "Social", klass: "VIII-A", teacher: "R. Khanna", due: "2025-12-05", maxMarks: 30, instructions: "Build a chronological timeline with 12 events.", attachments: [], status: "Draft", createdAt: new Date(Date.now()-1*86400000).toISOString() },
];
const seedSubs = (): Submission[] => {
  const out: Submission[] = [];
  const names = ["Aarav Sharma","Diya Verma","Vihaan Patel","Ananya Iyer","Kiara Mehta","Ishaan Nair","Pari Bose","Arjun Das"];
  initAssignments.forEach((a, ai) => {
    if (a.status === "Draft") return;
    names.forEach((n, i) => {
      const r = (ai * 7 + i) % 10;
      const st: SubStatus = r < 2 ? "Pending" : r < 4 ? "Submitted" : r < 7 ? "Graded" : r < 8 ? "Late" : "Returned";
      const submitted = st !== "Pending";
      out.push({
        id: `SUB-${a.id}-${i}`, assignmentId: a.id, studentId: `STU100${i}`, studentName: n,
        submittedAt: submitted ? new Date(Date.now() - i*3600000).toISOString() : undefined,
        files: submitted ? ["submission.pdf"] : [], status: st,
        marks: st === "Graded" || st === "Returned" ? Math.max(0, a.maxMarks - (i*2 % 8)) : undefined,
        feedback: st === "Graded" ? "Good attempt, watch step 3." : undefined,
        late: st === "Late",
        publishedAt: st === "Graded" ? new Date().toISOString() : undefined,
        resubmissionCount: 0,
      });
    });
  });
  return out;
};
const assignmentStore = createStore<Assignment[]>(initAssignments);
const submissionStore = createStore<Submission[]>(seedSubs());
const commentStore = createStore<Comment[]>([]);
export const useAssignments = () => useStore(assignmentStore);
export const useSubmissions = () => useStore(submissionStore);
export const useComments = () => useStore(commentStore);
let _asN = 205, _subSN = 1000, _cmN = 0;

export const assignmentsApi = {
  add: (a: Omit<Assignment, "id" | "createdAt">) => {
    const id = "AS-" + ++_asN;
    assignmentStore.set((arr) => [{ ...a, id, createdAt: new Date().toISOString() }, ...arr]);
    activityApi.log("assignment", id, `Created (${a.status})`);
    return id;
  },
  update: (id: string, patch: Partial<Assignment>) => {
    assignmentStore.set((arr) => arr.map((x) => x.id === id ? { ...x, ...patch } : x));
    activityApi.log("assignment", id, "Updated");
  },
  publish: (id: string) => {
    assignmentStore.set((arr) => arr.map((x) => x.id === id ? { ...x, status: "Published", publishedAt: new Date().toISOString() } : x));
    activityApi.log("assignment", id, "Published");
  },
  close: (id: string) => {
    assignmentStore.set((arr) => arr.map((x) => x.id === id ? { ...x, status: "Closed" } : x));
    activityApi.log("assignment", id, "Closed");
  },
  reopen: (id: string) => {
    assignmentStore.set((arr) => arr.map((x) => x.id === id ? { ...x, status: "Published" } : x));
    activityApi.log("assignment", id, "Reopened");
  },
  duplicate: (id: string) => {
    const src = assignmentStore.get().find((x) => x.id === id);
    if (!src) return;
    const nid = "AS-" + ++_asN;
    assignmentStore.set((arr) => [{ ...src, id: nid, status: "Draft", title: src.title + " (Copy)", createdAt: new Date().toISOString(), publishedAt: undefined }, ...arr]);
    activityApi.log("assignment", nid, `Duplicated from ${id}`);
    return nid;
  },
  archive: (id: string, archived = true) => {
    assignmentStore.set((arr) => arr.map((x) => x.id === id ? { ...x, archived, status: archived ? "Archived" : "Published" } : x));
    activityApi.log("assignment", id, archived ? "Archived" : "Restored");
  },
  remove: (id: string) => { assignmentStore.set((arr) => arr.filter((x) => x.id !== id)); activityApi.log("assignment", id, "Deleted"); },
  get: (id: string) => assignmentStore.get().find((x) => x.id === id),
  bulkPublish: (ids: string[]) => ids.forEach((i) => assignmentsApi.publish(i)),
  bulkArchive: (ids: string[]) => ids.forEach((i) => assignmentsApi.archive(i, true)),
};

export const submissionsApi = {
  for: (assignmentId: string) => submissionStore.get().filter((s) => s.assignmentId === assignmentId),
  forStudent: (studentId: string) => submissionStore.get().filter((s) => s.studentId === studentId),
  submit: (assignmentId: string, studentId: string, studentName: string, files: string[], text?: string) => {
    const id = `SUB-${assignmentId}-${++_subSN}`;
    const a = assignmentsApi.get(assignmentId);
    const late = a ? new Date() > new Date(a.due) : false;
    const existing = submissionStore.get().find((s) => s.assignmentId === assignmentId && s.studentId === studentId);
    if (existing) {
      submissionStore.set((arr) => arr.map((s) => s.id === existing.id ? { ...s, files, text, submittedAt: new Date().toISOString(), status: late ? "Late" : "Submitted", late, resubmissionCount: (s.resubmissionCount || 0) + 1 } : s));
      activityApi.log("submission", existing.id, late ? "Resubmitted (late)" : "Resubmitted");
      return existing.id;
    }
    submissionStore.set((arr) => [{ id, assignmentId, studentId, studentName, files, text, submittedAt: new Date().toISOString(), status: late ? "Late" : "Submitted", late }, ...arr]);
    activityApi.log("submission", id, late ? "Submitted (late)" : "Submitted");
    return id;
  },
  saveDraftGrade: (id: string, marks: number, feedback?: string) => {
    submissionStore.set((arr) => arr.map((s) => s.id === id ? { ...s, draftGrade: marks, feedback } : s));
    activityApi.log("submission", id, `Draft grade saved (${marks})`);
  },
  publishGrade: (id: string, marks: number, feedback?: string) => {
    submissionStore.set((arr) => arr.map((s) => s.id === id ? { ...s, marks, feedback, draftGrade: undefined, status: "Graded", publishedAt: new Date().toISOString() } : s));
    activityApi.log("submission", id, `Graded ${marks}`);
  },
  reopenGrading: (id: string) => {
    submissionStore.set((arr) => arr.map((s) => s.id === id ? { ...s, status: "Submitted", marks: undefined, publishedAt: undefined } : s));
    activityApi.log("submission", id, "Grading reopened");
  },
  returnForRevision: (id: string, feedback: string) => {
    submissionStore.set((arr) => arr.map((s) => s.id === id ? { ...s, status: "Returned", feedback } : s));
    activityApi.log("submission", id, "Returned for revision");
  },
  bulkPublishGrades: (assignmentId: string) => {
    submissionStore.set((arr) => arr.map((s) => s.assignmentId === assignmentId && s.draftGrade != null ? { ...s, marks: s.draftGrade, status: "Graded", draftGrade: undefined, publishedAt: new Date().toISOString() } : s));
    activityApi.log("assignment", assignmentId, "Bulk grades published");
  },
};

export const commentsApi = {
  for: (entity: string, entityId: string) => commentStore.get().filter((c) => c.entity === entity && c.entityId === entityId),
  add: (entity: string, entityId: string, text: string, by = "You") => {
    const id = "CM" + ++_cmN;
    commentStore.set((arr) => [{ id, entity, entityId, text, by, at: new Date().toISOString() }, ...arr]);
  },
  remove: (id: string) => commentStore.set((arr) => arr.filter((c) => c.id !== id)),
};

// ============ ATTENDANCE — deep workflow ============
export type AttMark = "P" | "A" | "L" | "H";
export type AttendanceRecord = {
  id: string;
  date: string;
  klass: string;
  period?: number;
  studentId: string;
  studentName: string;
  mark: AttMark;
  remark?: string;
  markedBy: string;
  markedAt: string;
  locked?: boolean;
  override?: { from: AttMark; by: string; at: string; reason: string }[];
};
export type LeaveRequest = {
  id: string;
  studentId: string;
  studentName: string;
  klass: string;
  from: string;
  to: string;
  reason: string;
  type: "Sick" | "Casual" | "Planned" | "Emergency";
  status: "Pending" | "Approved" | "Rejected";
  raisedBy: "Student" | "Parent" | "Teacher";
  raisedAt: string;
  decidedBy?: string;
  decidedAt?: string;
  remark?: string;
};
export type CorrectionRequest = {
  id: string;
  recordId: string;
  studentId: string;
  studentName: string;
  klass: string;
  date: string;
  requestedMark: AttMark;
  currentMark: AttMark;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  raisedBy: string;
  raisedAt: string;
  decidedBy?: string;
  decidedAt?: string;
};
export type AttLock = { klass: string; date: string; lockedBy: string; lockedAt: string };

const attRecordStore = createStore<AttendanceRecord[]>([]);
const leaveStore = createStore<LeaveRequest[]>([
  { id: "LV-001", studentId: "STU1003", studentName: "Diya Verma", klass: "IX-A", from: "2025-11-26", to: "2025-11-28", reason: "Family wedding out of town", type: "Planned", status: "Pending", raisedBy: "Parent", raisedAt: new Date(Date.now()-86400000).toISOString() },
  { id: "LV-002", studentId: "STU1004", studentName: "Kiara Mehta", klass: "XII-A", from: "2025-11-25", to: "2025-11-25", reason: "Viral fever — doctor advised rest", type: "Sick", status: "Approved", raisedBy: "Parent", raisedAt: new Date(Date.now()-2*86400000).toISOString(), decidedBy: "Class Teacher", decidedAt: new Date(Date.now()-86400000).toISOString() },
  { id: "LV-003", studentId: "STU1001", studentName: "Ananya Iyer", klass: "VIII-A", from: "2025-12-01", to: "2025-12-03", reason: "Inter-school sports tournament", type: "Planned", status: "Pending", raisedBy: "Teacher", raisedAt: new Date().toISOString() },
]);
const correctionStore = createStore<CorrectionRequest[]>([
  { id: "CR-001", recordId: "AR-1", studentId: "STU1002", studentName: "Vihaan Patel", klass: "XI-C", date: "2025-11-22", requestedMark: "P", currentMark: "A", reason: "Was in lab — biometric did not log", status: "Pending", raisedBy: "Vihaan Patel", raisedAt: new Date(Date.now()-3600000).toISOString() },
]);
const attLockStore = createStore<AttLock[]>([]);
export const useAttendanceRecords = () => useStore(attRecordStore);
export const useLeaveRequests = () => useStore(leaveStore);
export const useCorrectionRequests = () => useStore(correctionStore);
export const useAttLocks = () => useStore(attLockStore);
let _arN = 100, _lvN = 100, _crqN = 100;

export const attendanceApi = {
  mark: (klass: string, date: string, studentId: string, studentName: string, mark: AttMark, period?: number, remark?: string) => {
    const id = "AR-" + ++_arN;
    const locked = attLockStore.get().some((l) => l.klass === klass && l.date === date);
    if (locked) return null;
    attRecordStore.set((arr) => {
      const existing = arr.find((r) => r.klass === klass && r.date === date && r.studentId === studentId && r.period === period);
      if (existing) {
        return arr.map((r) => r.id === existing.id ? { ...r, mark, remark, markedAt: new Date().toISOString() } : r);
      }
      return [{ id, date, klass, period, studentId, studentName, mark, remark, markedBy: "You", markedAt: new Date().toISOString() }, ...arr];
    });
    return id;
  },
  override: (recordId: string, newMark: AttMark, reason: string) => {
    attRecordStore.set((arr) => arr.map((r) => r.id === recordId ? { ...r, override: [...(r.override || []), { from: r.mark, by: "You", at: new Date().toISOString(), reason }], mark: newMark } : r));
    activityApi.log("attendance", recordId, `Overridden → ${newMark}: ${reason}`);
  },
  lock: (klass: string, date: string) => {
    attLockStore.set((arr) => [...arr.filter((l) => !(l.klass === klass && l.date === date)), { klass, date, lockedBy: "You", lockedAt: new Date().toISOString() }]);
    activityApi.log("attendance", `${klass}/${date}`, "Locked");
  },
  unlock: (klass: string, date: string) => {
    attLockStore.set((arr) => arr.filter((l) => !(l.klass === klass && l.date === date)));
    activityApi.log("attendance", `${klass}/${date}`, "Unlocked");
  },
  isLocked: (klass: string, date: string) => attLockStore.get().some((l) => l.klass === klass && l.date === date),
};

export const leaveApi = {
  add: (l: Omit<LeaveRequest, "id" | "raisedAt" | "status">) => {
    const id = "LV-" + String(++_lvN).padStart(3, "0");
    leaveStore.set((arr) => [{ ...l, id, status: "Pending", raisedAt: new Date().toISOString() }, ...arr]);
    activityApi.log("leave", id, "Requested");
    return id;
  },
  approve: (id: string, remark?: string) => {
    leaveStore.set((arr) => arr.map((l) => l.id === id ? { ...l, status: "Approved", decidedBy: "You", decidedAt: new Date().toISOString(), remark } : l));
    activityApi.log("leave", id, "Approved");
  },
  reject: (id: string, remark?: string) => {
    leaveStore.set((arr) => arr.map((l) => l.id === id ? { ...l, status: "Rejected", decidedBy: "You", decidedAt: new Date().toISOString(), remark } : l));
    activityApi.log("leave", id, "Rejected");
  },
  remove: (id: string) => leaveStore.set((arr) => arr.filter((l) => l.id !== id)),
};

export const correctionApi = {
  raise: (c: Omit<CorrectionRequest, "id" | "raisedAt" | "status">) => {
    const id = "CR-" + String(++_crqN).padStart(3, "0");
    correctionStore.set((arr) => [{ ...c, id, status: "Pending", raisedAt: new Date().toISOString() }, ...arr]);
    activityApi.log("correction", id, "Raised");
    return id;
  },
  approve: (id: string) => {
    const c = correctionStore.get().find((x) => x.id === id);
    if (!c) return;
    correctionStore.set((arr) => arr.map((x) => x.id === id ? { ...x, status: "Approved", decidedBy: "You", decidedAt: new Date().toISOString() } : x));
    attendanceApi.override(c.recordId, c.requestedMark, `Correction ${id}: ${c.reason}`);
    activityApi.log("correction", id, "Approved");
  },
  reject: (id: string) => {
    correctionStore.set((arr) => arr.map((x) => x.id === id ? { ...x, status: "Rejected", decidedBy: "You", decidedAt: new Date().toISOString() } : x));
    activityApi.log("correction", id, "Rejected");
  },
};

// ============ EXAM workflows — marks, moderation, report cards ============
export type MarkEntry = {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  klass: string;
  subject: string;
  obtained?: number;
  max: number;
  absent?: boolean;
  grace?: number;
  remarks?: string;
  status: "Draft" | "Submitted" | "Moderated" | "Published" | "Rejected";
  enteredBy?: string;
  enteredAt?: string;
  moderatedBy?: string;
  moderatedAt?: string;
  moderationComment?: string;
  publishedAt?: string;
};
const initMarkEntries: MarkEntry[] = (() => {
  const out: MarkEntry[] = [];
  const subs = ["Math","Science","English","Social","Hindi"];
  const names = ["Aarav Sharma","Diya Verma","Vihaan Patel","Ananya Iyer","Kiara Mehta","Ishaan Nair","Pari Bose","Arjun Das"];
  names.forEach((n, i) => {
    subs.forEach((s, si) => {
      const seed = (i * 7 + si * 11) % 40;
      out.push({
        id: `ME-EX2-${i}-${si}`, examId: "EX2", studentId: `STU100${i}`, studentName: n, klass: "X", subject: s,
        obtained: 55 + seed, max: 100,
        status: si < 3 ? "Published" : si < 4 ? "Moderated" : "Draft",
        enteredBy: "A. Mehta", enteredAt: new Date(Date.now()-86400000).toISOString(),
      });
    });
  });
  return out;
})();
const markEntryStore = createStore<MarkEntry[]>(initMarkEntries);
export const useMarkEntries = () => useStore(markEntryStore);
let _meN = 10000;

export const marksApi = {
  for: (examId: string) => markEntryStore.get().filter((m) => m.examId === examId),
  forStudent: (studentId: string) => markEntryStore.get().filter((m) => m.studentId === studentId),
  saveDraft: (entries: Partial<MarkEntry>[]) => {
    markEntryStore.set((arr) => {
      const next = [...arr];
      entries.forEach((e) => {
        if (e.id) {
          const i = next.findIndex((x) => x.id === e.id);
          if (i >= 0) next[i] = { ...next[i], ...e, status: "Draft", enteredAt: new Date().toISOString() };
        } else if (e.examId && e.studentId && e.subject) {
          const id = "ME-" + ++_meN;
          next.unshift({ id, examId: e.examId!, studentId: e.studentId!, studentName: e.studentName || "", klass: e.klass || "", subject: e.subject!, obtained: e.obtained, max: e.max || 100, absent: e.absent, grace: e.grace, remarks: e.remarks, status: "Draft", enteredBy: "You", enteredAt: new Date().toISOString() });
        }
      });
      return next;
    });
  },
  submitForModeration: (examId: string, subject?: string) => {
    markEntryStore.set((arr) => arr.map((m) => m.examId === examId && (!subject || m.subject === subject) && m.status === "Draft" ? { ...m, status: "Submitted" } : m));
    activityApi.log("exam", examId, `Submitted for moderation${subject ? ` — ${subject}` : ""}`);
  },
  approveModeration: (examId: string, comment: string, subject?: string) => {
    markEntryStore.set((arr) => arr.map((m) => m.examId === examId && (!subject || m.subject === subject) && m.status === "Submitted" ? { ...m, status: "Moderated", moderatedBy: "You", moderatedAt: new Date().toISOString(), moderationComment: comment } : m));
    activityApi.log("exam", examId, `Moderation approved${subject ? ` — ${subject}` : ""}`);
  },
  rejectModeration: (examId: string, comment: string, subject?: string) => {
    markEntryStore.set((arr) => arr.map((m) => m.examId === examId && (!subject || m.subject === subject) && m.status === "Submitted" ? { ...m, status: "Rejected", moderationComment: comment } : m));
    activityApi.log("exam", examId, `Moderation rejected${subject ? ` — ${subject}` : ""}`);
  },
  publish: (examId: string, subject?: string) => {
    markEntryStore.set((arr) => arr.map((m) => m.examId === examId && (!subject || m.subject === subject) && (m.status === "Moderated" || m.status === "Draft") ? { ...m, status: "Published", publishedAt: new Date().toISOString() } : m));
    activityApi.log("exam", examId, `Marks published${subject ? ` — ${subject}` : ""}`);
  },
  markAbsent: (id: string) => markEntryStore.set((arr) => arr.map((m) => m.id === id ? { ...m, absent: true, obtained: 0 } : m)),
  setGrace: (id: string, grace: number) => markEntryStore.set((arr) => arr.map((m) => m.id === id ? { ...m, grace } : m)),
  bulkUploadCsv: (examId: string, rows: { studentId: string; subject: string; obtained: number }[]) => {
    const _exam = examsApi.get(examId);
    rows.forEach((r) => {
      const existing = markEntryStore.get().find((m) => m.examId === examId && m.studentId === r.studentId && m.subject === r.subject);
      if (existing) marksApi.saveDraft([{ id: existing.id, obtained: r.obtained }]);
      else marksApi.saveDraft([{ examId, studentId: r.studentId, subject: r.subject, obtained: r.obtained, max: 100 }]);
    });
    activityApi.log("exam", examId, `Bulk uploaded ${rows.length} marks`);
  },
};


// ============ LESSON PLANS ============
export type LessonPlan = {
  id: string;
  title: string;
  subject: string;
  klass: string;
  teacher: string;
  chapter: string;
  topic: string;
  method: string;
  weekOf: string;
  periods: number;
  materials: string[];
  status: "Draft" | "Submitted" | "Approved" | "Changes Requested";
  completion: "Not Started" | "In Progress" | "Completed";
  completionLogs: { id: string; date: string; note: string; by: string }[];
  archived?: boolean;
  createdAt: string;
};

const initLessonPlans: LessonPlan[] = [
  { id: "LP-2025-118", title: "Heights & Distances", subject: "Mathematics", klass: "X-B", teacher: "A. Mehta", chapter: "Trigonometry", topic: "Real-world applications of heights and distances", method: "Discussion + worked examples", weekOf: "2025-11-24", periods: 4, materials: ["MAT-001"], status: "Approved", completion: "In Progress", completionLogs: [{ id:"CL-1", date:"2025-11-25", note:"Period 1 done — intro + 3 examples", by:"A. Mehta" }], createdAt: new Date(Date.now()-7*86400000).toISOString() },
  { id: "LP-2025-117", title: "Trigonometric ratios", subject: "Mathematics", klass: "X-A", teacher: "A. Mehta", chapter: "Trigonometry", topic: "Ratios of complementary angles", method: "Board work + Quiz", weekOf: "2025-11-24", periods: 3, materials: [], status: "Submitted", completion: "Not Started", completionLogs: [], createdAt: new Date(Date.now()-3*86400000).toISOString() },
  { id: "LP-2025-116", title: "Mid-point theorem", subject: "Mathematics", klass: "IX-A", teacher: "V. Nair", chapter: "Quadrilaterals", topic: "Mid-point theorem & converse", method: "Geometric construction", weekOf: "2025-11-17", periods: 3, materials: ["MAT-002"], status: "Changes Requested", completion: "Not Started", completionLogs: [], createdAt: new Date(Date.now()-10*86400000).toISOString() },
  { id: "LP-2025-115", title: "Acids & Bases — Lab", subject: "Science", klass: "XI-C", teacher: "K. Das", chapter: "Chemistry Lab", topic: "Indicator preparation and pH testing", method: "Hands-on lab", weekOf: "2025-11-24", periods: 2, materials: ["MAT-003"], status: "Draft", completion: "Not Started", completionLogs: [], createdAt: new Date(Date.now()-1*86400000).toISOString() },
];
const lessonPlanStore = createStore<LessonPlan[]>(initLessonPlans);
export const useLessonPlans = () => useStore(lessonPlanStore);
let _lpN = 119, _clN = 100;
export const lessonPlansApi = {
  list: () => lessonPlanStore.get(),
  get: (id: string) => lessonPlanStore.get().find((x) => x.id === id),
  forTeacher: (teacher: string) => lessonPlanStore.get().filter((x) => x.teacher === teacher && !x.archived),
  forSubject: (subject: string) => lessonPlanStore.get().filter((x) => x.subject === subject && !x.archived),
  forKlass: (klass: string) => lessonPlanStore.get().filter((x) => x.klass === klass && !x.archived),
  add: (p: Omit<LessonPlan, "id" | "createdAt" | "completionLogs">) => {
    const id = "LP-2025-" + ++_lpN;
    lessonPlanStore.set((a) => [{ ...p, id, completionLogs: [], createdAt: new Date().toISOString() }, ...a]);
    activityApi.log("lesson-plan", id, `Created (${p.status})`);
    return id;
  },
  update: (id: string, patch: Partial<LessonPlan>) => {
    lessonPlanStore.set((a) => a.map((x) => x.id === id ? { ...x, ...patch } : x));
    activityApi.log("lesson-plan", id, "Updated");
  },
  submit: (id: string) => { lessonPlanStore.set((a) => a.map((x) => x.id === id ? { ...x, status: "Submitted" } : x)); activityApi.log("lesson-plan", id, "Submitted to HOD"); },
  approve: (id: string) => { lessonPlanStore.set((a) => a.map((x) => x.id === id ? { ...x, status: "Approved" } : x)); activityApi.log("lesson-plan", id, "Approved"); },
  requestChanges: (id: string, note: string) => { lessonPlanStore.set((a) => a.map((x) => x.id === id ? { ...x, status: "Changes Requested" } : x)); activityApi.log("lesson-plan", id, `Changes requested: ${note}`); },
  setCompletion: (id: string, completion: LessonPlan["completion"]) => { lessonPlanStore.set((a) => a.map((x) => x.id === id ? { ...x, completion } : x)); activityApi.log("lesson-plan", id, `Completion → ${completion}`); },
  addLog: (id: string, note: string) => {
    const log = { id: "CL-" + ++_clN, date: new Date().toISOString().slice(0,10), note, by: "You" };
    lessonPlanStore.set((a) => a.map((x) => x.id === id ? { ...x, completionLogs: [log, ...x.completionLogs] } : x));
    activityApi.log("lesson-plan", id, `Log added: ${note}`);
  },
  attachMaterial: (id: string, materialId: string) => {
    lessonPlanStore.set((a) => a.map((x) => x.id === id ? { ...x, materials: x.materials.includes(materialId) ? x.materials : [...x.materials, materialId] } : x));
    activityApi.log("lesson-plan", id, `Material attached: ${materialId}`);
  },
  detachMaterial: (id: string, materialId: string) => {
    lessonPlanStore.set((a) => a.map((x) => x.id === id ? { ...x, materials: x.materials.filter((m) => m !== materialId) } : x));
  },
  archive: (id: string, archived = true) => { lessonPlanStore.set((a) => a.map((x) => x.id === id ? { ...x, archived } : x)); activityApi.log("lesson-plan", id, archived ? "Archived" : "Restored"); },
  remove: (id: string) => { lessonPlanStore.set((a) => a.filter((x) => x.id !== id)); activityApi.log("lesson-plan", id, "Deleted"); },
};

// ============ STUDY MATERIALS ============
export type Material = {
  id: string;
  title: string;
  type: "PDF" | "Video" | "Link" | "Doc";
  url: string;
  size?: string;
  subject: string;
  klasses: string[];
  teacher: string;
  description?: string;
  downloads: number;
  uploadedAt: string;
  archived?: boolean;
};

const initMaterials: Material[] = [
  { id: "MAT-001", title: "Trigonometry — Worked Examples Pack", type: "PDF", url: "/files/trig-worked.pdf", size: "2.4 MB", subject: "Mathematics", klasses: ["X-A","X-B"], teacher: "A. Mehta", description: "20 solved problems on heights & distances.", downloads: 42, uploadedAt: new Date(Date.now()-9*86400000).toISOString() },
  { id: "MAT-002", title: "Mid-point Theorem — Geometry Video", type: "Video", url: "https://example.com/video/midpoint", subject: "Mathematics", klasses: ["IX-A"], teacher: "V. Nair", description: "12-min explainer with construction.", downloads: 18, uploadedAt: new Date(Date.now()-12*86400000).toISOString() },
  { id: "MAT-003", title: "Acids & Bases Lab Manual", type: "PDF", url: "/files/acids-lab.pdf", size: "1.8 MB", subject: "Science", klasses: ["XI-C"], teacher: "K. Das", description: "Lab safety + indicator preparation.", downloads: 26, uploadedAt: new Date(Date.now()-4*86400000).toISOString() },
  { id: "MAT-004", title: "NCERT Reference: The Last Lesson", type: "Link", url: "https://ncert.nic.in/textbook/pdf/lefl101.pdf", subject: "English", klasses: ["IX-A","X-A","X-B"], teacher: "S. Bose", description: "Official chapter PDF.", downloads: 53, uploadedAt: new Date(Date.now()-2*86400000).toISOString() },
];
const materialStore = createStore<Material[]>(initMaterials);
export const useMaterials = () => useStore(materialStore);
let _matN = 100;
export const materialsApi = {
  list: () => materialStore.get(),
  get: (id: string) => materialStore.get().find((x) => x.id === id),
  forStudent: (klass: string) => materialStore.get().filter((m) => !m.archived && m.klasses.includes(klass)),
  forSubject: (subject: string) => materialStore.get().filter((m) => !m.archived && m.subject === subject),
  forTeacher: (teacher: string) => materialStore.get().filter((m) => !m.archived && m.teacher === teacher),
  add: (m: Omit<Material, "id" | "uploadedAt" | "downloads">) => {
    const id = "MAT-" + String(++_matN).padStart(3, "0");
    materialStore.set((a) => [{ ...m, id, downloads: 0, uploadedAt: new Date().toISOString() }, ...a]);
    activityApi.log("material", id, "Uploaded");
    return id;
  },
  update: (id: string, patch: Partial<Material>) => {
    materialStore.set((a) => a.map((x) => x.id === id ? { ...x, ...patch } : x));
    activityApi.log("material", id, "Updated");
  },
  download: (id: string) => {
    materialStore.set((a) => a.map((x) => x.id === id ? { ...x, downloads: x.downloads + 1 } : x));
    activityApi.log("material", id, "Downloaded");
  },
  archive: (id: string, archived = true) => { materialStore.set((a) => a.map((x) => x.id === id ? { ...x, archived } : x)); activityApi.log("material", id, archived ? "Archived" : "Restored"); },
  remove: (id: string) => { materialStore.set((a) => a.filter((x) => x.id !== id)); activityApi.log("material", id, "Deleted"); },
};

// ============ NOTICES ============
export type NoticeAudience = "All" | "Teachers" | "Students" | "Parents" | "Staff" | "Class" | "Department";
export type Notice = {
  id: string;
  title: string;
  body: string;
  category: "Academic" | "Events" | "Fees" | "Holiday" | "Exam" | "General";
  audience: NoticeAudience;
  targetClass?: string;
  targetDept?: string;
  attachments: string[];
  publishedAt?: string;
  by: string;
  status: "Draft" | "Published" | "Archived";
  acks: string[];
  createdAt: string;
};

const initNotices: Notice[] = [
  { id: "NOT-101", title: "Pre-board schedule released", body: "Class X & XII pre-board exams begin 12 Dec 2025. Timetable attached.", category: "Exam", audience: "Students", attachments: ["preboard-schedule.pdf"], publishedAt: new Date(Date.now()-1*86400000).toISOString(), by: "Principal", status: "Published", acks: ["STU1000"], createdAt: new Date(Date.now()-1*86400000).toISOString() },
  { id: "NOT-100", title: "Term 2 fees — final reminder", body: "Term 2 fees due 30 Nov. Late fee ₹500 applies thereafter.", category: "Fees", audience: "Parents", attachments: [], publishedAt: new Date(Date.now()-2*86400000).toISOString(), by: "Accounts", status: "Published", acks: [], createdAt: new Date(Date.now()-2*86400000).toISOString() },
  { id: "NOT-099", title: "Inter-house debate — registrations open", body: "Theme: AI in education. Register by Friday with your house captain.", category: "Events", audience: "All", attachments: [], publishedAt: new Date(Date.now()-3*86400000).toISOString(), by: "Cultural Committee", status: "Published", acks: [], createdAt: new Date(Date.now()-3*86400000).toISOString() },
  { id: "NOT-098", title: "Faculty meeting — Wednesday 3 PM", body: "Mandatory for all teaching staff. Agenda: term 2 academic audit.", category: "General", audience: "Teachers", attachments: [], publishedAt: new Date(Date.now()-4*86400000).toISOString(), by: "Principal", status: "Published", acks: [], createdAt: new Date(Date.now()-4*86400000).toISOString() },
];
const noticeStore = createStore<Notice[]>(initNotices);
export const useNotices = () => useStore(noticeStore);
let _notN = 102;
export const noticesApi = {
  list: () => noticeStore.get(),
  get: (id: string) => noticeStore.get().find((x) => x.id === id),
  forAudience: (aud: NoticeAudience[], klass?: string) =>
    noticeStore.get().filter((n) => n.status === "Published" && (aud.includes(n.audience) || n.audience === "All" || (n.audience === "Class" && klass && n.targetClass === klass))),
  add: (n: Omit<Notice, "id" | "createdAt" | "acks" | "status"> & { status?: Notice["status"] }) => {
    const id = "NOT-" + ++_notN;
    const status = n.status || "Draft";
    noticeStore.set((a) => [{ ...n, id, status, acks: [], createdAt: new Date().toISOString(), publishedAt: status === "Published" ? new Date().toISOString() : undefined }, ...a]);
    activityApi.log("notice", id, `Created (${status})`);
    return id;
  },
  update: (id: string, patch: Partial<Notice>) => { noticeStore.set((a) => a.map((x) => x.id === id ? { ...x, ...patch } : x)); activityApi.log("notice", id, "Updated"); },
  publish: (id: string) => { noticeStore.set((a) => a.map((x) => x.id === id ? { ...x, status: "Published", publishedAt: new Date().toISOString() } : x)); activityApi.log("notice", id, "Published"); },
  unpublish: (id: string) => { noticeStore.set((a) => a.map((x) => x.id === id ? { ...x, status: "Draft" } : x)); activityApi.log("notice", id, "Unpublished"); },
  archive: (id: string) => { noticeStore.set((a) => a.map((x) => x.id === id ? { ...x, status: "Archived" } : x)); activityApi.log("notice", id, "Archived"); },
  acknowledge: (id: string, who: string) => {
    noticeStore.set((a) => a.map((x) => x.id === id ? { ...x, acks: x.acks.includes(who) ? x.acks : [...x.acks, who] } : x));
    activityApi.log("notice", id, `Acknowledged by ${who}`);
  },
  remove: (id: string) => { noticeStore.set((a) => a.filter((x) => x.id !== id)); activityApi.log("notice", id, "Deleted"); },
};




