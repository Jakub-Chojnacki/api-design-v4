import express from "express";

const app = express();

app.get("/", (req, res) => {
  console.log("henlo");
  res.status(200);
  res.json({ message: "hello" });
});


export default app