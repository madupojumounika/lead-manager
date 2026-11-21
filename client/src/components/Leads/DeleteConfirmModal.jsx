import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

export const DeleteConfirmModal = ({
  isOpen,
  lead,
  onClose,
  onConfirm,
  isDeleting = false
}) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container delete-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="delete-modal-icon-wrapper">
          <AlertTriangle size={24} />
        </div>

        <div className="delete-modal-content">
          <h2 id="delete-dialog-title" className="delete-modal-title">
            Delete Lead?
          </h2>
          <p className="delete-modal-text">
            Are you sure you want to permanently remove <strong>{lead.name}</strong> (
            <em>{lead.company}</em>)? This action will remove all associated contact and status records and cannot be undone.
          </p>
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="danger-btn"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="spin-icon" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
