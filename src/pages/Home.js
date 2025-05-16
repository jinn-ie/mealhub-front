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

const FloatingActionButton = styled(motion.button)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--box-shadow-lg);
  z-index: 1000;
  border: none;
  cursor: pointer;
  
  i {
    font-size: 24px;
  }
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
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          setUserLocation({
            lat: latitude,
            lng: longitude
          });
          
          setLoad(false);
        },
        (error) => {
          console.error("위치 정보를 가져오지 못했습니다.", error);
          setUserLocation({
            lat: 37.5665,
            lng: 126.9780
          });
          
          setLoad(false);
        }
      );
    } else {
      console.error("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
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
    .then(res => res.json())
    .then(body => {
      const menuName = body.recommendations[0].menu_name;
      setResult({
        menu_id: body.recommendations[0].menu_id,
        menu_name: menuName,
        imageUrl: foodData[menuName]?.url || 'https://via.placeholder.com/400x300?text=음식+이미지'
      });
      setView('showRec', true);
    })
    .catch(err => {
      console.error("추천 요청 오류:", err);
      // 임시 데이터로 처리 (API 실패시)
      const tempMenu = "비빔밥";
      setResult({
        menu_id: 1,
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
    if (!result || !result.menu_id) return;
    
    // 불만족 피드백 전송
    fetch("https://mealhub.duckdns.org/api/feedback/skip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userInfo?.id || 'guest',
        menu_id: result.menu_id,
        timestamp: new Date().toISOString().slice(0, -1),
        lat: userLocation.lat,
        lon: userLocation.lng
      })
    }).catch(err => console.error("피드백 전송 오류:", err));

    // 지도 숨기기
    setView('showMap', false);

    // 새로운 추천 요청
    fetchRecommendation(userLocation.lat, userLocation.lng);
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

  return (
    <HomeContainer
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {load && <LoadingOverlay />}
      
      <Header />
      
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
      
      {!view.showRec && !view.showMap && (
        <FloatingActionButton
          whileHover={{ scale: 1.1, boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => {
            if (!userInfo && loading) {
              alert("유저 정보를 불러오는 중입니다...");
            } else {
              getLocation();
            }
          }}
        >
          <i className="fa-solid fa-utensils"></i>
        </FloatingActionButton>
      )}
    </HomeContainer>
  );
}

export default Home;