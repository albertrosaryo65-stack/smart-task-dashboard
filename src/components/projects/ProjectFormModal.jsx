import Modal from "../common/Modal";
import ProjectForm from "./ProjectForm";

export default function ProjectFormModal({ isOpen, onClose, initialData, onSubmit }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Project" : "Create Project"}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" form="project-form" className="btn btn-primary">
            {initialData ? "Save Changes" : "Create Project"}
          </button>
        </>
      }
    >
      <ProjectForm
        initialData={initialData}
        onSubmit={(data) => {
          onSubmit(data);
          onClose();
        }}
      />
    </Modal>
  );
}
