import React from 'react';

const Card = ({ id, title, content }) => {
    return (
        <div className="card md:justify-center w-3/4 md:w-2/4 mb-20 p-5 rounded shadow-md" id={id}>
            <p className="text-5xl mb-5">{title}</p>
            <p>{content}</p>

        </div>
    );
};

export default Card;