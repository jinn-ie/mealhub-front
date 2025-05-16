import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from "../components/LoadingOverlay";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({id: "", pwd: ""});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 유효성 검사
    let validationError = "";

    if (!formData.id) {
        validationError = "아이디를 입력해주세요.";
    }

    else if (!formData.pwd) {
        validationError = "비밀번호를 입력해주세요.";
    }

    if (Object.keys(validationError).length > 0) {
        setError(validationError); // 에러 메시지 설정
        return; // 에러가 있으면 제출하지 않음
    }

    setLoading(true);

    try {
      const response = await fetch("https://mealhub.duckdns.org/backend/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: formData.id,
          password: formData.pwd,
        }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        else throw new Error("서버 응답이 실패했습니다.");
      } else {
        alert("로그인 성공!");
        const token = await response.text();
        localStorage.setItem("loginId", formData.id);
        localStorage.setItem("token", token);
        navigate("/");
      }
    } catch (error) {
      console.error("로그인 요청 중 에러 발생 : ", error);
      setError("로그인 요청 중 에러가 발생했습니다.");
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
        {loading && <LoadingOverlay />}
        <div className="orange-nav">
        <h3 onClick={() => {
          navigate("/");
        }}>MEALHUB</h3>
        </div>
        <h2>로그인</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID</label>
            <input type="text" name="id" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input type="password" name="pwd" onChange={handleChange} />
          </div>
            <button className="submit" type="submit">로그인</button>
            <a onClick={() => navigate("/signup1")}>계정이 없으시다면? 회원가입</a>
        </form>
    </div>
  );
}

export default Login;
