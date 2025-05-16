import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const PartyContainer = styled(motion.div)`
  background: linear-gradient(135deg, var(--secondary-light), var(--secondary-color));
  border-radius: 0 0 var(--border-radius-md) var(--border-radius-md);
  box-shadow: var(--box-shadow-md);
  overflow: hidden;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
`;

const PartyButton = styled(motion.button)`
  flex: 1;
  height: 100%;
  padding: 0 20px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
  color: white;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: ${props => props.active ? '0' : '50%'};
    width: ${props => props.active ? '100%' : '0'};
    height: 3px;
    background: white;
    transition: all 0.3s ease;
  }
  
  &:hover::after {
    left: 0;
    width: 100%;
  }
  
  i {
    font-size: 18px;
  }
`;

const ContentContainer = styled(motion.div)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h3)`
  color: white;
  margin-bottom: 20px;
  font-size: 20px;
  text-align: center;
`;

const InputGroup = styled.div`
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--border-radius-sm);
  border: none;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--box-shadow-sm);
  text-align: center;
  letter-spacing: 1px;
  
  &:focus {
    outline: none;
    background: white;
    box-shadow: var(--box-shadow-md);
  }
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: white;
  color: var(--secondary-color);
  font-weight: 600;
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  box-shadow: var(--box-shadow-sm);
  
  i {
    font-size: 18px;
  }
`;

const CodeDisplay = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: var(--border-radius-sm);
  margin: 20px 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
  color: white;
  text-align: center;
  box-shadow: var(--box-shadow-sm);
  border: 1px dashed rgba(255, 255, 255, 0.5);
`;

const Message = styled(motion.p)`
  margin-top: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  text-align: center;
`;

const InstructionBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  padding: 12px 16px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 300px;
  
  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
  }
`;

// 애니메이션 변수
const containerVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: 'auto', 
    opacity: 1,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2, delay: 0.1 }
    }
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: {
      opacity: { duration: 0.2 },
      height: { duration: 0.3, delay: 0.1 }
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

function Party({ showParty, setShowParty, code, setCode, fetchPartyCreate, fetchPartyJoin }) {
    const [generatedCode, setGeneratedCode] = useState("");
    
    const handleCreateParty = async () => {
        // 파티 생성 요청 보내기
        const partyCode = await fetchPartyCreate();
        setGeneratedCode(partyCode || "ABCD1234"); // 임시 코드 또는 API 응답
    };
    
    const handleJoinParty = async () => {
        if (!code.trim()) {
            alert("초대코드를 입력해주세요!");
            return;
        }
        
        // 파티 참가 요청 보내기
        const success = await fetchPartyJoin(code);
        if (success) {
            // 성공 처리
        }
    };
    
    return (
        <AnimatePresence>
            {showParty > 0 && (
                <PartyContainer
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <ButtonContainer>
                        <PartyButton
                            active={showParty === 2}
                            onClick={() => setShowParty(2)}
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <i className="fa-solid fa-user-plus"></i>
                            초대하기
                        </PartyButton>
                        <PartyButton
                            active={showParty === 3}
                            onClick={() => setShowParty(3)}
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <i className="fa-solid fa-right-to-bracket"></i>
                            참가하기
                        </PartyButton>
                    </ButtonContainer>
                    
                    <AnimatePresence mode="wait">
                        {showParty === 2 && (
                            <ContentContainer
                                key="host"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Title>친구들과 함께 먹어요!</Title>
                                <InstructionBox
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <p>파티를 만들고 친구들에게 코드를 공유하세요. 함께 추천 받은 메뉴로 맛있는 식사를 즐겨보세요!</p>
                                </InstructionBox>
                                
                                {generatedCode ? (
                                    <>
                                        <CodeDisplay
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                                        >
                                            {generatedCode}
                                        </CodeDisplay>
                                        <Message
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            이 코드를 친구들에게 공유하세요!
                                        </Message>
                                    </>
                                ) : (
                                    <ActionButton
                                        whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCreateParty}
                                    >
                                        <i className="fa-solid fa-people-group"></i>
                                        파티 만들기
                                    </ActionButton>
                                )}
                            </ContentContainer>
                        )}
                        
                        {showParty === 3 && (
                            <ContentContainer
                                key="join"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Title>친구의 파티에 참가하세요!</Title>
                                <InputGroup>
                                    <Input
                                        type="text"
                                        placeholder="초대코드 입력"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        maxLength={8}
                                    />
                                </InputGroup>
                                <ActionButton
                                    whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleJoinParty}
                                >
                                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                    참가하기
                                </ActionButton>
                            </ContentContainer>
                        )}
                    </AnimatePresence>
                </PartyContainer>
            )}
        </AnimatePresence>
    );
}

export default Party;