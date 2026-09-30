import Modal from "../common/Modal";
import TeamMemberForm from "./TeamMemberForm";
import { useApp } from "../../context/AppContext";
import { isAdmin } from "../../utils/permissions";

export default function TeamMemberFormModal({ isOpen, onClose, initialData, onSubmit }) {
  const { currentUser } = useApp();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Team Member" : "Add Team Member"}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" form="team-form" className="btn btn-primary">
            {initialData ? "Save Changes" : "Add Member"}
          </button>
        </>
      }
    >
      <TeamMemberForm
        initialData={initialData}
        canSetPassword={true}
        onSubmit={(data) => {
          onSubmit(data);
          onClose();
        }}
      />
    </Modal>
  );
}
