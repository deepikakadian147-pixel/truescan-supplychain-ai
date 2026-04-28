import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/scan", (req, res) => {
  res.json({
    status: "AUTHENTIC",
    confidence: 0.97,
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
