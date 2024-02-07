import React from 'react';
import './styles/style.scss';
import { useState } from 'react';
import Snow from './components/snow';
import Rain from './components/rain';
import Navigation from './components/navigation';
import 'react-multi-carousel/lib/styles.css';
import Project from './components/project';
import SunCalc from 'suncalc';
import transacto_preview from './img/transacto/landing.jpg';
import transacto_dashboard from './img/transacto/dashboard.jpg';
import transacto_deposit from './img/transacto/deposit.jpg';
import transacto_profile from './img/transacto/profile.jpg';
import transacto_login from './img/transacto/login.jpg';
import gambtopia_preview from './img/gambtopia/roulette.jpg';
import gambtopia_crash from './img/gambtopia/crash.jpg';
import gambtopia_login from './img/gambtopia/login.jpg';
import gambtopia_register from './img/gambtopia/register.jpg'
const Carousel = React.lazy(() => import('react-multi-carousel'));
const ProjectModal = React.lazy(() => import('./components/projectModal'))

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 1
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const transacto_images = [
    {
        original: transacto_preview,
        originalAlt: "transacto landing",
        thumbnail: transacto_preview,
        thumbnailAlt: "transacto landing thumbnail"
    },
    {
        original: transacto_dashboard,
        originalAlt: "transacto dashboard",
        thumbnail: transacto_dashboard,
        thumbnailAlt: "transacto dashboard thumbnail"
    },
    {
        original: transacto_profile,
        originalAlt: "transacto profile",
        thumbnail: transacto_profile,
        thumbnailAlt: "transacto profile thumbnail"
    },
    {
        original: transacto_deposit,
        originalAlt: "transacto deposit",
        thumbnail: transacto_deposit,
        thumbnailAlt: "transacto deposit thumbnail"
    },
    {
        original: transacto_login,
        originalAlt: "transacto login",
        thumbnail: transacto_login,
        thumbnailAlt: "transacto login thumbnail"
    }
];

const gambtopia_images = [
    {
        original: gambtopia_preview,
        originalAlt: "gambtopia roulette",
        thumbnail: gambtopia_preview,
        thumbnailAlt: "gambtopia roulette thumbnail"
    },
    {
        original: gambtopia_crash,
        originalAlt: "gambtopia crash",
        thumbnail: gambtopia_crash,
        thumbnailAlt: "gambtopia crash thumbnail"
    },
    {
        original: gambtopia_login,
        originalAlt: "gambtopia login",
        thumbnail: gambtopia_login,
        thumbnailAlt: "gambtopia login thumbnail"
    },
    {
        original: gambtopia_register,
        originalAlt: "gambtopia register",
        thumbnail: gambtopia_register,
        thumbnailAlt: "gambtopia register thumbnail"
    }
];

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

function generateParabolaInRange(input, height = document.documentElement.scrollHeight / 2) {
    const mappedX = input * 2 - 1;

    const y = height * (1 - mappedX ** 2);

    return Math.max(0, Math.min(height, y));
}

const getMoonPhaseRotation = date => {
    const cycleLength = 29.5

    const knownNewMoon = new Date('2022-03-02 18:34:00')
    const secondsSinceKnownNewMoon = (date - knownNewMoon) / 1000
    const daysSinceKnownNewMoon = secondsSinceKnownNewMoon / 60 / 60 / 24
    const currentMoonPhasePercentage = (daysSinceKnownNewMoon % cycleLength) / cycleLength

    return 360 - Math.floor(currentMoonPhasePercentage * 360)
}

const Sun = ({ x, y, totalMinutes, sunrise, sunset, moonRotationAngle }) => {
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
        console.log("Sun")
        return <i className="fa-solid fa-sun sun" style={styles}></i>;
    } else {
        console.log("Moon")
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

const Home = () => {
    const [isSnowing, setIsSnowing] = useState(false);
    const [isRaining, setIsRaining] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showTransactoModal, setShowTransactoModal] = useState(false);
    const [showGambtopiaModal, setShowGambtopiaModal] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    var date = new Date();
    const [calculatedValues, setCalculatedValues] = useState();

    const getUserLocation = (locationAccepted = false) => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
                    if (!locationAccepted && permissionStatus.state === 'prompt') {
                        // Return before getCurrentPosition, to not show location prompt, before user location accept
                        return setShowModal(true)
                    }

                    if (showModal) {
                        setShowModal(false)
                    }

                    setShowLoader(locationAccepted || permissionStatus.state === 'granted')

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
                })
            } else {
                console.error('Geolocation is not supported by this browser.');
                reject(new Error('Geolocation not supported'));
            }
        });
    };

    const calculateValues = async (locationAccepted) => {
        try {
            setShowLoader(locationAccepted)
            const location = await getUserLocation(locationAccepted);

            const currentDate = new Date();
            const times = SunCalc.getTimes(currentDate, location.latitude, location.longitude);
            const sunrise = times.sunrise.getHours() * 60 + times.sunrise.getMinutes();
            const sunset = times.sunset.getHours() * 60 + times.sunset.getMinutes();


            const responseWeather = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + location.latitude + '&longitude=' + location.longitude + '&current=rain,showers,snowfall&past_days=1&forecast_days=1');
            const dataWeather = await responseWeather.json();
            const { rain, showers, snowfall } = dataWeather.current;

            setIsSnowing(snowfall > 0);
            setIsRaining(rain > 0 || showers > 0);

            const currentHours = date.getHours();
            const currentMinutes = date.getMinutes();
            const totalMinutes = currentHours * 60 + currentMinutes;

            var startColor;
            var endColor;

            const { sunNormalized, moonNormalized } = normalizeTime(totalMinutes, sunrise, sunset, sunset, sunrise);
            const x = sunNormalized + moonNormalized;
            const y = generateParabolaInRange(x);

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
            const pageBackground = `linear-gradient(${angle}deg, ${startColor} 0%, ${endColor} 100%)`;

            const moonRotationAngle = getMoonPhaseRotation(new Date());

            setCalculatedValues({
                x,
                y,
                startColor,
                endColor,
                angle,
                pageBackground,
                moonRotationAngle,
                totalMinutes,
                sunrise,
                sunset
            })

        } catch (error) {
            console.error('Error while getting user location:', error);
        }
    };

    useState(() => {
        calculateValues()
    })

    return (
        <>
            {!calculatedValues && showLoader}
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
                                <button onClick={() => calculateValues(true)} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                                <button onClick={() => setShowModal(false)} type="button" class="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showTransactoModal && (
                <React.Suspense fallback={<div>Loading...</div>}>
                    <ProjectModal
                        title="Banking website"
                        content={<p class="text-base leading-relaxes text-gray-100">This is a simple banking website which allows it's users to send and receive, as well as deposit and withdraw funds. This project was made using flask-socketio, nginx, gunicorn and a MySQL database.</p>}
                        images={transacto_images}
                        action={() => setShowTransactoModal(false)}
                    />
                </React.Suspense>
            )}
            {showGambtopiaModal && (
                <React.Suspense fallback={<div>Loading...</div>}>
                    <ProjectModal
                        title="Gambling website"
                        content={<p class="text-base leading-relaxes text-gray-100">This is a gambling website which has two modes: roulette and crash. While building it I learned how to transfer live data, verify the user actions and prove that bets were fail using cryptography. This project was made using flask-socketio, nginx, gunicorn, MySQL and ReCaptcha.</p>}
                        images={gambtopia_images}
                        action={() => setShowGambtopiaModal(false)}
                    />
                </React.Suspense>
            )}

            {/* Can be here, because if bool false, returns null, bool true only set if calculatedValues exist (location granted) */}
            <Snow snowing={isSnowing} />
            <Rain isRaining={isRaining} />

            <div style={{ background: calculatedValues?.pageBackground ?? '#3079d1' }} class="page-container grid grid-cols-1 place-items-center w-screen">
                {!!calculatedValues && (
                    <Sun
                        x={calculatedValues.x}
                        y={calculatedValues.y}
                        totalMinutes={calculatedValues.totalMinutes}
                        sunrise={calculatedValues.sunrise}
                        sunset={calculatedValues.sunset}
                        moonRotationAngle={calculatedValues.moonRotationAngle}
                    />
                )}
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
                    content=
                    {
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <Carousel responsive={responsive}>
                                <Project
                                    src={transacto_preview}
                                    desc="A simble banking website that allows deposits and withdrawals."
                                    title="Banking website"
                                    content={<button type="button" onClick={() => setShowTransactoModal(true)} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Read more</button>}
                                />
                                <Project
                                    src={gambtopia_preview}
                                    desc="A gambling website with a provably fair system."
                                    title="Gambling website"
                                    content={<button type="button" onClick={() => setShowGambtopiaModal(true)} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Read more</button>}
                                />
                            </Carousel>
                        </React.Suspense>

                    }

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

    );
};
export default Home;