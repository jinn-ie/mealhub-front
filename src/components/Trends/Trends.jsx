// src/components/SwipeScrollComponent/SwipeScrollComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import useScroll from '../../hooks/useScroll';
import burger from './burger.png';  // 이미지 파일을 import
import bibim from './bibim.png';  // 이미지 파일을 import
import sushi from './sushi.jpg';

const Trends = ({isFixed}) => {
    const containerRef = useRef(null); 
    useScroll(containerRef, "horizontal"); // 가로 스크롤

    useEffect(() => {
        if (isFixed) {
            containerRef.current.classList.add('fixed');
        } else {
            containerRef.current.classList.remove('fixed');
        }
    });

    let [trends, 트렌드변경] = useState(['1위 : 햄버거', '2위 : 초밥', '3위 : 비빔면', '4위 : 떡볶이', '5위 : 피자']);

    return (
        <div ref={containerRef} className="trends fixed">
            <div className="trend">
                <img src={ burger }/>
                <h5>{ trends[0] }</h5>
                <p>3.57점</p>
            </div>
            <div className="trend">
                <img src={ sushi }/>
                <h5>{ trends[1] }</h5>
                <p>3.42점</p>
            </div>
            <div className="trend">
                <img src={ bibim }/>
                <h5>{ trends[2] }</h5>
                <p>3.17점</p>
            </div>
            <div className="trend">
                <img src={ burger }/>
                <h5>{ trends[3] }</h5>
                <p>3.12점</p>
            </div>
            <div className="trend">
                <img src={ burger }/>
                <h5>{ trends[4] }</h5>
                <p>2.98점</p>
            </div>
        </div>
    );
};

export default Trends;
