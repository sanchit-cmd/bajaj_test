const path = require("path");
const graphService = require("../services/graph.service");

const getHomePage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "templates", "index.html"));
};

const handleBfhlPost = (req, res) => {
  const { data = [] } = req.body || {};
  const result = graphService.processEdges(data);
  
  res.json({
    user_id: "sanchitnigam_25042005",
    email_id: "sn0950@srmist.edu.in",
    college_roll_number: "RA2311003030178",
    ...result
  });
};

module.exports = {
  getHomePage,
  handleBfhlPost
};
