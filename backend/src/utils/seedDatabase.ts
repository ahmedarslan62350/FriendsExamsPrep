import { connectDB } from '../config/database';
import mongoose from 'mongoose';
import { ACTIVITY_TYPES, SUBJECTS } from '../config/constants';
import { Activity } from '../modules/activity/activity.model';
import { Chapter } from '../modules/chapters/chapter.model';
import { Progress } from '../modules/progress/progress.model';
import { Subject } from '../modules/subjects/subject.model';
import { Task } from '../modules/tasks/task.model';
import { User } from '../modules/users/user.model';

type ChapterSeed = {
  title: string;
  totalTopics: number;
};

const syllabus: Record<(typeof SUBJECTS)[number], ChapterSeed[]> = {
  Physics: [
    { title: '12. Electrostatics', totalTopics: 18 },
    { title: '13. Current Electricity', totalTopics: 16 },
    { title: '14. Electromagnetism', totalTopics: 20 },
    { title: '15. Electromagnetic Induction', totalTopics: 14 },
    { title: '16. Alternating Current', totalTopics: 14 },
    { title: '17. Physics of Solids', totalTopics: 15 },
    { title: '18. Electronics', totalTopics: 17 },
    { title: '19. Dawn of Modern Physics', totalTopics: 12 },
    { title: '20. Atomic Spectra', totalTopics: 12 },
    { title: '21. Nuclear Physics', totalTopics: 14 },
  ],
  Computer: [
    { title: '1. Data and Databases Basics', totalTopics: 10 },
    { title: '2. Database Concepts', totalTopics: 12 },
    { title: '3. Database Design Process', totalTopics: 11 },
    { title: '4. Normalization', totalTopics: 10 },
    { title: '5. Introduction to MS Access', totalTopics: 12 },
    { title: '6. Tables, Queries and Forms', totalTopics: 12 },
    { title: '7. Reports and Practical Database Work', totalTopics: 10 },
    { title: '8. Getting Started with C', totalTopics: 10 },
    { title: '9. Elements of C', totalTopics: 12 },
    { title: '10. Input and Output in C', totalTopics: 10 },
    { title: '11. Decision Constructs in C', totalTopics: 11 },
    { title: '12. Loop Constructs in C', totalTopics: 12 },
    { title: '13. Functions in C', totalTopics: 12 },
    { title: '14. File Handling in C', totalTopics: 11 },
  ],
  Math: [
    { title: '1. Functions and Limits', totalTopics: 15 },
    { title: '2. Differentiation', totalTopics: 16 },
    { title: '3. Integration', totalTopics: 18 },
    { title: '4. Analytical Geometry', totalTopics: 14 },
    { title: '5. Vectors', totalTopics: 13 },
    { title: '6. Probability', totalTopics: 12 },
    { title: '7. Trigonometry', totalTopics: 14 },
    { title: '8. Complex Numbers', totalTopics: 12 },
  ],
  English: [
    { title: '1. Reading Skills', totalTopics: 10 },
    { title: '2. Writing Skills', totalTopics: 12 },
    { title: '3. Grammar', totalTopics: 14 },
    { title: '4. Essays', totalTopics: 9 },
    { title: '5. Translation', totalTopics: 8 },
    { title: '6. Comprehension', totalTopics: 10 },
    { title: '7. Letters and Applications', totalTopics: 8 },
  ],
  Urdu: [
    { title: '1. Manaqib Umar Bin Abdul Aziz (مناقب عمر بن عبدالعزیز)', totalTopics: 10 },
    { title: '2. Tashkeel-e-Pakistan (تشکیلِ پاکستان)', totalTopics: 11 },
    { title: '3. Nawab Mohsin-ul-Mulk (نواب محسن الملک)', totalTopics: 10 },
    { title: '4. Mehnat Pasand Khiradmand (محنت پسند خردمند)', totalTopics: 9 },
    { title: '5. Akbari ki Hamaqatein (اکبری کی حماقتیں)', totalTopics: 9 },
    { title: '6. Pehli Fatah (پہلی فتح)', totalTopics: 8 },
    { title: '7. Dastak (دستک)', totalTopics: 8 },
    { title: '8. Hawai (ہوائی)', totalTopics: 8 },
    { title: '9. Maulana Zafar Ali Khan (مولانا ظفر علی خاں)', totalTopics: 10 },
    { title: '10. Qartaba ka Qazi (قرطبہ کا قاضی)', totalTopics: 9 },
    { title: '11. Mawasalat ke Jadeed Zaraye (مواصلات کے جدید ذرائع)', totalTopics: 9 },
    { title: '12. Maulvi Nazir Ahmad (مولوی نذیر احمد)', totalTopics: 9 },
    { title: '13. Aik Safarnama jo Kahin ka bhi Nahi Hai (ایک سفر نامہ جو کہیں کا بھی نہیں ہے)', totalTopics: 10 },
    { title: '14. Ayub Abbasi (ایوب عباسی)', totalTopics: 8 },
    { title: '15. Nazm - Hamd', totalTopics: 7 },
    { title: '16. Nazm - Naat', totalTopics: 7 },
    { title: '17. Nazm - Islami Masawat', totalTopics: 8 },
    { title: '18. Nazm - Admi', totalTopics: 8 },
    { title: '19. Nazm - Nojawan se Khitab', totalTopics: 8 },
    { title: '20. Ghazal - Mir Taqi Mir', totalTopics: 9 },
    { title: '21. Ghazal - Mirza Ghalib', totalTopics: 9 },
    { title: '22. Ghazal - Hasrat Mohani', totalTopics: 8 },
    { title: '23. Ghazal - Nasir Kazmi', totalTopics: 8 },
    { title: '24. Grammar & Composition - Mazmoon Nawesi', totalTopics: 10 },
    { title: '25. Grammar & Composition - Letters and Applications', totalTopics: 9 },
    { title: '26. Grammar - Ramooz-e-Auqaf & Sentence Correction', totalTopics: 10 },
    { title: '27. Grammar - Muhawray (Idioms)', totalTopics: 9 },
  ],
  TarjumaTulQuran: [
    { title: '1. Tilawat e Quran ke Adaab', totalTopics: 8 },
    { title: '2. Umoomi Hidayat', totalTopics: 8 },
    { title: '3. Hasilat e Taalum', totalTopics: 8 },
    { title: '4. Surah Al Nisa', totalTopics: 12 },
    { title: '5. Surah Al Maidah', totalTopics: 12 },
    { title: '6. Surah Al Noor', totalTopics: 11 },
    { title: '7. Surah Al Ahzaab', totalTopics: 11 },
    { title: '8. Surah Muhammad', totalTopics: 10 },
    { title: '9. Surah Al Fatah', totalTopics: 10 },
    { title: '10. Surah Al Hujraat', totalTopics: 10 },
    { title: '11. Surah Al Hadeed', totalTopics: 10 },
    { title: '12. Surah Al Mujadlah', totalTopics: 10 },
    { title: '13. Surah Al Hashr', totalTopics: 10 },
    { title: '14. Surah Al Mumtahinah', totalTopics: 9 },
    { title: '15. Surah Al Saff', totalTopics: 9 },
    { title: '16. Surah Al Jummah', totalTopics: 8 },
    { title: '17. Surah Al Munafiqoon', totalTopics: 8 },
    { title: '18. Surah Al Taghabun', totalTopics: 8 },
    { title: '19. Surah Al Talaq', totalTopics: 8 },
    { title: '20. Surah Al Tahreem', totalTopics: 8 },
  ],
  PakStudies: [
    { title: '1. Ideology of Pakistan', totalTopics: 11 },
    { title: '2. Pakistan Movement', totalTopics: 13 },
    { title: '3. Constitutional Development', totalTopics: 12 },
    { title: '4. Geography of Pakistan', totalTopics: 10 },
    { title: '5. Economy of Pakistan', totalTopics: 10 },
    { title: '6. Foreign Policy', totalTopics: 9 },
    { title: '7. Current Affairs', totalTopics: 11 },
    { title: '8. National Integration', totalTopics: 9 },
  ],
};

const now = new Date();
const hoursAgo = (hours: number): Date => new Date(now.getTime() - hours * 60 * 60 * 1000);

function subjectBias(email: string, subject: (typeof SUBJECTS)[number]): number {
  const table: Record<string, Partial<Record<(typeof SUBJECTS)[number], number>>> = {
    'ahmed.raza12@example.com': { Physics: 88, Math: 84, Urdu: 51 },
    'ali.hamza12@example.com': { Computer: 86, Physics: 78, Urdu: 49 },
    'hassan.javed12@example.com': { Math: 89, Physics: 74, English: 71 },
    'bilal.tariq12@example.com': { PakStudies: 80, English: 74, Math: 68 },
    'hamza.saeed12@example.com': { TarjumaTulQuran: 82, Physics: 72, Urdu: 58 },
    'zain.aslam12@example.com': { Computer: 79, Math: 73, Urdu: 55 },
    'usman.khalid12@example.com': { Physics: 75, Computer: 73, English: 69 },
    'haris.muneeb12@example.com': { Math: 70, PakStudies: 72, Urdu: 53 },
  };

  return table[email]?.[subject] ?? 66;
}

function realisticCompletion(email: string, subject: (typeof SUBJECTS)[number], chapterIdx: number): number {
  const base = subjectBias(email, subject);
  const wave = (chapterIdx * 7 + email.length * 3) % 18;
  return Math.max(22, Math.min(99, base - 12 + wave));
}

async function seedDatabase(): Promise<void> {
  await connectDB();
  console.log('Connected. Seeding realistic competitive data...');

  await Promise.all([
    Activity.deleteMany({}),
    Progress.deleteMany({}),
    Task.deleteMany({}),
    Chapter.deleteMany({}),
    Subject.deleteMany({}),
  ]);

  const subjectDocs = await Subject.insertMany(SUBJECTS.map((name) => ({ name })));
  const subjectByName = new Map(subjectDocs.map((doc) => [doc.name, doc]));

  for (const subjectName of SUBJECTS) {
    const subject = subjectByName.get(subjectName);
    if (!subject) continue;
    const chapters = syllabus[subjectName].map((chapter) => ({
      subjectId: subject._id,
      title: chapter.title,
      totalTopics: chapter.totalTopics,
    }));
    await Chapter.insertMany(chapters);
  }

  const users = await User.find()
    .sort({ leaderboardScore: -1, createdAt: 1 })
    .limit(8);

  if (users.length === 0) {
    throw new Error('No existing users found. Create users first, then run seed.');
  }

  const chapters = await Chapter.find().populate('subjectId', 'name').lean();
  for (const user of users) {
    const progressRows = chapters.map((chapter, idx) => {
      const subjectName = (chapter.subjectId as unknown as { name: (typeof SUBJECTS)[number] }).name;
      const completionPercent = realisticCompletion(user.email, subjectName, idx + 1);
      const studyMinutes = Math.round((completionPercent * (chapter.totalTopics * 11)) / 100) + ((idx + 1) % 3) * 12;
      const revisionCount = completionPercent > 80 ? 3 : completionPercent > 60 ? 2 : 1;
      return {
        userId: user._id,
        chapterId: chapter._id,
        completionPercent,
        studyMinutes,
        revisionCount,
        updatedAt: hoursAgo(((idx + user.name.length) % 96) + 3),
      };
    });
    await Progress.insertMany(progressRows);
  }

  const taskTemplates = [
    { title: 'Complete Physics Chapter 14 (Electromagnetism)', xpReward: 65, estimatedMinutes: 120, completed: true },
    { title: 'Revise Math Integration past paper MCQs', xpReward: 55, estimatedMinutes: 90, completed: true },
    { title: 'Study Urdu Essay + Khulasa writing', xpReward: 40, estimatedMinutes: 75, completed: false },
    { title: 'Solve 25 C language loop questions', xpReward: 60, estimatedMinutes: 95, completed: true },
    { title: 'Read Surah Al Noor tarjuma with notes', xpReward: 45, estimatedMinutes: 70, completed: false },
    { title: 'Attempt Pakistan Studies chapter test', xpReward: 35, estimatedMinutes: 50, completed: true },
    { title: '2-hour focused study sprint', xpReward: 50, estimatedMinutes: 120, completed: false },
  ];

  for (const user of users) {
    const userTasks = taskTemplates.map((task, idx) => ({
      userId: user._id,
      title: task.title,
      xpReward: task.xpReward,
      estimatedMinutes: task.estimatedMinutes,
      completed: (idx + user.name.length) % 3 === 0 ? !task.completed : task.completed,
      createdAt: hoursAgo(idx * 6 + 2),
    }));
    await Task.insertMany(userTasks);
  }

  const firstName = (index: number): string => users[index % users.length].name.split(' ')[0];
  await Activity.insertMany([
    { userId: users[0]._id, type: ACTIVITY_TYPES.CHAPTER_COMPLETED, message: `${firstName(0)} completed Electrostatics with 92% chapter test score.`, createdAt: hoursAgo(1) },
    { userId: users[1 % users.length]._id, type: ACTIVITY_TYPES.STUDY_SESSION_STARTED, message: `${firstName(1)} started a focused Physics session (Current Electricity).`, createdAt: hoursAgo(2) },
    { userId: users[2 % users.length]._id, type: ACTIVITY_TYPES.RANK_CHANGED, message: `${firstName(2)} crossed 70% overall syllabus and climbed rank.`, createdAt: hoursAgo(3) },
    { userId: users[3 % users.length]._id, type: ACTIVITY_TYPES.STREAK_UPDATED, message: `${firstName(3)} lost streak momentum and restarted from Day 1.`, createdAt: hoursAgo(4) },
    { userId: users[4 % users.length]._id, type: ACTIVITY_TYPES.CHAPTER_COMPLETED, message: `${firstName(4)} completed Surah Al Noor notes and MCQ revision.`, createdAt: hoursAgo(5) },
    { userId: users[5 % users.length]._id, type: ACTIVITY_TYPES.TASK_COMPLETED, message: `${firstName(5)} solved 25 loop-construct questions in C.`, createdAt: hoursAgo(7) },
    { userId: users[6 % users.length]._id, type: ACTIVITY_TYPES.RANK_CHANGED, message: `${firstName(6)} moved up after late-night revision sprint.`, createdAt: hoursAgo(9) },
    { userId: users[7 % users.length]._id, type: ACTIVITY_TYPES.STUDY_SESSION_ENDED, message: `${firstName(7)} logged 95 minutes of Mathematics practice.`, createdAt: hoursAgo(10) },
    { userId: users[0]._id, type: ACTIVITY_TYPES.TASK_COMPLETED, message: `${firstName(0)} finished today’s 2-hour study target.`, createdAt: hoursAgo(12) },
    { userId: users[1 % users.length]._id, type: ACTIVITY_TYPES.RANK_CHANGED, message: `${firstName(1)} is now very close to the top rank.`, createdAt: hoursAgo(14) },
    { userId: users[2 % users.length]._id, type: ACTIVITY_TYPES.CHAPTER_COMPLETED, message: `${firstName(2)} wrapped Integration chapter revision #3.`, createdAt: hoursAgo(18) },
    { userId: users[4 % users.length]._id, type: ACTIVITY_TYPES.STREAK_UPDATED, message: `${firstName(4)} extended streak by another day.`, createdAt: hoursAgo(22) },
    { userId: users[3 % users.length]._id, type: ACTIVITY_TYPES.STUDY_SESSION_STARTED, message: `${firstName(3)} started Pakistan Studies test prep sprint.`, createdAt: hoursAgo(26) },
    { userId: users[5 % users.length]._id, type: ACTIVITY_TYPES.RANK_CHANGED, message: `${firstName(5)} crossed a major XP milestone this week.`, createdAt: hoursAgo(30) },
    { userId: users[6 % users.length]._id, type: ACTIVITY_TYPES.CHAPTER_COMPLETED, message: `${firstName(6)} completed Decision Constructs in C.`, createdAt: hoursAgo(34) },
    { userId: users[7 % users.length]._id, type: ACTIVITY_TYPES.TASK_COMPLETED, message: `${firstName(7)} completed Urdu khulasa writing assignment.`, createdAt: hoursAgo(38) },
  ]);

  console.log('Seed complete: subjects, chapters, users, progress, tasks, and activity feed created.');
}

seedDatabase()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

