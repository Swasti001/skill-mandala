const axios = require('axios');

async function test() {
    try {
        console.log("Registering test user...");
        const registerBody = {
            username: "testuser_" + Date.now(),
            email: "test_" + Date.now() + "@example.com",
            password: "password123",
            name: "Test User"
        };
        await axios.post('http://localhost:8080/api/auth/register', registerBody);
        
        console.log("Logging in...");
        const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
            username: registerBody.username,
            password: "password123"
        });
        const token = loginRes.data.token;
        const userId = loginRes.data.user.id;
        console.log("Got token for user", userId);

        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log("\n--- Testing Matches ---");
        try {
            const matches = await axios.get(`http://localhost:8080/api/user/matches/mutual/${userId}`, config);
            console.log("Matches OK:", matches.data);
        } catch(e) { console.error("Matches Error:", e.response ? e.response.data : e.message); }

        console.log("\n--- Testing Sessions ---");
        try {
            const sessions = await axios.get(`http://localhost:8080/api/user/sessions/${userId}`, config);
            console.log("Sessions OK:", sessions.data);
        } catch(e) { console.error("Sessions Error:", e.response ? e.response.data : e.message); }

        console.log("\n--- Testing Messages ---");
        try {
            const msgs = await axios.get(`http://localhost:8080/api/user/messages/conversations/${userId}`, config);
            console.log("Messages OK:", msgs.data);
        } catch(e) { console.error("Messages Error:", e.response ? e.response.data : e.message); }

    } catch (err) {
        console.error("Setup Error:", err.response ? err.response.data : err.message);
    }
}
test();
