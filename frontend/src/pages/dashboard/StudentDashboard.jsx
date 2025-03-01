import { StatCard } from "@/components/ui/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Key, Bike, Clock, CalendarClock } from "lucide-react";

const StudentDashboard = () => {
  // TODO: Get student role (CR/Non-CR) from auth context
  const isCR = true;

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {isCR ? "CR Dashboard" : "Student Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          {isCR
            ? "Manage classroom keys and cycles for your class."
            : "Book cycles and track your activities."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isCR && (
          <StatCard
            title="Active Keys"
            value="3"
            icon={<Key className="h-8 w-8" />}
          />
        )}
        <StatCard
          title="Available Cycles"
          value="15"
          icon={<Bike className="h-8 w-8" />}
        />
        <StatCard
          title="Active Bookings"
          value="2"
          icon={<Clock className="h-8 w-8" />}
        />
        <StatCard
          title="Upcoming Returns"
          value="1"
          icon={<CalendarClock className="h-8 w-8" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  );
};

export default StudentDashboard;