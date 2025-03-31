// DOM
const canvas = document.getElementById("pixelCanvas");

const New = document.getElementById("New");
const Save = document.getElementById("Save");
const Delete = document.getElementById("Delete");
const Import = document.getElementById("Import");
const Export = document.getElementById("Export");
const Play = document.getElementById("Play");
const aniName = document.getElementById("animation-name");
const newFrame = document.getElementById("animationsList");
const showcase = document.getElementById("showcase");
const nameDisp = document.getElementById("nameDisp");

const modal = document.getElementById("newAnimationModal");
const closeModal = document.getElementById("closeModal");

// Variables
const ctx = canvas.getContext("2d");
let server = "https://daata.onrender.com/users";

let Drawing = false;
let Animations = [];
let canDraw = false;
let current = null;
let currentFrame = null;

// Functions

New.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
    if (e.target === document.getElementById("allanims") || !document.getElementById("allanims").contains(e.target)) {
        document.getElementById("allanims").style.display = "none";
    }
});

newFrame.style.display = "none";

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
console.log(loggedInUser)

nameDisp.innerText = loggedInUser.name;

fetch(`${server}/${loggedInUser.id}`)
    .then(j => j.json())
    .then(data => {
        Animations = data.animations;
        console.log("Here are your animations ");
        console.log(Animations)
    })

function createnewFrame(e, username, data) {
    DrawFunctions.clearCanvas();
    const frame = document.createElement("div");
    frame.className = "animations-list";
    console.log(username)
    document.getElementById("frames").appendChild(frame);
    let fr = { name: `${Math.ceil(Math.random() * 1000000000)}`, content: [], vis: frame };
    if (username !== undefined) {
        console.log(data)
        fr = { name: username, content: [...data], vis: frame };
    }
    currentFrame = fr;
    showcase.innerText = fr.name;
    frame.addEventListener("click", () => {
        showcase.innerText = fr.name;
        currentFrame = fr;
        DrawFunctions.clearCanvas();
        fr.content.forEach((pObjectAlpha) => {
            DrawFunctions.restartPos();
            pObjectAlpha.forEach((pObject) => {
                DrawFunctions.redraw(pObject);
            });
        });
        DrawFunctions.finishPos();
    });
    frame.innerText = fr.name;
    current.push(fr);
    return fr;
}

const DrawFunctions = {
    draw: (e, saverTable) => {
        if (!Drawing) return;
        if (currentFrame === null) createnewFrame();
        const Pos = DrawFunctions.Position(e);
        ctx.lineWidth = 10;
        ctx.linecap = "round";
        ctx.strokeStyle = "black";

        ctx.lineTo(Pos.x, Pos.y);
        ctx.stroke();
        let coord = { x: Pos.x, y: Pos.y };
        if (currentFrame.content[(currentFrame.content.length) - 1]) {
            currentFrame.content[(currentFrame.content.length) - 1].push(coord);
        }
    },
    redraw: (pObject) => {
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";

        ctx.lineTo(pObject.x, pObject.y);
        ctx.stroke();
    },
    restartPos: () => {
        Drawing = true;
        ctx.beginPath();
        ctx.moveTo(currentFrame.content[0].x, currentFrame.content[0].y);
    },
    Position: (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    },
    startPos: (e) => {
        if (!canDraw) return;
        if (currentFrame === null) createnewFrame();
        Drawing = true;

        const Pos = DrawFunctions.Position(e);
        ctx.beginPath();
        ctx.moveTo(Pos.x, Pos.y);

        let newSeg = [];
        currentFrame.content.push(newSeg);
    },
    finishPos: () => {
        Drawing = false;
        ctx.beginPath();
    },
    clearCanvas: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};

document.getElementById("createAnimation").addEventListener("click", function () {
    // Remove previous event listeners before adding new ones
    canvas.removeEventListener("mousedown", DrawFunctions.startPos);
    canvas.removeEventListener("mouseup", DrawFunctions.finishPos);
    canvas.removeEventListener("mousemove", DrawFunctions.draw);
    newFrame.removeEventListener("click", createnewFrame);

    const animationName = document.getElementById("animationName").value.trim();
    modal.style.display = "none";
    document.getElementById("frames").innerHTML = "";

    if (animationName === "") {
        alert("Please enter a valid animation name.");
        return;
    }

    canDraw = true;
    const currentAnimation = {
        name: animationName,
        frames: []
    };
    aniName.innerText = animationName;
    current = currentAnimation.frames;
    newFrame.style.display = "block";
    document.getElementById("frames").innerHTML = "";

    // Save the animation
    function S() {
        Animations.push(currentAnimation);
        const Brandnew = {
            animations: Animations
        }
        fetch(`${server}/${loggedInUser.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Brandnew)
        })
    }

    Save.addEventListener("click", S);

    // Add the event listener for creating new frames only once
    newFrame.addEventListener("click", createnewFrame);

    // Add drawing event listeners
    canvas.addEventListener("mousedown", DrawFunctions.startPos);
    canvas.addEventListener("mouseup", DrawFunctions.finishPos);
    canvas.addEventListener("mousemove", DrawFunctions.draw);
});

Import.addEventListener("click", (e) => {
    // Prevent closing of the animation list when clicking the Import button
    e.stopPropagation();

    // Show the animation list when the Import button is clicked
    document.getElementById("allanims").style.display = "block";
    document.getElementById("aniLists").innerHTML = "...loading please wait";

    fetch(`${server}/${loggedInUser.id}`)
        .then(j => j.json())
        .then(data => {
            document.getElementById("aniLists").innerHTML = "";
            data.animations.forEach((currentAnimation) => {
                const li =document.createElement("li");
                const el =document.createElement("div");
                el.className = "anan";
                el.innerHTML= `<p style="font-weight: 700; font-size: larger;margin-left: 40px;padding-top: 10px;">${currentAnimation.name}</p>`
                li.appendChild(el);
                document.getElementById("aniLists").appendChild(li);
                li.addEventListener("click", ()=>{
                    // Remove previous event listeners before adding new ones
                    canvas.removeEventListener("mousedown", DrawFunctions.startPos);
                    canvas.removeEventListener("mouseup", DrawFunctions.finishPos);
                    canvas.removeEventListener("mousemove", DrawFunctions.draw);
                    newFrame.removeEventListener("click", createnewFrame);

                    const animationName = currentAnimation.name;
                    modal.style.display = "none";
                    document.getElementById("frames").innerHTML = "";

                    
                    if (animationName === "") {
                        alert("Please enter a valid animation name.");
                        return;
                    }

                    canDraw = true; 
                    aniName.innerText = animationName;
                    current = currentAnimation.frames;
                    
                    newFrame.style.display = "block";
                    document.getElementById("frames").innerHTML = "";

                    // Save the animation
                    function S() {
                        Animations.push(currentAnimation);
                        const Brandnew = {
                            animations: Animations
                        }
                        fetch(`${server}/${loggedInUser.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(Brandnew)
                        })
                    }

                    currentAnimation.frames.forEach((x)=>{
                        console.log(x)
                        createnewFrame(null, x.name, x.content);
                    })
                    Save.addEventListener("click", S);

                    // Add the event listener for creating new frames only once
                    newFrame.addEventListener("click", createnewFrame);
                    document.getElementById("allanims").style.display = "none";
                    // Add drawing event listeners
                    canvas.addEventListener("mousedown", DrawFunctions.startPos);
                    canvas.addEventListener("mouseup", DrawFunctions.finishPos);
                    canvas.addEventListener("mousemove", DrawFunctions.draw);
                })
            })
            
        })
})
Play.addEventListener("click", () => {
    if (current.length === 0) {
        alert("No frames to play!");
        return;
    }

    let T = 0;
    let int;

    function playFrame() {
        if (T < current.length) {
            DrawFunctions.clearCanvas();
            showcase.innerText = current[T].name;
            currentFrame = current[T];

            DrawFunctions.restartPos();
            
            // Loop through each stroke segment and redraw it
            current[T].content.forEach((strokeSegment) => {
                strokeSegment.forEach((pObject) => {
                    DrawFunctions.redraw(pObject);
                });
            });

            DrawFunctions.finishPos();
            T++;
        } else {
            clearInterval(int);
        }
    }

    int = setInterval(playFrame, 1000); // Show each frame for 1 second
});
