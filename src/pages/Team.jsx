import { useState, useMemo } from "react";
import { Plus, Search, Users } from "lucide-react";
import { useApp } from "../context/AppContext";
import TeamMemberCard from "../components/team/TeamMemberCard";
import TeamMemberFormModal from "../components/team/TeamMemberFormModal";
import TeamMemberDetailModal from "../components/team/TeamMemberDetailModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Loading from "../components/common/Loading";
import { TEAM_ROLES } from "../utils/constants";
import { canManageTeam, visibleTeamMembers } from "../utils/permissions";

export default function Team() {
  const { users: allUsers, projects, currentUser, addUser, editUser, removeUser, isLoading } = useApp();
  const canManage = canManageTeam(currentUser);
  const scopedUsers = visibleTeamMembers(currentUser, allUsers, projects);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);

  const visibleUsers = useMemo(() => {
    return scopedUsers.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (roleFilter && u.role !== roleFilter) return false;
      return true;
    });
  }, [scopedUsers, search, roleFilter]);

  if (isLoading) return <Loading />;

  function openCreate() {
    setEditingMember(null);
    setFormOpen(true);
  }
  function openEdit(member) {
    setEditingMember(member);
    setFormOpen(true);
  }
  function handleSubmit(data) {
    if (editingMember) {
      editUser(editingMember.id, data);
    } else {
      addUser(data);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-subtitle">View and manage your team members.</p>
        </div>
        {canManage && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> Add Member
            </button>
          </div>
        )}
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          {TEAM_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {visibleUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members found"
          description={canManage ? "Try adjusting your search or add a new member." : "Try adjusting your search."}
        />
      ) : (
        <div className="grid-3">
          {visibleUsers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={canManage ? openEdit : undefined}
              onDelete={canManage ? setDeletingMember : undefined}
              onView={setViewingMember}
            />
          ))}
        </div>
      )}

      <TeamMemberFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={editingMember}
        onSubmit={handleSubmit}
      />
      <TeamMemberDetailModal
        isOpen={!!viewingMember}
        onClose={() => setViewingMember(null)}
        member={viewingMember}
      />
      <ConfirmDialog
        isOpen={!!deletingMember}
        onClose={() => setDeletingMember(null)}
        onConfirm={() => removeUser(deletingMember.id)}
        title="Remove Team Member"
        message={`Are you sure you want to remove "${deletingMember?.name}" from the team?`}
      />
    </div>
  );
}
