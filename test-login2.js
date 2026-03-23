const axios = require('axios');
async function run() {
  try {
    const signup = await axios.post('http://localhost:8000/auth/signup', { email: "c3@test.com", password: "password123" });
  } catch(e) {}
  try {
    const login = await axios.post('http://localhost:8000/auth/login', { email: "c3@test.com", password: "password123" });
    console.log("Login Object:", Object.keys(login.data));
    console.log("Login User:", login.data.user);
    console.log("Login Profile Keys:", login.data.profile ? Object.keys(login.data.profile) : null);
    
  } catch(e) {}
}
run();
