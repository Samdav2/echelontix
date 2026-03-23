const axios = require('axios');
async function run() {
  try {
    const login = await axios.post('http://localhost:8000/auth/login', { email: "testuser1@example.com", password: "password123" });
    const token = login.data.access_token;
    console.log("Token:", token);
    const profile = await axios.get('http://localhost:8000/profile/profile/getProfile', { headers: { Authorization: `Bearer ${token}` } });
    console.log("Profile:", profile.data);
    
    // what about interested events?
    const interestedEvents = await axios.get('http://localhost:8000/user/user/interestedEvents', { headers: { Authorization: `Bearer ${token}` } });
    console.log("InterestedEvents:", interestedEvents.data);
  } catch (e) {
    console.log("Error:", e.response?.data || e.message);
  }
}
run();
