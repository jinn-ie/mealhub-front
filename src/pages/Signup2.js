import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Header from "../components/Header";
import LoadingOverlay from "../components/LoadingOverlay";
import { 
  Button, 
  InputGroup, 
  Label, 
  Input, 
  Page, 
  Container, 
  Title,
  Row
} from '../styles/CommonComponents';

// 회원가입 페이지 스타일
const SignupContainer = styled(Page)`
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled(Container)`
  padding: 20px;
  flex: 1;
  
  @media (min-width: 768px) {
    padding: 40px 20px;
  }
`;

const SignupForm = styled(motion.form)`
  width: 100%;
  max-width: 380px;
  margin: 20px auto 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: white;
  padding: 30px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  
  @media (min-width: 768px) {
    max-width: 440px;
    padding: 40px;
    margin: 30px auto 60px;
  }
`;

const FormTitle = styled(Title)`
  margin-bottom: 30px;
  text-align: center;
  position: relative;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: var(--primary-color);
    border-radius: 2px;
  }
`;

const SubmitButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
  height: 52px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(255, 122, 0, 0.2);
`;

const LoginLink = styled(motion.a)`
  text-align: center;
  margin-top: 20px;
  color: var(--text-secondary);
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 16px;
  
  input {
    accent-color: var(--primary-color);
    width: 18px;
    height: 18px;
  }
`;

const SelectGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Select = styled.select`
  padding: 14px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid #ddd;
  font-size: 16px;
  flex: 1;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.1);
    outline: none;
  }
`;

const AllergyGroup = styled.div`
  margin-top: 8px;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.6);
`;

const AllergyTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--text-secondary);
`;

const CheckboxRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
  
  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const CheckboxLabel = styled(motion.label)`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 30px;
  transition: all 0.3s ease;
  background-color: ${props => props.checked ? 'rgba(255, 122, 0, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.checked ? 'var(--primary-color)' : '#eee'};
  
  input {
    accent-color: var(--primary-color);
    width: 18px;
    height: 18px;
  }
  
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const FoodInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const AddButton = styled(Button)`
  height: 48px;
  padding: 0 16px;
  background: var(--primary-color);
  color: white;
`;

const FoodList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const FoodItem = styled(motion.div)`
  padding: 8px 16px;
  background: var(--primary-light);
  color: var(--primary-color);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  &:hover {
    background: rgba(255, 122, 0, 0.2);
    transform: translateY(-2px);
    transition: all 0.2s ease;
  }
`;

const DeleteIcon = styled.span`
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
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

const checkboxVariants = {
  checked: { 
    backgroundColor: 'rgba(255, 122, 0, 0.1)',
    borderColor: 'var(--primary-color)',
    scale: 1.05,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  },
  unchecked: { 
    backgroundColor: 'transparent',
    borderColor: '#eee',
    scale: 1,
    transition: { duration: 0.2 }
  }
};

// 알레르기 옵션 데이터
const allergyOptions = [
  { id: 'dairy', label: '유제품' },
  { id: 'eggs', label: '계란' },
  { id: 'nuts', label: '견과류' },
  { id: 'seafood', label: '갑각류' },
  { id: 'soy', label: '대두' },
  { id: 'wheat', label: '밀' },
  { id: 'pepper', label: '고추' }
];

function Signup2() {
  const navigate = useNavigate();
  const location = useLocation();

  const { id, pwd } = location.state || {};

  const [formData, setFormData] = useState({
    sex: "",
    age1: "",
    age2: "",
    allergies: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [foodList, setFoodList] = useState([]);

  const handleAddFood = () => {
    if (inputValue.trim() === "") return;
    setFoodList([...foodList, inputValue.trim()]);
    setInputValue("");
  };

  const handleRemoveFood = (index) => {
    const newList = [...foodList];
    newList.splice(index, 1);
    setFoodList(newList);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFood();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
      
    if (type === "radio") {
      // 라디오 버튼의 경우, 해당 값을 formData에 저장
      setFormData({ ...formData, [name]: value });
    }
    else if (type === "checkbox") {
      // 알레르기 체크박스 처리
      if (e.target.name === 'allergyOption') {
        const allergyValue = e.target.value;
        setFormData(prevData => {
          // 현재 allergies 배열에서 해당 알레르기 존재 여부 확인
          const currentAllergies = [...prevData.allergies];
          
          if (checked) {
            // 체크된 경우 추가 (중복 방지)
            if (!currentAllergies.includes(allergyValue)) {
              currentAllergies.push(allergyValue);
            }
          } else {
            // 체크 해제된 경우 제거
            const index = currentAllergies.indexOf(allergyValue);
            if (index !== -1) {
              currentAllergies.splice(index, 1);
            }
          }
          
          return {
            ...prevData,
            allergies: currentAllergies
          };
        });
      }
    } else {
      // 일반 입력 값
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 유효성 검사
    let validationError = "";

    if (!formData.sex) {
      validationError = "성별을 선택해주세요.";
    }
    else if (!formData.age1 || !formData.age2) {
      validationError = "나이대를 선택해주세요.";
    }

    if (validationError) {
        setError(validationError); // 에러 메시지 설정
        return; // 에러가 있으면 제출하지 않음
    }

    // 알레르기 정보 서버 포맷에 맞게 준비
    const hasAllergies = formData.allergies.length > 0;

    const signupData = {
      loginId: id,
      password: pwd,
      age: `${formData.age1}${formData.age2}`,
      gender: formData.sex,
      allergy: hasAllergies, // 알레르기 여부 (boolean)
      allergyTypes: formData.allergies, // 알레르기 종류 (배열)
      favoriteFoods: foodList.length > 0 ? foodList : [] // 선호 음식 (배열)
    };

    setLoading(true);

    try {
      console.log("회원가입 요청 데이터:", signupData);
      const response = await fetch("https://mealhub.duckdns.org/backend/user/signin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      setError("서버와의 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(error !== null){
      alert(error);
    }
    setError(null);
  }, [error]);

  return (
    <SignupContainer>
      <Header />
      {loading && <LoadingOverlay />}
      
      <ContentContainer
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <SignupForm 
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <FormTitle variants={itemVariants}>회원가입</FormTitle>
          
          <InputGroup as={motion.div} variants={itemVariants}>
            <Label>성별</Label>
            <RadioGroup>
              <RadioLabel>
                <input 
                  type="radio" 
                  name="sex" 
                  value="남성" 
                  checked={formData.sex === "남성"}
                  onChange={handleChange} 
                />
                남성
              </RadioLabel>
              <RadioLabel>
                <input 
                  type="radio" 
                  name="sex" 
                  value="여성" 
                  checked={formData.sex === "여성"}
                  onChange={handleChange} 
                />
                여성
              </RadioLabel>
            </RadioGroup>
          </InputGroup>
          
          <InputGroup as={motion.div} variants={itemVariants}>
            <Label>나이대</Label>
            <SelectGroup>
              <Select 
                name="age1" 
                value={formData.age1} 
                onChange={handleChange}
              >
                <option value="" disabled>선택</option>
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
                name="age2" 
                value={formData.age2} 
                onChange={handleChange}
              >
                <option value="" disabled>선택</option>
                <option value="초반">초반</option>
                <option value="중반">중반</option>
                <option value="후반">후반</option>
              </Select>
            </SelectGroup>
          </InputGroup>
          
          <InputGroup as={motion.div} variants={itemVariants}>
            <Label>알레르기</Label>
            <AllergyGroup>
              <AllergyTitle>알레르기가 있는 항목을 모두 선택해주세요</AllergyTitle>
              <CheckboxRow>
                {allergyOptions.slice(0, 3).map((option) => (
                  <CheckboxLabel 
                    key={option.id} 
                    checked={formData.allergies.includes(option.label)}
                    animate={formData.allergies.includes(option.label) ? "checked" : "unchecked"}
                    variants={checkboxVariants}
                    whileHover={{ scale: formData.allergies.includes(option.label) ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input 
                      type="checkbox" 
                      name="allergyOption" 
                      value={option.label} 
                      checked={formData.allergies.includes(option.label)}
                      onChange={handleChange} 
                    />
                    {option.label}
                  </CheckboxLabel>
                ))}
              </CheckboxRow>
              <CheckboxRow>
                {allergyOptions.slice(3, 6).map((option) => (
                  <CheckboxLabel 
                    key={option.id} 
                    checked={formData.allergies.includes(option.label)}
                    animate={formData.allergies.includes(option.label) ? "checked" : "unchecked"}
                    variants={checkboxVariants}
                    whileHover={{ scale: formData.allergies.includes(option.label) ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input 
                      type="checkbox" 
                      name="allergyOption" 
                      value={option.label} 
                      checked={formData.allergies.includes(option.label)}
                      onChange={handleChange} 
                    />
                    {option.label}
                  </CheckboxLabel>
                ))}
              </CheckboxRow>
              <CheckboxRow>
                {allergyOptions.slice(6).map((option) => (
                  <CheckboxLabel 
                    key={option.id} 
                    checked={formData.allergies.includes(option.label)}
                    animate={formData.allergies.includes(option.label) ? "checked" : "unchecked"}
                    variants={checkboxVariants}
                    whileHover={{ scale: formData.allergies.includes(option.label) ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input 
                      type="checkbox" 
                      name="allergyOption" 
                      value={option.label} 
                      checked={formData.allergies.includes(option.label)}
                      onChange={handleChange} 
                    />
                    {option.label}
                  </CheckboxLabel>
                ))}
              </CheckboxRow>
            </AllergyGroup>
          </InputGroup>
          
          <InputGroup as={motion.div} variants={itemVariants}>
            <Label>선호음식</Label>
            <FoodInputGroup>
              <Input 
                type="text" 
                name="favorite" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="좋아하는 음식을 입력하세요"
                onKeyPress={handleInputKeyPress}
              />
              <AddButton 
                type="button"
                onClick={handleAddFood}
                as={motion.button}
                whileHover={{ scale: 1.02, backgroundColor: 'var(--primary-dark)' }}
                whileTap={{ scale: 0.98 }}
              >
                등록
              </AddButton>
            </FoodInputGroup>
            
            <AnimatePresence>
              {foodList.length > 0 && (
                <FoodList>
                  {foodList.map((food, idx) => (
                    <FoodItem
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -4, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                    >
                      {food}
                      <DeleteIcon 
                        onClick={() => handleRemoveFood(idx)}
                      >
                        ×
                      </DeleteIcon>
                    </FoodItem>
                  ))}
                </FoodList>
              )}
            </AnimatePresence>
          </InputGroup>
          
          <SubmitButton 
            as={motion.button}
            type="submit"
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(255, 122, 0, 0.25)' }}
            whileTap={{ scale: 0.98 }}
          >
            가입하기
          </SubmitButton>
          
          <LoginLink 
            onClick={() => navigate("/login")}
            variants={itemVariants}
            whileHover={{ color: 'var(--primary-color)' }}
          >
            계정이 있으시다면? 로그인
          </LoginLink>
        </SignupForm>
      </ContentContainer>
    </SignupContainer>
  );
}

export default Signup2;
