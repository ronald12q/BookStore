import { Modal } from "@heroui/react";
import type { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ModalComponent = ({ isOpen, children, onOpenChange }: ModalProps) => {
  return (
    // isOpen and onOpenChange belong on the root Modal,
    // which is the component that actually controls state.
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="p-0 bg-transparent shadow-none border-none max-w-fit">
            <Modal.CloseTrigger />
            <Modal.Body className="p-0">
              {children}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
