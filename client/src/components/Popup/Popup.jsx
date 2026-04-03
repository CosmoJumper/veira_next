import './Popup.css';

function Popup({ title, content, onClose }) {
  return (
    <div className="popup-window">
      <div className="popup">
        <div className="popup-top">
          <h2>{title}</h2>
          <button className="popup-button-close" onClick={onClose}>
            x
          </button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export default Popup;