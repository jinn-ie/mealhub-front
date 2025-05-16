import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
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
  Row,
  OutlineButton
} from '../styles/CommonComponents';

// 회원가입 페이지 스타일
const SignupContainer = styled(Page)`
  padding: 0;
`;

const ContentContainer = styled(Container)`
  padding: 40px 20px;
`;

const SignupForm = styled(motion.form)`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormTitle = styled(Title)`
  margin-bottom: 30px;
  text-align: center;
`;

const SubmitButton = styled(Button)`
  margin-top: 16px;
  width: 100%;
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

const ErrorMessage = styled(motion.div)`
  color: var(--error);
  font-size: 14px;
  margin-top: -12px;
  margin-bottom: -12px;
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
  color: var(--text-primary);
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

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 16px;
  color: var(--text-primary);
`;

const FoodInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const FoodInput = styled(Input)`
  flex: 1;
`;

const AddButton = styled(OutlineButton)`
  height: 48px;
  padding: 0 16px;
  white-space: nowrap;
`;

const FoodList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const FoodItem = styled(motion.div)`
  padding: 6px 12px;
  background-color: var(--primary-light);
  color: var(--primary-color);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
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

function Signup2() {
  const navigate = useNavigate();
  const location = useLocation();

  const { id, pwd } = location.state || {};

  const [formData, setFormData] = useState({
    sex: "",
    age1: "",
    age2: "",
    allergy: false,
    category: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [foodList, setFoodList] = useState([]);

  const handleAddFood = () => {
    if (inputValue.trim() === "") return;
    setFoodList([...foodList, inputValue]);
    setInputValue("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
      
    if (type === "radio") {
      // 라디오 버튼의 경우, 해당 값을 formData에 저장
      setFormData({ ...formData, [name]: value });
    }
    else if (type === "checkbox") {
      if (name === "allergy") {
        setFormData(prevData => ({
          ...prevData,
          allergy: checked,
        }));
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
      console.log(formData.age1, formData.age2)
      validationError = "나이대를 선택해주세요.";
    }

    else if (!formData.category) {
      validationError = "선호 카테고리를 적어도 1개 이상 선택해주세요.";
    }

    if (validationError) {
        setError(validationError); // 에러 메시지 설정
        return; // 에러가 있으면 제출하지 않음
    }

    const signupData = {
      loginId: id,
      password: pwd,
      age: `${formData.age1}${formData.age2}`,
      gender: formData.sex,
      allergy: formData.allergy
    };

    setLoading(true);

    try {
      console.log(signupData);
      const response = await fetch("https://mealhub.duckdns.org/backend/user/signin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        console.log(response);
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        console.log(response);
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
        <FormTitle variants={itemVariants}>회원가입</FormTitle>
        
        <SignupForm 
          onSubmit={handleSubmit}
          variants={containerVariants}
        >
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
            <CheckboxGroup>
              <CheckboxLabel>
                <input 
                  type="checkbox" 
                  name="allergy" 
                  checked={formData.allergy}
                  onChange={handleChange} 
                />
                알레르기 있음
              </CheckboxLabel>
            </CheckboxGroup>
          </InputGroup>
          
          <InputGroup as={motion.div} variants={itemVariants}>
            <Label>선호음식</Label>
            <FoodInputGroup>
              <FoodInput 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="좋아하는 음식을 입력하세요"
              />
              <AddButton 
                type="button"
                onClick={handleAddFood}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                등록
              </AddButton>
            </FoodInputGroup>
            
            {foodList.length > 0 && (
              <FoodList>
                {foodList.map((food, idx) => (
                  <FoodItem 
                    key={idx}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {food}
                  </FoodItem>
                ))}
              </FoodList>
            )}
          </InputGroup>
          
          <SubmitButton 
            as={motion.button}
            type="submit"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
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
