import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import { Users } from "lucide-react";

// Team tab: members assigned to this project and their task counts.
export default function ProjectTeamTab({ team, tasks }) {
  if (team.length === 0) {
    return <EmptyState icon={Users} title="No team members assigned" />;
  }

  return (
    <div className="grid-3">
      {team.map((member) => {
        const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
        const completed = memberTasks.filter((t) => t.status === "Completed").length;
        return (
          <div key={member.id} className="card card-padded">
            <div className="flex-gap">
              <Avatar name={member.name} color={member.avatarColor} size={40} />
              <div>
                <div style={{ fontWeight: 700 }}>{member.name}</div>
                <div className="text-muted text-sm">{member.role}</div>
              </div>
            </div>
            <div className="flex-between mt-16">
              <span className="text-sm text-muted">Assigned Tasks</span>
              <Badge label={`${completed}/${memberTasks.length} done`} variant="badge-blue" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
