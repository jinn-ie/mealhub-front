import { useState, useEffect } from 'react';

const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('토큰이 없습니다.');
            setLoading(false);
            return;
        }

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
          setError(error);
        } finally {
          setLoading(false);
        }
    };

        fetchUserInfo();
    }, []);

    return { userInfo, loading, error };
};

export default useUserInfo;