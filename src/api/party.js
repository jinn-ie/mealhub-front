export const fetchPartyCreate = () => {
    fetch("https://mealhub.duckdns.org/backend/party/create", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        credentials: 'include'
    })
    .then(res => {
        console.log("서버 응답:", res);
        return res.text();
    })
    .then(body => {
        console.log("응답 바디 : ", body);
        // setParticipants((prevParticipants) => [...prevParticipants, body.user_id]);
    });
}

export const fetchPartyJoin = (code) => {
    fetch('https://mealhub.duckdns.org/backend/party/join', {
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({code})
    })
    .then(response => response.text())
    .then(text => {
        console.log(text);
    })
    .catch(error => {
        console.error('파티 참가 실패:', error);
    });
}
