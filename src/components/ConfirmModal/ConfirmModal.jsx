import './ConfirmModal.css'

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText, isLoading }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title || 'Confirm'}</h3>
        <p className="modal-message">{message || 'Are you sure?'}</p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" onClick={onCancel} disabled={isLoading}>
            {cancelText || 'Cancel'}
          </button>
          <button className="modal-btn modal-btn-confirm" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Processing...' : confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
