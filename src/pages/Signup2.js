import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingOverlay from "../components/LoadingOverlay";

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
      // // 체크박스의 경우, 체크되면 값 추가, 해제되면 값 제거
      // setFormData(prevData => {
      //   const updatedData = { ...prevData };
      //   if (name === "allergy" || name === "category") {
      //     if (checked) {
      //       updatedData[name] = [...updatedData[name], value]; // 체크 시 값 추가
      //     } else {
      //       updatedData[name] = updatedData[name].filter(item => item !== value); // 체크 해제 시 값 제거
      //     }
      //   }
      //   return updatedData;
      // });
      if (name === "allergy") {
        setFormData(prevData => {
          // 현재 체크 상태를 반영하여 allergy 관련 체크박스 상태를 추적해야 함
          return {
            ...prevData,
            allergy: checked,
          }
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
    <div className="App Login">
        <div className="orange-nav">
        <h3 onClick={() => {
          navigate("/");
        }}>MEALHUB</h3>
        </div>
        {loading && <LoadingOverlay />}
        <h2>회원가입</h2>
        <form className="login-form signup2" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>성별</label>
                    <div className="input-group">
                    <label><input type="radio" className="check" name="sex" value="남성" onChange={handleChange} />남성</label>
                    <label><input type="radio" className="check" name="sex" value="여성" onChange={handleChange} />여성</label>
                    </div>
            </div>
            <div className="form-group">
                <label>나이대</label>
                <div className="input-group">
                <select className="age1" name="age1" value={formData.age1} onChange={handleChange}>
                  <option value="" disabled></option>
                  <option value="10대">10대</option>
                  <option value="20대">20대</option>
                  <option value="30대">30대</option>
                  <option value="40대">40대</option>
                  <option value="50대">50대</option>
                  <option value="60대">60대</option>
                  <option value="70대">70대</option>
                  <option value="80대">80대</option>
                  <option value="90대">90대</option>
                </select>

                <select className="age2" name="age2" value={formData.age2} onChange={handleChange}>
                  <option value="" disabled></option>
                  <option value="초반">초반</option>
                  <option value="중반">중반</option>
                  <option value="후반">후반</option>
                </select>
                </div>
            </div>
            <div className="form-group allergy">
                <label>알레르기</label>
                <div className="br">
                    <div className="input-group sub">
                    <label><input type="checkbox" className="check" name="allergy" value="유제품" onChange={handleChange} />유제품</label>
                    <label><input type="checkbox" className="check" name="allergy" value="계란" onChange={handleChange} />계란</label>
                    <label><input type="checkbox" className="check" name="allergy" value="견과류" onChange={handleChange} />견과류</label>
                    </div>
                    <div className="input-group sub">
                    <label><input type="checkbox" className="check" name="allergy" value="갑각류" onChange={handleChange} />갑각류</label>
                    <label><input type="checkbox" className="check" name="allergy" value="대두" onChange={handleChange} />대두</label>
                    <label><input type="checkbox" className="check" name="allergy" value="밀" onChange={handleChange} />밀</label>
                    </div>                    
                    <div className="input-group sub">
                    <label><input type="checkbox" className="check" name="allergy" value="고추" onChange={handleChange} />고추</label>
                    </div>
                </div>                  
            </div>
            <div className="form-group">
              <label>선호음식</label>
                <div className="input-group">
                  <input type="text" className="favorite" name="favorite" value={inputValue} onChange={(e) =>{ 
                    console.log("e",e.target.value);
                    setInputValue(e.target.value);
                    console.log("i",inputValue);
                    }} />
                  <div className="favorite-btn" onClick={handleAddFood}>등록</div>
                </div>
            </div>

            {/* 추가된 음식 목록 출력 */}
            <div className="food-list">
              {foodList.map((food, idx) => (
                <div key={idx} className="food-item">{food}</div>
              ))}
            </div>

            <button className="submit" type="submit">가입</button>
            <a onClick={() => navigate("/login")}>계정이 있으시다면? 로그인</a>
        </form>
    </div>
  );
}

export default Signup2;
