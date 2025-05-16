import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useUserInfo from '../hooks/useUserInfo';

const HeaderContainer = styled(motion.header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  color: var(--text-primary);
  position: relative;
  z-index: 10;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  width: 100%;
`;

const Logo = styled(motion.h1)`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  cursor: pointer;
  letter-spacing: 1px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 20px;
  padding: 8px;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s ease;
    white-space: nowrap;
  }
  
  &:hover::after {
    opacity: 1;
    visibility: visible;
  }
`;

const MenuContainer = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  width: 100%;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 20;
  overflow: hidden;
  border-bottom-left-radius: var(--border-radius-md);
  border-bottom-right-radius: var(--border-radius-md);
`;

const MenuItem = styled(motion.div)`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-primary);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
  
  i {
    color: var(--primary-color);
    font-size: 18px;
  }
`;

// 애니메이션 변수
const menuVariants = {
  hidden: {
    height: 0,
    opacity: 0
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.3
      },
      opacity: {
        duration: 0.2,
        delay: 0.1
      }
    }
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      opacity: {
        duration: 0.2
      },
      height: {
        duration: 0.3,
        delay: 0.1
      }
    }
  }
};

const menuItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: i => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  }),
  exit: i => ({
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
      delay: i * 0.05
    }
  })
};

const buttonVariants = {
  hover: {
    scale: 1.1,
    color: 'var(--primary-color)',
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.9 }
};

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const loginId = localStorage.getItem("loginId");
  const { refreshUserInfo } = useUserInfo();
  
  // 파티 관련 기능 추가
  const toggleParty = () => {
    // Home 컴포넌트가 이 함수를 통해 파티 상태를 토글할 수 있도록 이벤트 방출
    const event = new CustomEvent('toggleParty');
    window.dispatchEvent(event);
  };

  // 찜 목록 페이지로 이동 (아직 구현되지 않은 경우 알림)
  const goToFavorites = () => {
    alert('찜 목록 기능은 곧 구현될 예정입니다!');
  };
  
  // 사용자 프로필 관련 동작
  const handleUserAction = () => {
    if (loginId) {
      // 로그인 상태면 드롭다운 토글
      toggleMenu();
    } else {
      // 로그인 안 된 상태면 로그인 페이지로 이동
      navigate('/login');
    }
  };
  
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    setShowMenu(false);
  };
  
  // 로그아웃 처리 함수
  const handleLogout = async () => {
    // 캐시 및 로그인 정보 초기화
    localStorage.removeItem("loginId");
    localStorage.removeItem("token");
    
    // 사용자 정보 상태 갱신
    await refreshUserInfo();
    
    // 메뉴 닫고 로그인 페이지로 이동
    setShowMenu(false);
    navigate('/login');
  };
  
  return (
    <>
      <HeaderContainer
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        <Logo
          onClick={() => handleNavigation('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          MEALHUB
        </Logo>
        
        <NavButtons>
          <IconButton 
            data-tooltip="함께 먹기" 
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={toggleParty}
          >
            <i className="fa-solid fa-handshake"></i>
          </IconButton>
          
          <IconButton 
            data-tooltip="내 찜 목록" 
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={goToFavorites}
          >
            <i className="fa-solid fa-heart"></i>
          </IconButton>
          
          <IconButton 
            data-tooltip={loginId ? `${loginId}님` : "로그인 필요"}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleUserAction}
          >
            <i className="fa-solid fa-user"></i>
          </IconButton>
        </NavButtons>
      </HeaderContainer>
      
      <AnimatePresence>
        {showMenu && loginId && (
          <MenuContainer
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <MenuItem 
              onClick={() => handleNavigation('/mypage')}
              custom={0}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <i className="fa-solid fa-user-circle"></i>
              <span>내 프로필</span>
            </MenuItem>
            <MenuItem 
              onClick={handleLogout}
              custom={1}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <i className="fa-solid fa-sign-out-alt"></i>
              <span>로그아웃</span>
            </MenuItem>
            <MenuItem 
              onClick={() => handleNavigation('/')}
              custom={2}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <i className="fa-solid fa-home"></i>
              <span>홈으로</span>
            </MenuItem>
          </MenuContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header; 