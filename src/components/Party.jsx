function Party({ showParty, setShowParty, code, setCode, fetchPartyCreate, fetchPartyJoin }) {
    if (showParty === 1) {
        return (
            <div className='party'>
            <div className='invitebtn' onClick={() => {
            setShowParty(2);
            // 파티 생성 요청 보내기
            fetchPartyCreate();
            }}>초대하기</div>
            <div className='participatebtn' onClick={() => 
            setShowParty(3)
            }>참가하기</div>
            </div>
        );
    }

    if (showParty === 2) {
        return (
            <div className='invite'>host mode</div>
        );
    }

    if (showParty === 3) {
        return (
            <div className='invite'>
            <input type="text" placeholder="초대코드 입력" className="code-input" value={code} onChange={(e) => setCode(e.target.value)}/>
            <button className='search-party' onClick={() => {
                // 파티 참가 요청 보내기
                fetchPartyJoin(code);
            }}>검색</button>
            </div>
        );
    }

    return null;
}

export default Party;