import React from 'react';

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

export default Sun;