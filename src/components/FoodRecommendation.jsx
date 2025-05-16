import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const RecommendationContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  margin-top: 20px;
  width: 100%;
`;

const Title = styled(motion.h2)`
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 30px;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: var(--primary-color);
    border-radius: 2px;
  }
`;

const MenuName = styled(motion.div)`
  font-size: 34px;
  font-weight: 800;
  color: var(--primary-color);
  margin: 15px 0 25px;
  text-align: center;
  
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    bottom: -5px;
    left: -10px;
    right: -10px;
    height: 50%;
    background: rgba(255, 107, 53, 0.1);
    transform: skew(-15deg);
  }
`;

const FoodImageContainer = styled(motion.div)`
  width: 100%;
  max-width: 320px;
  height: 260px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow-md);
  margin-bottom: 30px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6));
    z-index: 1;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 300px;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  background: ${props => props.primary ? 'var(--primary-color)' : 'white'};
  color: ${props => props.primary ? 'white' : 'var(--primary-color)'};
  border: ${props => props.primary ? 'none' : '2px solid var(--primary-color)'};
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: var(--box-shadow-sm);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--box-shadow-md);
    background: ${props => props.primary ? 'var(--primary-dark)' : 'rgba(255, 122, 0, 0.1)'};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  i {
    font-size: 18px;
  }
`;

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  
  h3 {
    margin: 20px 0 10px;
    font-size: 22px;
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 30px;
    max-width: 300px;
  }
`;

const IconBackground = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: rgba(255, 122, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  
  i {
    font-size: 36px;
    color: var(--primary-color);
  }
`;

// 애니메이션 변수
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2
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

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
};

const FoodRecommendation = ({ showRec, result, userInfo, skipMenu, setView, setIsHeightChanged }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  if (!showRec) {
    return (
      <EmptyState
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <IconBackground
          animate={pulseAnimation}
        >
          <i className="fa-solid fa-utensils"></i>
        </IconBackground>
        <h3>오늘 뭐 먹지?</h3>
        <p>배고픈 당신을 위한 맞춤 메뉴 추천</p>
        <ActionButton 
          primary
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const getLocationEvent = new CustomEvent('getLocation');
            window.dispatchEvent(getLocationEvent);
          }}
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          추천 받기
        </ActionButton>
      </EmptyState>
    );
  }
  
  return (
    <RecommendationContainer
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <Title variants={itemVariants}>오늘의 추천 메뉴</Title>
      
      <MenuName 
        variants={itemVariants}
        animate={{ scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity }}}
      >
        {result.menu_name}
      </MenuName>
      
      <FoodImageContainer
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <motion.img 
          src={result.imageUrl} 
          alt={result.menu_name}
          initial={{ scale: 1.2, rotate: -3 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </FoodImageContainer>
      
      <ButtonContainer>
        <ActionButton
          primary
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!userInfo}
          onClick={() => {
            setView('showMap', true);
            setIsHeightChanged(true);
          }}
        >
          <i className="fa-solid fa-map-location-dot"></i>
          주변 식당 찾기
        </ActionButton>
        
        <ActionButton
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!userInfo}
          onClick={() => {
            skipMenu();
            setIsHeightChanged(true);
          }}
        >
          <i className="fa-solid fa-arrow-rotate-right"></i>
          다른 메뉴 추천
        </ActionButton>
      </ButtonContainer>
    </RecommendationContainer>
  );
};

export default FoodRecommendation; 