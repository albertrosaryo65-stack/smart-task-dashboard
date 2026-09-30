const PRIORITY_ORDER = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

// Applies search/status/priority/project filters and sorting to a task list.
// Shared between the Tasks page and the Project Details "Tasks" tab.
export function filterAndSortTasks(tasks, filters) {
  const search = filters.search.trim().toLowerCase();

  let result = tasks.filter((task) => {
    if (search && !task.title.toLowerCase().includes(search)) return false;
    if (filters.status.length > 0 && !filters.status.includes(task.status)) return false;
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
    if (filters.projectId.length > 0 && !filters.projectId.includes(task.projectId)) return false;
    return true;
  });

  result = [...result].sort((a, b) => {
    if (filters.sort === "priority") {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }
    if (filters.sort === "title") {
      return a.title.localeCompare(b.title);
    }
    // default: dueDate, tasks without a due date go last
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return result;
}

export const defaultTaskFilters = {
  search: "",
  status: [],
  priority: [],
  projectId: [],
  sort: "dueDate",
};
