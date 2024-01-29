import React from 'react';
import './styles/style.scss';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import Snow from './components/snow';
import Rain from './components/rain';
import Navigation from './components/navigation';
import LocationPopup from './components/locationPopup';
import { useGeolocated } from 'react-geolocated';

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

const hasAllowedLocation = () => {
    return localStorage.getItem('locationAllowed') === 'true';
};

const setAllowedLocation = () => {
    localStorage.setItem('locationAllowed', 'true');
};

const Home = () => {
    const [isSnowing, setIsSnowing] = useState(false);
    const [isRaining, setIsRaining] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => { setHeight(document.documentElement.scrollHeight) });
    useEffect(() => { setWidth(document.body.clientWidth) });

    var date = new Date();

    const calculatedValuesRef = useRef({
        x: 0,
        y: 0,
        startColor: [0, 0, 0],
        endColor: [0, 0, 0],
        angle: 0,
        backgroundGradient: 'linear-gradient(0deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 100%)',
        pageContainerStyle: {
            background: 'linear-gradient(0deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 100%)',
        },
        moonRotationAngle: 0,
    });


    const getUserLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        resolve({ latitude, longitude });
                    },
                    (error) => {
                        console.error('Error getting user location:', error);
                        reject(error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                reject(new Error('Geolocation not supported'));
            }
        });
    };

    const handleModalClose = async () => {
        try {
            const location = await getUserLocation();

            const responseSun = await fetch('https://api.sunrise-sunset.org/json?lat=' + location.latitude + '&lng=' + location.longitude);
            const dataSun = await responseSun.json();

            const responseWeather = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + location.latitude + '&longitude=' + location.longitude + '&current=rain,showers,snowfall&past_days=1&forecast_days=1');
            const dataWeather = await responseWeather.json();
            const { rain, showers, snowfall } = dataWeather.current;

            setIsSnowing(snowfall > 0);
            setIsRaining(rain > 0 || showers > 0);

            const currentHours = date.getHours();
            const currentMinutes = date.getMinutes();
            const totalMinutes = currentHours * 60 + currentMinutes;

            const sunrise = formatTimeToTotalMinutes(dataSun.results.sunrise);
            const sunset = formatTimeToTotalMinutes(dataSun.results.sunset);
            var startColor;
            var endColor;

            const { sunNormalized, moonNormalized } = normalizeTime(totalMinutes, sunrise, sunset, sunset, sunrise);
            const x = sunNormalized + moonNormalized;
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
            ];

            if (totalMinutes >= sunrise && totalMinutes <= sunset) {
                startColor = mapValueToGradient(x, daytimeGradient);
                endColor = mapValueToGradient(x, daytimeGradientEnd);
            } else {
                startColor = mapValueToGradient(x, nighttimeGradient);
                endColor = mapValueToGradient(x, nighttimeGradientEnd);
            }
            const angle = subtractDegrees(x * 180, 90);
            const backgroundGradient = `linear-gradient(${angle}deg, ${startColor} 0%, ${endColor} 100%)`;

            const pageContainerStyle = {
                background: backgroundGradient,
            };

            const moonRotationAngle = getMoonPhaseRotation(new Date());

            calculatedValuesRef.current = {
                x,
                y,
                startColor,
                endColor,
                angle,
                backgroundGradient,
                pageContainerStyle,
                moonRotationAngle,
            };

            setWidth(document.body.clientWidth);
            setHeight(document.documentElement.scrollHeight);
            setAllowedLocation();

            setShowModal(false);
        } catch (error) {
            console.error('Error while getting user location:', error);
        }
    };

    return (
        <>
            {showModal && (
                <div id="static-modal" data-modal-backdrop="static" tabindex="-1" aria-modal="true" role="dialog" class="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div class="relative p-4 w-full max-w-2xl max-h-full">
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div class="flex items-center bg-blue-500/[.06] justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                    Location access required
                                </h3>
                            </div>
                            <div class="bg-blue-500/[.06] p-4 md:p-5 space-y-4">
                                
                                    <h3 class="font-semibold text-slate-100">Why do we need your location?</h3>
                                    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    <b>Sun Position:</b> The position of the sun in the sky depends on your geographical location. By accessing your location, we can accurately render the sun on our website.
                                    </p>
                                    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    <b>Weather Conditions:</b> Knowing your location helps us determine if it's raining or snowing in your area. This information allows us to provide you with relevant weather updates.
                                    </p>
                                    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    <b>Background Adjustment:</b> We customize the background of our website based on the current time in your location. This creates a more immersive experience tailored to your surroundings.
                                    </p>
                                    <h3 class="font-semibold text-slate-100">How we handle your data:</h3>
                                    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    <b>Privacy:</b> Your location data is used solely for the purposes mentioned above. We do not store or share this information with any third parties.
                                    </p>
                                    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    <b>Consent:</b> By clicking "Allow", you consent to sharing your location with us. You can revoke this access at any time in your browser settings.
                                    </p>

                            </div>
                            <div class="bg-blue-500/[.06] flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button data-modal-hide="static-modal" onClick={handleModalClose} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                                <button data-modal-hide="static-modal" type="button" class="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {hasAllowedLocation() && handleModalClose() && <>
                <Snow
                    snowing={isSnowing}
                />
                <Rain
                    isRaining={isRaining}
                />
                <div style={calculatedValuesRef.current.pageContainerStyle} class="page-container grid grid-cols-1 place-items-center w-screen">
                    <Sun
                        x={calculatedValuesRef.current.x}
                        y={calculatedValuesRef.current.y}
                        width={width}
                        totalMinutes={calculatedValuesRef.current.totalMinutes}
                        sunrise={calculatedValuesRef.current.sunrise}
                        sunset={calculatedValuesRef.current.sunset}
                        moonRotationAngle={calculatedValuesRef.current.moonRotationAngle}
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
            </>
            }
            {!hasAllowedLocation() && <>
                <div style={{ background: '#3079d1' }} class="page-container grid grid-cols-1 place-items-center w-screen">
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
            </>
            }
        </>

    );
};
export default Home;