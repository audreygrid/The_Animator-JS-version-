//          DOM
const us = document.getElementById("username")
const ps = document.getElementById("password")
const sin = document.getElementById("signup")

//      functions
async function handleSignup(username, password) {
    if (!username || !password) {
        console.log("Username and password are required.");
        return;
    }

    let server = "https://daata.onrender.com/users";

    try {
        let response = await fetch(server);
        let users = await response.json();

        let existingUser = users.find(user => user.name === username);

        if (existingUser) {
            alert("Username already exists. Choose another one.");
        } else {
            let newUser = { name: username, password: password, animations:[]};

            await fetch(server, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });

            console.log("User registered successfully!");
            setTimeout(()=>{location.href = "login.html"},2000)
            
        }
    } catch (error) {
        console.error("Error connecting to server:", error);
    }
}

// Event listener for signup button
sin.addEventListener("click", (e) => {
    e.preventDefault()
    handleSignup(us.value, ps.value);
    
});
