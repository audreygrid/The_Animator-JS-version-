// DOM Elements
const loginForm = document.querySelector("form");
const loginUsername = document.getElementById("username");
const loginPassword = document.getElementById("password");

// Server URL
let server = "https://daata.onrender.com/users";

// Function to handle login
async function handleLogin(username, password) {
    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    try {
        let response = await fetch(server);
        let users = await response.json();

        let foundUser = users.find(user => user.name === username && user.password === password);

        if (foundUser) {
            alert("Login successful!");
            
            // Store user session
            localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

            // Redirect to the main animation page
            window.location.href = "index.html"; // Change this to your main page
        } else {
            alert("Invalid username or password.");
        }
    } catch (error) {
        console.error("Error connecting to server:", error);
        alert("Error logging in. Please try again later.");
    }
}

// Event listener for login form
loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form submission
    handleLogin(loginUsername.value, loginPassword.value);
});
