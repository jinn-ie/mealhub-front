import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import Party from '../components/Party';
import Trends from '../components/Trends/Trends';
import Map from '../components/Map';
import Header from '../components/Header';
import FoodRecommendation from '../components/FoodRecommendation';
import LoadingOverlay from "../components/LoadingOverlay";

import useScroll from '../hooks/useScroll';
import useUserInfo from '../hooks/useUserInfo';
import foodData from '../menu.json';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { fetchPartyCreate, fetchPartyJoin } from '../api/party';

const HomeContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: var(--background-color);
  position: relative;
  overflow-x: hidden;
`;

const ContentContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const TrendsContainer = styled(motion.div)`
  padding: 20px;
  margin-top: 30px;
`;

const TrendsTitle = styled(motion.h2)`
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--primary-color);
    border-radius: 2px;
  }
`;

const MapContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
`;

// 애니메이션 변수
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const slideUpVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30
    }
  },
  exit: { 
    y: "100%", 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

function Home() {
  const containerRef = useRef(null);
  useScroll(containerRef, "vertical");

  const [load, setLoad] = useState(false);
  const [code, setCode] = useState("");
  const [participants, setParticipants] = useState(['정종욱', '하천수', '이서진']);
  const [result, setResult] = useState({menu_id: null, menu_name: '', imageUrl: ''});

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
  };

  // 초기 화면으로 돌아가는 함수
  const resetHome = () => {
    // 추천 화면 숨기기
    setView('showRec', false);
    // 지도 숨기기
    setView('showMap', false);
    // 파티 화면 숨기기
    setView('showParty', 0);
  };

  const [isHeightChanged, setIsHeightChanged] = useState(false);
  const [isFixed, setIsFixed] = useState(true);

  const loginId = localStorage.getItem("loginId");
  const { userInfo, loading, error } = useUserInfo();
  
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();
  
  const [trendsRef, trendsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const getLocation = () => {
    setLoad(true);
    console.log("위치 정보 요청 시작");
    
    if (navigator.geolocation) {
      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("위치 정보 획득 성공");
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          setUserLocation({
            lat: latitude,
            lng: longitude
          });
          
          setLoad(false);
        },
        (error) => {
          console.error("위치 정보 획득 실패:", error.code, error.message);
          // 에러 코드별 메시지 처리
          let errorMessage = "";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "위치 정보 접근 권한이 거부되었습니다.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "위치 정보를 사용할 수 없습니다.";
              break;
            case error.TIMEOUT:
              errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
              break;
            default:
              errorMessage = "알 수 없는 오류가 발생했습니다.";
          }
          
          alert(errorMessage);
          
          // 기본 위치로 서울 설정
          setUserLocation({
            lat: 37.5665,
            lng: 126.9780
          });
          
          setLoad(false);
        },
        geoOptions
      );
    } else {
      console.error("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      alert("이 브라우저에서는 위치 정보가 지원되지 않습니다. 기본 위치(서울)로 설정합니다.");
      
      setUserLocation({
        lat: 37.5665,
        lng: 126.9780
      });
      
      setLoad(false);
    }
  };

  useEffect(() => {
    if (!userLocation) return;
    fetchRecommendation(userLocation.lat, userLocation.lng);
  }, [userLocation]);

  const fetchRecommendation = (lat, lng) => {
    setLoad(true);
    console.log("음식 추천 요청:", { lat, lng, user_id: userInfo?.id || 'guest' });

    fetch("https://mealhub.duckdns.org/api/recommend/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat: lat,
        lon: lng,
        timestamp: new Date().toISOString().slice(0,-1),
        user_id: userInfo?.id || 'guest',
      }),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`API 응답 오류: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(body => {
      console.log("추천 응답 데이터:", body);
      
      // 응답 데이터 유효성 검사
      if (!body || !body.recommendations || body.recommendations.length === 0) {
        throw new Error('유효한 추천 데이터가 없습니다.');
      }
      
      const recommendation = body.recommendations[0];
      if (!recommendation.menu_name || !recommendation.menu_id) {
        throw new Error('필수 메뉴 정보가 없습니다.');
      }
      
      const menuName = recommendation.menu_name;
      setResult({
        menu_id: recommendation.menu_id,
        menu_name: menuName,
        imageUrl: foodData[menuName]?.url || 'https://via.placeholder.com/400x300?text=음식+이미지'
      });
      setView('showRec', true);
    })
    .catch(err => {
      console.error("추천 요청 오류:", err.message || err);
      
      // 임시 데이터로 처리 (API 실패시)
      const fallbackMenus = ["비빔밥", "김치찌개", "삼겹살", "불고기", "냉면"];
      const randomIndex = Math.floor(Math.random() * fallbackMenus.length);
      const tempMenu = fallbackMenus[randomIndex];
      
      setResult({
        menu_id: randomIndex + 1,
        menu_name: tempMenu,
        imageUrl: foodData[tempMenu]?.url || 'https://via.placeholder.com/400x300?text=음식+이미지'
      });
      setView('showRec', true);
    })
    .finally(() => {
      setLoad(false);
    });
  };

  const skipMenu = () => {
    if (!result || !result.menu_id) {
      console.error("스킵할 메뉴 정보가 없습니다.");
      return;
    }
    
    // 불만족 피드백 전송 (로그인 상태일 경우에만)
    if (userInfo && userInfo.id) {
      fetch("https://mealhub.duckdns.org/api/feedback/skip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userInfo.id,
          menu_id: result.menu_id,
          timestamp: new Date().toISOString().slice(0, -1),
          lat: userLocation?.lat || 37.5665,
          lon: userLocation?.lng || 126.9780
        })
      })
      .then(res => {
        if (!res.ok) {
          console.error("피드백 전송 실패:", res.status, res.statusText);
        } else {
          console.log("피드백 전송 성공");
        }
      })
      .catch(err => console.error("피드백 전송 오류:", err));
    } else {
      console.log("비로그인 상태: 피드백 전송 건너뜀");
    }

    // 지도 숨기기
    setView('showMap', false);

    // 새로운 추천 요청
    if (userLocation) {
      fetchRecommendation(userLocation.lat, userLocation.lng);
    } else {
      // 위치 정보가 없는 경우 기본 위치로 요청
      console.log("위치 정보가 없어 기본 위치로 요청합니다.");
      fetchRecommendation(37.5665, 126.9780);
    }
  };

  useEffect(() => {
    if (calculateTotalHeight() <= window.innerHeight) setIsFixed(true);
    else setIsFixed(false);
    setIsHeightChanged(false);
  }, [isHeightChanged]);

  const calculateTotalHeight = () => {
    if (containerRef.current) {
      const children = Array.from(containerRef.current.children);
      const totalHeight = children.reduce((sum, child) => sum + child.offsetHeight, 0);
      return totalHeight;
    }
    return 0;
  };

  // 파티 토글 이벤트 수신 리스너 추가
  useEffect(() => {
    const handleToggleParty = () => {
      setView('showParty', view.showParty === 0 ? 1 : 0);
    };

    // 이벤트 리스너 등록
    window.addEventListener('toggleParty', handleToggleParty);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('toggleParty', handleToggleParty);
    };
  }, [view.showParty]);
  
  // getLocation 이벤트 리스너 추가
  useEffect(() => {
    const handleGetLocation = () => {
      console.log("getLocation 이벤트 발생");
      if (!userInfo && loading) {
        alert("유저 정보를 불러오는 중입니다...");
      } else {
        getLocation();
      }
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('getLocation', handleGetLocation);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('getLocation', handleGetLocation);
    };
  }, [userInfo, loading, getLocation]);

  return (
    <HomeContainer
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {load && <LoadingOverlay />}
      
      <Header resetHome={resetHome} />
      
      <ContentContainer>
        <AnimatePresence>
          <Party
            showParty={view.showParty}
            setShowParty={(value) => setView('showParty', value)}
            code={code}
            setCode={setCode}
            fetchPartyCreate={fetchPartyCreate}
            fetchPartyJoin={fetchPartyJoin}
          />
        </AnimatePresence>
        
        <FoodRecommendation 
          showRec={view.showRec}
          result={result}
          userInfo={userInfo}
          skipMenu={skipMenu}
          setView={setView}
          setIsHeightChanged={setIsHeightChanged}
        />
        
        <AnimatePresence>
          {view.showMap && (
            <MapContainer
              variants={slideUpVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Map
                userLocation={userLocation}
                resultMenu={result.menu_name}
                menuId={result.menu_id}
              />
            </MapContainer>
          )}
        </AnimatePresence>
        
        {!view.showRec && !view.showMap && (
          <TrendsContainer
            ref={trendsRef}
            variants={fadeInVariants}
            initial="hidden"
            animate={trendsInView ? "visible" : "hidden"}
          >
            <TrendsTitle variants={itemVariants}>인기 메뉴</TrendsTitle>
            <Trends />
          </TrendsContainer>
        )}
      </ContentContainer>
    </HomeContainer>
  );
}

export default Home;