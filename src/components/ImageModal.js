import React from 'react';
import Modal from 'react-modal';

const ImageModal = ({ imageUrl, altText, closeModal }) => {
    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust the alpha value for darkness
        },
        content: {
            // Add any other content-specific styles if needed
        },
    };
    return (
        <Modal isOpen={true} onRequestClose={closeModal} style={customStyles} className="image-modal" onClick={closeModal}>
            <img src={imageUrl} alt={altText} className="modal-image" onClick={closeModal} />
        </Modal>
    );
};

export default ImageModal;