import { useState } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import TaskTable from "../components/tasks/TaskTable";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskFormModal from "../components/tasks/TaskFormModal";
import TaskDetailModal from "../components/tasks/TaskDetailModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Loading from "../components/common/Loading";
import { filterAndSortTasks, defaultTaskFilters } from "../utils/taskFilterUtils";
import { visibleTasks as scopeTasks, isAdmin } from "../utils/permissions";

export default function Tasks() {
  const { tasks: allTasks, currentUser, addTask, editTask, removeTask, isLoading } = useApp();
  const [filters, setFilters] = useState(defaultTaskFilters);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  if (isLoading) return <Loading />;

  const tasks = scopeTasks(currentUser, allTasks);
  const visibleTasks = filterAndSortTasks(tasks, filters);

  function openCreate() {
    setEditingTask(null);
    setFormOpen(true);
  }
  function openEdit(task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function handleSubmit(data) {
    if (editingTask) {
      editTask(editingTask.id, data);
    } else {
      addTask(data);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">
            {isAdmin(currentUser)
              ? "Manage and track every task across your projects."
              : "Manage and track the tasks assigned to you."}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      <TaskFilters filters={filters} setFilters={setFilters} />

      <div className="card">
        <TaskTable
          tasks={visibleTasks}
          onView={setViewingTask}
          onEdit={openEdit}
          onDelete={setDeletingTask}
        />
      </div>

      <TaskFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={editingTask}
        onSubmit={handleSubmit}
      />

      <TaskDetailModal
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        task={viewingTask}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={() => removeTask(deletingTask.id)}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This cannot be undone.`}
      />
    </div>
  );
}
