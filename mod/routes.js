const express = require("express");

const fs = require("fs"); // fs 불러오기

const router = express.Router();


router.get("/", (req, res) => {
  res.sendFile(__dirname + "../public/index.html"); // 루트 경로 처리 로직
});

// POST 요청으로 메세지 전달
router.post("/send", (req, res) => {
  const message = req.body.message;
  // 서버의 현재시간을 기반으로 timestamp 생성
  const timestamp = new Date().toLocaleTimeString();

  // 임의의 AI 응답
  const aiResponse = generateAIResponse();

  // JSON 파일에서 기존 데이터 읽기
  fs.readFile("data.json", (err, data) => {
    if (err) {
      console.error("Error reading data.json:", err);
      res.status(500).send("Internal Server Error");
    } else {
      let jsonData = JSON.parse(data);

      // 새로운 메세지를 데이터에 추가
      jsonData.mainContent.inputRecords.push({
        type: "user",
        message: message,
        timestamp: timestamp,
      });

      // AI 응답도 데이터에 추가
      jsonData.mainContent.inputRecords.push({
        type: "assistant",
        message: aiResponse,
        timestamp: timestamp,
      });

      // 업데이트된 데이터를 JSON 파일에 다시 쓰기
      // JavaScript 객체를 JSON 문자열로 변환하는 메서드인 JSON.stringify()를 사용
      // jsonData: JSON으로 변환할 JavaScript 객체
      // null : JSON 문자열을 들여쓰기 할 때 사용되는 공백 문자나 문자열
      // 2 : JSON 문자열 내에서 들여쓰기를 표시할 때 사용할 공백 문자 수
      fs.writeFile("data.json", JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error("Error writing data.json:", err);
          res.status(500).send("Internal Server Error");
        } else {
          // 클라이언트에 성공적인 응답 보내기
          res.json({
            status: "success",
            userMessage: message,
            aiMessage: aiResponse,
          });
        }
      });
    }
  });
});

module.exports = { handleRootRequest: router.get("/"), handleDataRequest: router.post("/send") };
