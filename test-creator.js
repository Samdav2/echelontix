const axios = require('axios');
async function run() {
  try {
    const signup = await axios.post('http://localhost:8000/auth/signup', { email: "creator1@example.com", password: "password123" });
    console.log("Signup:", signup.data);
  } catch(e) {}
  try {
    const login = await axios.post('http://localhost:8000/auth/login', { email: "creator1@example.com", password: "password123" });
    const token = login.data.access_token;
    console.log("Login User ID:", login.data.user_id);
    console.log("Login Profile:", login.data.profile);
    
    const prof = await axios.get('http://localhost:8000/profile/profile/getProfile', { headers: { Authorization: `Bearer ${token}` } });
    console.log("Prof endpoint:", prof.data);
  } catch(e) {
    console.log(e.response?.data || e.message);
  }
}
run();
