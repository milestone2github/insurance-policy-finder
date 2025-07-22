async function getMembers(req, res) {
  try {
    // TODO: implement fetching logic here
  } catch (err) {
    console.error("Internal Error in fetching members", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

async function addMembers(req, res) {
  try {
    const data = req.body;
    // TODO: implement saving logic using data
  } catch (err) {
    console.error("Internal Error in adding members", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

module.exports = {
  getMembers,
  addMembers,
};