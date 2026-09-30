import Modal from "../common/Modal";
import TaskForm from "./TaskForm";

// Wraps TaskForm in a Modal for create/edit flows.
export default function TaskFormModal({ isOpen, onClose, initialData, defaultProjectId, onSubmit }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Task" : "Create Task"}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" form="task-form" className="btn btn-primary">
            {initialData ? "Save Changes" : "Create Task"}
          </button>
        </>
      }
    >
      <TaskForm
        initialData={initialData}
        defaultProjectId={defaultProjectId}
        onSubmit={(data) => {
          onSubmit(data);
          onClose();
        }}
      />
    </Modal>
  );
}
