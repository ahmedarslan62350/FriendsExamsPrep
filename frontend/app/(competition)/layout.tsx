import { CompetitionShell } from "@/components/competition-shell";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <CompetitionShell>{children}</CompetitionShell>;
}
