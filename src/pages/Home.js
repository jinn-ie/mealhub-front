import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Party from '../components/Party';
import Trends from '../components/Trends/Trends';
import Map from '../components/Map';
import useScroll from '../hooks/useScroll';
import useUserInfo from '../hooks/useUserInfo';
import foodData from '../menu.json';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LoadingOverlay from "../components/LoadingOverlay";

import { fetchPartyCreate, fetchPartyJoin } from '../api/party';

function Home() {
  const containerRef = useRef(null); 
  useScroll(containerRef, "vertical"); // 세로 스크롤

  const [load, setLoad] = useState(false);

  const [code, setCode] = useState("");
  const [participants, setParticipants] = useState(['정종욱', '하천수', '이서진']);
  const [result, setResult] = useState({menu_id: null, menu_name:''});

  const [view, setVie] = useState({
    showParty: 0,
    showRec: false,
    showMap: false,
  });

  const setView = (key, value) => {
    setVie((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const [isHeightChanged, setIsHeightChanged] = useState(false);
  const [isFixed, setIsFixed] = useState(true);

  const loginId = localStorage.getItem("loginId");
  const { userInfo, loading, error } = useUserInfo();
  console.log('hooks', userInfo);

  var latitude = 37.5665;
  var longitude = 126.9780;

  const [userLocation, setUserLocation] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          console.log("위도:", latitude, "경도:", longitude);
          // 서버에 좌표 보내기 등 추가 작업
          setUserLocation({
              lat: latitude,
              lng: longitude
          });
        },
        (error) => {
          console.error("위치 정보를 가져오지 못했습니다.", error);
          // 에러 대응 (예: 사용자에게 알림)
          setUserLocation({
            lat: 37.5665,
            lng: 126.9780
          });
        }
      );
    } else {
      console.error("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      setUserLocation({
        lat: 37.5665,
        lng: 126.9780
      })
    }
  }

  useEffect(() => {
    if (!userLocation) return; // userLocation이 없으면 실행하지 않음
    fetchRecommendation(userLocation.lat, userLocation.lng);
  }, [userLocation]);

  const navigate = useNavigate();

  const fetchRecommendation = (lat, lng) => {
    setLoad(true);

    fetch("https://mealhub.duckdns.org/api/recommend/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat: lat,
        lon: lng,
        timestamp: new Date().toISOString().slice(0,-1),
        user_id: userInfo.id,
      }),
    })
    .then(res => {
      console.log("서버 응답:", res);
      return res.json();
    })
    .then(body => {
      console.log("응답 바디 : ", body);
      setResult({
        menu_id: body.recommendations[0].menu_id,
        menu_name: body.recommendations[0].menu_name
      });
    })
    .then(() => {setView('showRec', true);})
    .then(() => {setLoad(false)})
  }

  const calculateTotalHeight = () => {  // 전체 높이 계산
    if (containerRef.current) {
      const children = Array.from(containerRef.current.children);
      const totalHeight = children.reduce((sum, child) => sum + child.offsetHeight, 0);
      return totalHeight;
    }
  }

  const removeParticipant = (name) => {
    setParticipants((prevParticipants) => 
      prevParticipants.filter((participant) => participant !== name)
    );
  }

  const skipMenu = () => {
    console.log("return?");
    if (!result) return;
    // 불만족 fetch
    console.log("result", result);
    fetch("https://mealhub.duckdns.org/api/feedback/skip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userInfo.id,
        menu_id: result.menu_id,
        timestamp: new Date().toISOString().slice(0, -1),
        lat: userLocation.lat,
        lon: userLocation.lng
      })
    })
    .then(res => {
      console.log("서버 응답 : ", res);
    })

    // 지도 삭제
    setView('showMap', false);

    // 추천 fetch
    fetchRecommendation(userLocation.lat, userLocation.lng);
  }

  useEffect(() => {
    if (calculateTotalHeight() <= window.innerHeight) setIsFixed(true);
    else setIsFixed(false);
    setIsHeightChanged(false);
  }, [isHeightChanged]);

  return (
    <div className="App" ref={containerRef}>
      {load && <LoadingOverlay />}
      <div className="orange-nav">
        <h3 onClick={() => {
          setView('showParty', 0);
          setView('showRec', false);
          setView('showMap', false);
          setIsHeightChanged(true);
        }}>MEALHUB</h3>
        <div className="nav-buttons">
          <button className="nav-btn partybtn" onClick={() => {
            if (view.showParty == 0) {
              setView('showParty', 1);
            } else {
              setView('showParty', 0);
            }
          }}>
            <i className="fa-solid fa-handshake"></i>
          </button>
          <button className="nav-btn like">
            <i className="fa-solid fa-heart"></i>
          </button>
          <button className="nav-btn my" data-user={loginId ? loginId+"님" : "게스트"} onClick={() => {
            if (loginId) {
              navigate("/mypage");
            } else {
              navigate("/login")
            }
          }}>
            <i className="fa-solid fa-user"></i>
          </button>
        </div>
      </div>

      <Party
        showParty={view.showParty}
        setShowParty={(value) => setView('showParty', value)}
        code={code}
        setCode={setCode}
        fetchPartyCreate={fetchPartyCreate}
        fetchPartyJoin={fetchPartyJoin}
      />
      
      {!view.showRec && (
        <div className="rec">
          <h2>오늘 뭐 먹지?</h2>
          <p className="rec-subtitle">배고픈 당신을 위한 메뉴 추천</p>
          <button className='create-rec' onClick={() => {
            if (!userInfo) {
              alert("유저 정보를 불러오는 중입니다...");
            } else {
              getLocation();
            }
          }}>
            <i className="fa-solid fa-utensils"></i> 추천 받기
          </button>
        </div>
      )}

      {view.showRec && (
        <div className="recommendation-container">
          <h2>오늘의 추천 메뉴</h2>
          <div className="menu-name">{ result.menu_name }</div>
          <div className="food-image-container">
            <img className='res-img' src={ foodData[result.menu_name].url } alt={result.menu_name} />
          </div>
          <div className='buttons'>
            <button className="show-map" disabled={!userInfo} onClick={() => {
              setView('showMap', true);
              setIsHeightChanged(true);
            }}>
              <i className="fa-solid fa-map-location-dot"></i> 주변 식당 찾기
            </button>
            <button className="reload" disabled={!userInfo} onClick={() => {
              skipMenu();
              setIsHeightChanged(true);
            }}>
              <i className="fa-solid fa-arrow-rotate-right"></i> 다른 메뉴 추천
            </button>
          </div>
        </div>
      )}

      {view.showMap && (
        <div className="map-wrap">
          <Map lat={userLocation.lat} lng={userLocation.lng} kw={result}/>
        </div>
      )}

      {view.showMap && (
        <Trends lat={userLocation.lat} lng={userLocation.lng}/>
      )}
    </div>
  );
}

export default Home;