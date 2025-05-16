# Node.js 설치된 기본 이미지
FROM node:20

# 작업할 폴더를 /frontend로 설정
WORKDIR /frontend

# package.json 파일 복사 
COPY package*.json ./

# 라이브러리 설치
RUN npm install

# 소스코드 전부 복사 (현재 폴더의 모든 내용 복사)
#COPY . .

# 서버 실행
CMD ["npm", "start"]

# 포트 열어주기
EXPOSE 3000
