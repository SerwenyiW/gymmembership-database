document.addEventListener("DOMContentLoaded", () => {
    fetch("/getUsers")
        .then(response => {
            return response.json();
        })
        .then(data => {
            for(let i = 0;i<data.data.length;i++) {
                let user = data.data[i];
                let username = user.name;
                let tickettype = user.tickettype;
                let ticketday = user.ticketday;
                let dayleft = user.dayleft;
                document.getElementById("usersContainer").innerHTML += `
                    <div id="userContainer" style="background-color: ${dayleft > 3 ? "green" : dayleft <= 1 ? "red" : "orange"};">
                        <h1>Név: ${username}</h1>
                        <div id="info">
                            <h2>Vásárlás napja: ${ticketday}</h2>
                            <h2>Bérlet típus: ${tickettype}</h2>
                            <h2>Bérlet lejár: ${dayleft} nap múlva!</h2>
                        </div>
                        <div id="buttons">
                            <button onclick="deleteUser('${username}')">Törlés</button>
                            <button>Idk</button>
                        </div>
                    </div>
                `;
            }
        });
});

function deleteUser(username) {
    fetch("/deleteUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user: username })
    })
    window.location.reload();
}
