export const Modal: React.FC<{
    content: React.ReactNode;
    onClose: () => void;
}> = ({
    content,
    onClose,
}) =>
{
    if (!content) {
        return null;
    }

    return (
        <div className="modal-background" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <label className="modal-close" onClick={onClose}>✕</label>
                {/* We stop propagation to prevent the modal from closing when its content is clicked */}
                {content}
            </div>
        </div>
    );
};
