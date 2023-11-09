import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const toggleMobileMenu = () => {
    const navbar = document.getElementById('navbar-default');
    navbar.classList.toggle('hidden');
};

const Navigation = () => {
    return (
        <nav class="bg-white border-gray-200 dark:bg-gray-900">
            <div class="w-screen flex flex-wrap items-center justify-center mx-auto p-4">
                <button
                    data-collapse-toggle="navbar-default"
                    type="button"
                    class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-default"
                    aria-expanded="false"
                    onClick={toggleMobileMenu}
                >
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div class="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <a href="#about" class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">About</a>
                        </li>
                        <li>
                            <a href="#projects" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Projects</a>
                        </li>
                        <li>
                            <a href="#experience" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Experience</a>
                        </li>
                        <li>
                            <a href="#contact" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

const Title = () => {
    return (
        <div class="grid md:justify-center w-3/4 md:w-screen my-20">
            <div class="group">
                <p class="text-white text-7xl group-hover:text-blue-500">Hello, my name is <span class="text-blue-500 group-hover:text-white">Dovydas</span>! <br></br></p>
                <p class="text-white text-xl group-hover:text-blue-500">I am a passionate web developer that loves learning new things.</p>
            </div>
        </div>
    )
}

const Card = ({ id, title, content }) => {
    return (
        <div className="md:justify-center w-3/4 md:w-2/4 mb-20 bg-gray-900/50 p-5 rounded shadow-md" id={id}>
            <p className="text-white text-5xl mb-5">{title}</p>
            <p className="text-white">{content}</p>
        </div>
    );
};

const Website = () => {
    return (
        <div class="grid grid-cols-1 place-items-center w-screen bg-gray-800">
            <Navigation />
            <Title />
            <Card
                id="about"
                title="About"
                content="Welcome to my website! I specialize in building modern websites. My fascination with technology began at a young age, that's why I am always looking to learn new things. As a curious problem solver, I thrive diving into the intricacies of code, hardware and networking, always seeking for new challenges."
            />
            <Card
                id="projects"
                title="Projects"
                content={<p>I currently have two public projects. First of them is a gambling website, which allows live communication using socket.io. The second one is a banking website which includes an easy way of payments, deposits and withdrawals. These projects were built using Flask, socket.io, Nginx, Gunicorn and MySQL. You can find them on my <a class="text-blue-500 hover:text-blue-700" target="_blank" href="https://github.com/dovy2kas">github</a>.</p>}
            />

            <Card
                id="experience"
                title="Experience"
                content="Sadly, none yet."
            />

            <Card
                id="contact"
                title="Contant"
                content="You can shoot an email at contact@dovydas.tech"
            />
        </div>
    );
};

export default Website;

root.render(<Website />);