import React from 'react';
import 'react-responsive-modal/styles.css';
import "react-image-gallery/styles/css/image-gallery.css";

const Project = ({ src, desc, title, content }) => {

    return (
        <>
            <div className="rounded shadow-md">
                <img src={src} alt="Preview" class="h-auto max-w-xs mr-2 inline-block rounded"></img>
                <div class="inline-block">
                    <p class="text-3xl mb-3 ">{title}</p>
                    {desc} <br></br>
                    {content}
                    
                </div>

            </div>

        </>

    );
};

export default Project;