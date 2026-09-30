import { useState, useMemo } from "react";
import { Plus, Search, FolderKanban } from "lucide-react";
import { useApp } from "../context/AppContext";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectFormModal from "../components/projects/ProjectFormModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Loading from "../components/common/Loading";
import { PROJECT_STATUS_LIST } from "../utils/constants";
import { canManageProjects, visibleProjects as scopeProjects } from "../utils/permissions";

export default function Projects() {
  const { projects: allProjects, currentUser, addProject, editProject, removeProject, isLoading } = useApp();
  const canManage = canManageProjects(currentUser);
  const projects = scopeProjects(currentUser, allProjects);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("endDate");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  const visibleProjects = useMemo(() => {
    let result = projects.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      return true;
    });
    result = [...result].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "priority") {
        const order = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
        return order[a.priority] - order[b.priority];
      }
      return new Date(a.endDate || 0) - new Date(b.endDate || 0);
    });
    return result;
  }, [projects, search, statusFilter, sort]);

  if (isLoading) return <Loading />;

  function openCreate() {
    setEditingProject(null);
    setFormOpen(true);
  }
  function openEdit(project) {
    setEditingProject(project);
    setFormOpen(true);
  }
  function handleSubmit(data) {
    if (editingProject) {
      editProject(editingProject.id, data);
    } else {
      addProject(data);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage all your projects in one place.</p>
        </div>
        {canManage && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> New Project
            </button>
          </div>
        )}
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {PROJECT_STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="endDate">Sort: Due Date</option>
          <option value="name">Sort: Name (A-Z)</option>
          <option value="priority">Sort: Priority</option>
        </select>
      </div>

      {visibleProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description={canManage ? "Try adjusting your search or create a new project." : "Try adjusting your search."}
          action={
            canManage && (
              <button className="btn btn-primary btn-sm" onClick={openCreate}>
                <Plus size={14} /> New Project
              </button>
            )
          }
        />
      ) : (
        <div className="project-grid">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={canManage ? openEdit : undefined}
              onDelete={canManage ? setDeletingProject : undefined}
            />
          ))}
        </div>
      )}

      <ProjectFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={editingProject}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={() => removeProject(deletingProject.id)}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.name}"? All related tasks will also be deleted.`}
      />
    </div>
  );
}
