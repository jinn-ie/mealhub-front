import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserInfo from '../hooks/useUserInfo';

function Mypage() {

    const [userInfo, setUserInfo] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const containerRef = useRef(null); 
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { refreshUserInfo } = useUserInfo();


    // 내 정보 보기 및 수정
    // 로그아웃
    // 회원탈퇴

    const fetchUserInfo = async () => {
        try {
          console.log(token);
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
        } catch (error) {
          console.error("유저 정보 요청 에러:", error);
        }
    };
      
    useEffect(() => {
        fetchUserInfo();
    }, [])
    
  
    const handleChange = (e) => {
    };

    const handleSubmit = async (e) => {
    }  

    const handleLogout = async () => {
        try {
            const response = await fetch("https://mealhub.duckdns.org/backend/user/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            console.log(response);

            if (response.ok) {
                // 로컬스토리지에서 토큰 제거 및 캐시 초기화
                localStorage.clear();
                await refreshUserInfo();

                alert("로그아웃 되었습니다."); // 알림 메시지
                navigate("/");  // 홈으로 이동
            } else {
                throw new Error("로그아웃 실패");
            }
        } catch (error) {
            console.error("로그아웃 에러: ", error);
            alert("로그아웃 중 오류가 발생했습니다.");
        }
    };

    const handleDeleteAccount = async () => {
      const confirmDelete = window.confirm("정말로 탈퇴하시겠습니까?");

      if (!confirmDelete) {
        return;
      }

      setIsDeleting(true);

      try {
        const response = await fetch("https://mealhub.duckdns.org/backend/delete", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.text();
        console.log(response.status);

        if (!response.ok) {
          throw new Error("회원 탈퇴에 실패했습니다.");
        }

        if (data) {
          console.log("탈퇴 응답 : ", data);
        } else {
          console.log("탈퇴 (본문 없음)");
        }

        console.log("탈퇴 완료 : ", data);
        localStorage.clear();
        alert("회원 탈퇴가 완료되었습니다. 다시 만날 수 있길...");
        navigate("/"); // 홈으로 이동

      } catch (error) {
        console.error("탈퇴 요청 에러 : ", error);
        alert("탈퇴 요청 중 문제가 발생했습니다.");
      } finally {
        setIsDeleting(false);
      }
    }
    
  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App" ref={containerRef}>
        <div className="orange-nav">
        <h3 onClick={() => {
          navigate("/");
        }}>MEALHUB</h3>
        {/* <div className="nav-buttons">
            <button className="like">🤍</button>
            <button className="my">🐻‍❄️</button>
        </div> */}
        </div>

        <form className="mypage" onSubmit={handleSubmit}>
            <h2>내 정보</h2>
            <div className="form-group">
                <label>ID</label>
                <input type="text" name="id" defaultValue={localStorage.loginId} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>성별</label>
                    <div className="input-group">
                    <label><input type="radio" className="check" name="sex" value="남성" checked={userInfo.gender === "남성"} onChange={handleChange} />남성</label>
                    <label><input type="radio" className="check" name="sex" value="여성" checked={userInfo.gender === "여성"} onChange={handleChange} />여성</label>
                    </div>
            </div>
            <div className="form-group">
                <label>나이대</label>
                <div className="input-group">
                <select className="age1" name="age1" defaultValue={userInfo.age?.slice(0, 3)} >
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

                <select className="age2" name="age2" defaultValue={userInfo.age?.slice(3)} onChange={handleChange}>
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
                  <input type="text" className="favorite" name="favorite" onChange={handleChange} />
                  <div className="favorite-btn">등록</div>
                </div>
            </div>

                <button className="submit" type="submit">수정</button>
        </form>
      
        <div className='buttons mypagebtn'>
        <button
            className="show-map"
            onClick={async () => {
                try {
                const response = await fetch("https://mealhub.duckdns.org/backend/user/logout", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    },
                });
                console.log(response);

                if (response.ok) {
                    // 로컬스토리지에서 토큰 제거
                    localStorage.clear();

                    alert("로그아웃 되었습니다."); // 알림 메시지
                    navigate("/");  // 홈으로 이동
                } else {
                    throw new Error("로그아웃 실패");
                }
                } catch (error) {
                console.error("로그아웃 에러: ", error);
                alert("로그아웃 중 오류가 발생했습니다.");
                }
            }}
            >
            로그아웃
            </button>

        <button className="reload" onClick={handleDeleteAccount}>{isDeleting ? "탈퇴 중..." : "회원탈퇴"}</button>
        </div>
    </div>
  );
};

export default Mypage;