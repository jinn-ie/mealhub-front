import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import useUserInfo from '../hooks/useUserInfo';
import LoadingOverlay from "../components/LoadingOverlay";

const ProfileContainer = styled(motion.div)`
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
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 1;
`;

const ProfileSection = styled(motion.div)`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
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

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-secondary);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
    outline: none;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(var(--primary-color-rgb), 0.05);
  }
  
  input:checked + & {
    background-color: rgba(var(--primary-color-rgb), 0.1);
    border-color: var(--primary-color);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #eaeaea;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(var(--primary-color-rgb), 0.05);
  }
  
  input:checked + & {
    background-color: rgba(var(--primary-color-rgb), 0.1);
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  flex: 1;
  cursor: pointer;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const Button = styled(motion.button)`
  background: ${props => props.variant === 'danger' 
    ? 'linear-gradient(135deg, #ff6b6b, #ee5253)' 
    : props.variant === 'secondary' 
      ? 'linear-gradient(135deg, #8395a7, #576574)'
      : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))'};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
  box-shadow: 0 4px 12px ${props => props.variant === 'danger' 
    ? 'rgba(238, 82, 83, 0.3)' 
    : props.variant === 'secondary' 
      ? 'rgba(87, 101, 116, 0.3)'
      : 'rgba(var(--primary-color-rgb), 0.3)'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px ${props => props.variant === 'danger' 
      ? 'rgba(238, 82, 83, 0.4)' 
      : props.variant === 'secondary' 
        ? 'rgba(87, 101, 116, 0.4)'
        : 'rgba(var(--primary-color-rgb), 0.4)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const FavoriteInputGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const FavoriteInput = styled(Input)`
  flex: 1;
`;

const FavoriteButton = styled(Button)`
  margin-top: 0;
  padding: 12px 20px;
  width: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
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

function Mypage() {
    const [userInfo, setUserInfo] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
      gender: "",
      age: "",
      ageDetail: "",
      allergies: []
    });

    const containerRef = useRef(null); 
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { refreshUserInfo } = useUserInfo();

    const fetchUserInfo = async () => {
        setLoading(true);
        try {
          const response = await fetch("https://mealhub.duckdns.org/backend/user/info", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            throw new Error("유저 정보를 불러오지 못했습니다.");
          }
          
          const data = await response.json();
          console.log("User Info:", data);
          setUserInfo(data);
          
          // 폼 데이터 초기화
          if (data) {
            setFormData({
              gender: data.gender || "",
              age: data.age?.slice(0, 3) || "20대",
              ageDetail: data.age?.slice(3) || "중반",
              allergies: data.allergies?.split(',') || []
            });
          }
        } catch (error) {
          console.error("유저 정보 요청 에러:", error);
          alert("유저 정보를 불러오는데 실패했습니다.");
          navigate("/");
        } finally {
          setLoading(false);
        }
    };
      
    useEffect(() => {
        fetchUserInfo();
    }, []);
    
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      if (type === 'checkbox') {
        if (checked) {
          setFormData({
            ...formData,
            allergies: [...formData.allergies, value]
          });
        } else {
          setFormData({
            ...formData,
            allergies: formData.allergies.filter(item => item !== value)
          });
        }
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const updateData = {
          gender: formData.gender,
          age: `${formData.age}${formData.ageDetail}`,
          allergies: formData.allergies.join(',')
        };
        
        const response = await fetch("https://mealhub.duckdns.org/backend/user/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
          throw new Error("정보 수정에 실패했습니다.");
        }
        
        alert("정보가 성공적으로 수정되었습니다.");
        await fetchUserInfo();
      } catch (error) {
        console.error("정보 수정 에러:", error);
        alert("정보 수정 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://mealhub.duckdns.org/backend/user/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // 로컬스토리지 초기화
                localStorage.clear();
                await refreshUserInfo();

                alert("로그아웃 되었습니다.");
                navigate("/");
            } else {
                throw new Error("로그아웃 실패");
            }
        } catch (error) {
            console.error("로그아웃 에러:", error);
            alert("로그아웃 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
      const confirmDelete = window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");

      if (!confirmDelete) {
        return;
      }

      setIsDeleting(true);
      setLoading(true);

      try {
        const response = await fetch("https://mealhub.duckdns.org/backend/delete", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("회원 탈퇴에 실패했습니다.");
        }

        localStorage.clear();
        await refreshUserInfo();
        
        alert("회원 탈퇴가 완료되었습니다. 다시 만날 수 있길 바랍니다.");
        navigate("/");
      } catch (error) {
        console.error("탈퇴 요청 에러:", error);
        alert("탈퇴 요청 중 문제가 발생했습니다.");
      } finally {
        setIsDeleting(false);
        setLoading(false);
      }
    };
    
  return (
    <ProfileContainer
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {loading && <LoadingOverlay />}
      
      <Header />
      
      <ContentContainer>
        <ProfileSection
          as={motion.form}
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          <SectionTitle>내 정보</SectionTitle>
          
          <FormGroup>
            <Label>아이디</Label>
            <Input 
              type="text" 
              name="id" 
              disabled 
              value={localStorage.getItem("loginId") || ""} 
              style={{backgroundColor: "#f5f5f5"}}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>성별</Label>
            <InputGroup>
              <div style={{position: 'relative'}}>
                <HiddenInput 
                  type="radio" 
                  id="gender-male"
                  name="gender" 
                  value="남성" 
                  checked={formData.gender === "남성"} 
                  onChange={handleChange} 
                />
                <RadioLabel htmlFor="gender-male">
                  <i className="fa-solid fa-mars"></i> 남성
                </RadioLabel>
              </div>
              
              <div style={{position: 'relative'}}>
                <HiddenInput 
                  type="radio" 
                  id="gender-female"
                  name="gender" 
                  value="여성" 
                  checked={formData.gender === "여성"} 
                  onChange={handleChange} 
                />
                <RadioLabel htmlFor="gender-female">
                  <i className="fa-solid fa-venus"></i> 여성
                </RadioLabel>
              </div>
            </InputGroup>
          </FormGroup>
          
          <FormGroup>
            <Label>나이대</Label>
            <InputGroup>
              <Select 
                name="age" 
                value={formData.age} 
                onChange={handleChange}
              >
                <option value="10대">10대</option>
                <option value="20대">20대</option>
                <option value="30대">30대</option>
                <option value="40대">40대</option>
                <option value="50대">50대</option>
                <option value="60대">60대</option>
                <option value="70대">70대</option>
                <option value="80대">80대</option>
                <option value="90대">90대</option>
              </Select>
              
              <Select 
                name="ageDetail" 
                value={formData.ageDetail} 
                onChange={handleChange}
              >
                <option value="초반">초반</option>
                <option value="중반">중반</option>
                <option value="후반">후반</option>
              </Select>
            </InputGroup>
          </FormGroup>
          
          <FormGroup>
            <Label>알레르기</Label>
            <CheckboxContainer>
              {['유제품', '계란', '견과류', '갑각류', '대두', '밀', '고추'].map(allergy => (
                <div key={allergy} style={{position: 'relative'}}>
                  <HiddenInput 
                    type="checkbox" 
                    id={`allergy-${allergy}`}
                    name="allergies" 
                    value={allergy} 
                    checked={formData.allergies.includes(allergy)} 
                    onChange={handleChange} 
                  />
                  <CheckboxLabel htmlFor={`allergy-${allergy}`}>
                    {allergy}
                  </CheckboxLabel>
                </div>
              ))}
            </CheckboxContainer>
          </FormGroup>
          
          <FormGroup>
            <Label>선호 음식</Label>
            <FavoriteInputGroup>
              <FavoriteInput 
                type="text" 
                name="favorite" 
                placeholder="선호하는 음식 입력"
              />
              <FavoriteButton 
                as={motion.button}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                추가
              </FavoriteButton>
            </FavoriteInputGroup>
          </FormGroup>
          
          <Button 
            as={motion.button}
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            정보 수정하기
          </Button>
        </ProfileSection>
        
        <ProfileSection variants={itemVariants}>
          <SectionTitle>계정 관리</SectionTitle>
          
          <ButtonGroup>
            <Button 
              as={motion.button}
              variant="secondary"
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              로그아웃
            </Button>
            
            <Button 
              as={motion.button}
              variant="danger"
              onClick={handleDeleteAccount}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isDeleting}
            >
              {isDeleting ? "처리 중..." : "회원 탈퇴"}
            </Button>
          </ButtonGroup>
        </ProfileSection>
      </ContentContainer>
    </ProfileContainer>
  );
}

export default Mypage;