import {
  BookOpen,
  BrainCircuit,
  Calculator,
  FileText,
  Globe2,
  Languages,
  MonitorSmartphone,
} from "lucide-react";

import { type SubjectMeta } from "@/lib/types";

const SUBJECT_META: Record<string, SubjectMeta> = {
  physics: { slug: "physics", icon: BrainCircuit },
  computer: { slug: "computer", icon: MonitorSmartphone },
  "computer-science": { slug: "computer-science", icon: MonitorSmartphone },
  math: { slug: "math", icon: Calculator },
  mathematics: { slug: "mathematics", icon: Calculator },
  english: { slug: "english", icon: Languages },
  urdu: { slug: "urdu", icon: FileText },
  "tarjuma-tul-quran": { slug: "tarjuma-tul-quran", icon: BookOpen },
  "pak-studies": { slug: "pak-studies", icon: Globe2 },
  pakistanstudies: { slug: "pakistanstudies", icon: Globe2 },
};

export function slugifySubject(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getSubjectMeta(name: string): SubjectMeta {
  const slug = slugifySubject(name);
  return SUBJECT_META[slug] ?? { slug, icon: FileText };
}
