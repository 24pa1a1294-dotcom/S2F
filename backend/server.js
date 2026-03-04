const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const careerLogic = (interest) => {
  switch (interest) {
    case "Data":
      return [
        { career: "Data Analyst", match: "90%" },
        { career: "Business Analyst", match: "80%" },
        { career: "Data Scientist", match: "70%" },
      ];
    case "AI":
      return [
        { career: "ML Engineer", match: "90%" },
        { career: "AI Engineer", match: "85%" },
        { career: "Data Scientist", match: "80%" },
      ];
    case "Web Development":
      return [
        { career: "Frontend Developer", match: "90%" },
        { career: "Backend Developer", match: "85%" },
        { career: "Full Stack Developer", match: "80%" },
      ];
    case "Business":
      return [
        { career: "Business Analyst", match: "90%" },
        { career: "Product Manager", match: "85%" },
        { career: "Consultant", match: "80%" },
      ];
    case "Design":
      return [
        { career: "UX/UI Designer", match: "90%" },
        { career: "Graphic Designer", match: "85%" },
        { career: "Product Designer", match: "80%" },
      ];
    default:
      return [{ career: "General Professional", match: "60%" }];
  }
};

app.post("/recommend", (req, res) => {
  const { skills, interest } = req.body;
  if (!interest) {
    return res.status(400).json({ error: "Interest is required." });
  }

  const suggestions = careerLogic(interest);
  res.json(suggestions);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
