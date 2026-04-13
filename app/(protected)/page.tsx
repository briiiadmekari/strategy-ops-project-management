import { ConstructionIcon } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-32">
      <ConstructionIcon className="size-12 text-muted-foreground" />
      <h1 className="text-2xl font-semibold tracking-tight">Coming Soon</h1>
      <p className="text-sm text-muted-foreground">
        The dashboard is under construction. Check back later.
      </p>
    </div>
  );
}
