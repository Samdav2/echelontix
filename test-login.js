const axios = require('axios');
async function run() {
  try {
    const signup = await axios.post('http://localhost:8000/auth/signup', { email: "testuser1@example.com", password: "password123" });
    console.log("Signup:", signup.data);
  } catch (e) { console.log(e.response?.data || e.message); }
  
  try {
    const login = await axios.post('http://localhost:8000/auth/login', { email: "testuser1@example.com", password: "password123" });
    console.log("Login:", login.data);
  } catch (e) { console.log(e.response?.data || e.message); }
}
run();
