import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import './style.scss';
import { useState, useEffect } from 'react';
import moment from 'moment';
import Snow from './components/snow';
import Rain from './components/rain';

const root = ReactDOM.createRoot(document.getElementById('root'));

const toggleMobileMenu = () => {
    const navbar = document.getElementById('navbar-default');
    navbar.classList.toggle('hidden');
};

function normalizeTime(currentTime, sunriseTime, sunsetTime, moonriseTime, moonsetTime) {
    const calculateDuration = (start, end) => {
        if (start < end) return end - start;
        return 24 * 60 - (start - end);
    };

    const calculateCurrentDuration = (current, start, end) => {
        if (start < end) return (current >= start && current <= end) ? current - start : 0;
        return (current >= start || current <= end) ? (current >= start) ? current - start : 24 * 60 - (start - current) : 0;
    };

    const sunTotalDuration = calculateDuration(sunriseTime, sunsetTime);
    const sunCurrentDuration = calculateCurrentDuration(currentTime, sunriseTime, sunsetTime);
    const moonTotalDuration = calculateDuration(moonriseTime, moonsetTime);
    const moonCurrentDuration = calculateCurrentDuration(currentTime, moonriseTime, moonsetTime);

    const sunNormalized = (sunCurrentDuration / sunTotalDuration >= 0 && sunCurrentDuration / sunTotalDuration <= 1)
        ? sunCurrentDuration / sunTotalDuration
        : (sunCurrentDuration / sunTotalDuration < 0)
            ? 0
            : 1;

    const moonNormalized = (moonCurrentDuration / moonTotalDuration >= 0 && moonCurrentDuration / moonTotalDuration <= 1)
        ? moonCurrentDuration / moonTotalDuration
        : (moonCurrentDuration / moonTotalDuration < 0)
            ? 0
            : 1;

    return { sunNormalized, moonNormalized };
}

function subtractDegrees(initialDegree, degreesToSubtract) {
    let result = initialDegree - degreesToSubtract;

    result = (result % 360 + 360) % 360;

    return result;
}

function generateParabolaInRange(input, height) {
    const mappedX = input * 2 - 1;

    const y = height * (1 - mappedX ** 2);

    return Math.max(0, Math.min(height, y));
}

const formatTimeToTotalMinutes = (timeString) => {
    const timeFormat = 'h:mm A';
    const date = moment(timeString, timeFormat);

    if (date.isValid()) {
        const totalMinutes = (date.hours() + 2) * 60 + date.minutes();
        return totalMinutes;
    } else {
        return 'Invalid Date';
    }
};

const getMoonPhaseRotation = date => {
    const cycleLength = 29.5

    const knownNewMoon = new Date('2022-03-02 18:34:00')
    const secondsSinceKnownNewMoon = (date - knownNewMoon) / 1000
    const daysSinceKnownNewMoon = secondsSinceKnownNewMoon / 60 / 60 / 24
    const currentMoonPhasePercentage = (daysSinceKnownNewMoon % cycleLength) / cycleLength

    return 360 - Math.floor(currentMoonPhasePercentage * 360)
}

const Sun = ({ x, y, width, totalMinutes, sunrise, sunset, moonRotationAngle }) => {
    var leftbg;
    var rightbg;

    const dividerRotation = {
        transform: `rotate3d(0, 1, 0, ${moonRotationAngle}deg)`
    }


    if (moonRotationAngle < 180) {
        leftbg = {
            backgroundColor: '#c7cbd0'
        }
        rightbg = {
            backgroundColor: '#9098a1'
        }
    } else {
        leftbg = {
            backgroundColor: '#9098a1'
        }
        rightbg = {
            backgroundColor: '#c7cbd0'
        }
    }

    const styles = {
        position: 'absolute',
        left: `${x * 100}%`,
        transform: `translateY(calc(${-y}px + 15vh))`,
    };

    if (totalMinutes >= sunrise && totalMinutes <= sunset) {
        return <i className="fa-solid fa-sun sun" style={styles}></i>;
    } else {
        return (
            <div class="moon" style={styles}>
                <div class="hemisphere" style={leftbg}></div>
                <div class="hemisphere" style={rightbg}></div>
                <div class="divider" style={dividerRotation}></div>
            </div>
        );
    }

};

const Navigation = () => {
    return (
        <nav class="border-gray-200 dark:bg-black dark:bg-opacity-20">
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
                    <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-black dark:bg-opacity-0 dark:border-gray-700">
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
                <p class="text-white text-7xl ">Hello, my name is <span class="text-blue-500">Dovydas</span>! <br></br></p>
                <p class="text-white text-xl ">I am a passionate web developer that loves learning new things.</p>
            </div>
        </div>
    )
}

const Card = ({ id, title, content }) => {
    return (
        <div className="card md:justify-center w-3/4 md:w-2/4 mb-20 p-5 rounded shadow-md" id={id}>
            <p className="text-5xl mb-5">{title}</p>
            <p>{content}</p>

        </div>
    );
};

function mapValueToGradient(value, gradientColors) {
    const gradientLength = gradientColors.length - 1;
    const colorIndex = value * gradientLength;
    const startIndex = Math.floor(colorIndex);
    const endIndex = Math.min(startIndex + 1, gradientLength);

    const startColor = gradientColors[startIndex] || gradientColors[0];
    const endColor = gradientColors[endIndex] || gradientColors[gradientLength];
    const mixFactor = colorIndex - startIndex;

    const interpolatedColor = (color1, color2, mix) => {
        const result = [];
        for (let i = 0; i < 3; i++) {
            result.push(Math.round(color1[i] * (1 - mix) + color2[i] * mix));
        }
        return result;
    };

    return `rgb(${interpolatedColor(startColor, endColor, mixFactor).join(',')})`;
}

const Website = () => {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    useEffect(() => { setHeight(document.documentElement.scrollHeight) });
    useEffect(() => { setWidth(document.body.clientWidth) });
    var date = new Date();

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('https://api.sunrise-sunset.org/json?lat=54.90130&lng=23.90323')
            .then((response) => response.json())
            .then((data) => {
                setPosts(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    const sunrise = posts.results && formatTimeToTotalMinutes(posts.results.sunrise);
    const sunset = posts.results && formatTimeToTotalMinutes(posts.results.sunset);
    var startColor;
    var endColor;

    const currentHours = date.getHours();
    const currentMinutes = date.getMinutes();
    const totalMinutes = currentHours * 60 + currentMinutes;
    //const totalMinutes = 731;

    const { sunNormalized, moonNormalized } = normalizeTime(totalMinutes, sunrise, sunset, sunset, sunrise);
    const x = sunNormalized + moonNormalized;

    const [isSnowing, setIsSnowing] = useState(false);
    const [isRaining, setIsRaining] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=56.3176&longitude=22.3463&current=rain,showers,snowfall&past_days=1&forecast_days=1');
                const data = await response.json();
                const { rain, showers, snowfall } = data.current;
                setIsSnowing(snowfall > 0);
                setIsRaining(rain > 0 || showers > 0);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchData();
    }, []);


    const y = generateParabolaInRange(x, height / 2);

    const daytimeGradientEnd = [
        [156, 189, 187],
        [125, 184, 255],
        [205, 155, 137]
    ];

    const daytimeGradient = [
        [132, 179, 176],
        [55, 123, 204],
        [173, 113, 92]
    ];

    const nighttimeGradient = [
        [0, 37, 81],
        [0, 0, 0],
        [0, 37, 81]
    ];
    const nighttimeGradientEnd = [
        [48, 121, 209],
        [0, 32, 71],
        [48, 121, 209]
    ]

    if (totalMinutes >= sunrise && totalMinutes <= sunset) {
        startColor = mapValueToGradient(x, daytimeGradient);
        endColor = mapValueToGradient(x, daytimeGradientEnd);
    } else {
        startColor = mapValueToGradient(x, nighttimeGradient);
        endColor = mapValueToGradient(x, nighttimeGradientEnd);
    }

    const angle = subtractDegrees(x * 180, 90)
    var backgroundGradient = `linear-gradient(${angle}deg, ${startColor} 0%, ${endColor} 100%)`;

    const pageContainerStyle = {
        background: backgroundGradient,
    };

    const moonRotationAngle = getMoonPhaseRotation(new Date());

    return (
        <div>
            <Snow
                snowing={isSnowing}
            />
            <Rain
                isRaining={isRaining}
            />

            <div style={pageContainerStyle} class="page-container grid grid-cols-1 place-items-center w-screen">

                <Sun
                    x={x}
                    y={y}
                    width={width}
                    totalMinutes={totalMinutes}
                    sunrise={sunrise}
                    sunset={sunset}
                    moonRotationAngle={moonRotationAngle}
                />
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
                    content={<p>I currently have two public projects. First of them is a gambling website, which allows live communication using socket.io. The second one is a banking website which includes an easy way of payments, deposits and withdrawals. These projects were built using Flask, socket.io, Nginx, Gunicorn and MySQL. You can find them on my <a class="text-blue-500 hover:text-blue-700" target="_blank" rel="noreferrer" href="https://github.com/dovy2kas">github</a>.</p>}
                />

                <Card
                    id="experience"
                    title="Experience"
                    content="Sadly, none yet."
                />

                <Card
                    id="contact"
                    title="Contact"
                    content="You can shoot an email at contact@dovydas.tech"
                />
            </div>
        </div>

    );
};

root.render(<Website />);