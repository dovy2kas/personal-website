import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './components/navigation';
import './styles/blog.scss';

const Blog = () => {
    return (
        <div>
            <Navigation />
            <div class="container break-words px-5 mx-auto mt-5 mb-5">

                <h1 className='title text-4xl font-semibold mb-5' >Cybersecurity ventures</h1>
                <ul>
                    <li class="text-center"> <Link class="url font-semibold text-xl tracking-wide" to="/blog/ktu">How I hacked KTU</Link></li>
                </ul>
            </div>
        </div>

    );
};
export default Blog;