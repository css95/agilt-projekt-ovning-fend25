let teamA = JSON.parse(localStorage.getItem("teamA")) || []
let teamB = JSON.parse(localStorage.getItem("teamB")) || []

let teamAName = localStorage.getItem("teamAName") || "Team A"
let teamBName = localStorage.getItem("teamBName") || "Team B"

const statsBtn = document.getElementById("stats")



function save() {

    localStorage.setItem("teamA", JSON.stringify(teamA))
    localStorage.setItem("teamB", JSON.stringify(teamB))

    localStorage.setItem("teamAName", teamAName)
    localStorage.setItem("teamBName", teamBName)

}


function renameTeam(team) {

    if (team === "A") {
        const val = document.getElementById("teamAInput").value
        if (val) teamAName = val
    }
    if (team === "B") {
        const val = document.getElementById("teamBInput").value
        if (val) teamBName = val
    }
    save()
    renderHome()
}


function renderHome() {
    document.getElementById("teamAName").textContent = teamAName
    document.getElementById("teamBName").textContent = teamBName
    const listA = document.getElementById("teamAList")
    const listB = document.getElementById("teamBList")
    listA.innerHTML = ""
    listB.innerHTML = ""
    teamA.forEach((p, index) => {
        const li = document.createElement("li")
        li.className = "player"
        li.innerHTML = `

            <span onclick="goToPlayer('${p.username}')">${p.username}</span>
            
            <span>${p.flag}</span>

            <button onclick="removePlayer('A','${p.username}')">Remove</button>

            <button onclick="changeTeam('A','${index}')">Change Team</button>
        `
        listA.appendChild(li)
    })
    teamB.forEach((p, index) => {
        const li = document.createElement("li")
        li.className = "player"
        li.innerHTML = `

            <span onclick="goToPlayer('${p.username}')">${p.username}</span>

            <span>${p.flag}</span>

            <button onclick="removePlayer('B','${p.username}')">Remove</button>

            <button onclick="changeTeam('B','${index}')">Change Team</button>

        `
        listB.appendChild(li)
    })

}


function goToPlayer(username) {
    localStorage.setItem("selectedPlayer", username)
    window.location.href = "playerinfo.html"
}

function removePlayer(team, username) {
    if (team === "A") {
        teamA = teamA.filter(p => p.username !== username);
    }
    if (team === "B") {
        teamB = teamB.filter(p => p.username !== username);
    }
    save()
    renderHome()

}

function usernameExists(username) {
    return teamA.some(p => p.username === username) ||  teamB.some(p => p.username === username)
}

async function renderAddPlayer() {
    await addCountriesToDropdown();

    const teamSelect = document.getElementById("teamSelect")

    teamSelect.innerHTML = `

        <option value="A" ${teamA.length >= 7 ? "disabled" : ""}>
        ${teamAName}
        </option>

        <option value="B" ${teamB.length >= 7 ? "disabled" : ""}>
        ${teamBName}
        </option>

    `

    document.getElementById("playerForm").addEventListener("submit", e => {
        e.preventDefault()
        if (teamA.length === 7 || teamB.length === 7) {
            alert("Your team is already full");
        }

        const username = document.getElementById("username").value
        if (usernameExists(username)) {
            document.getElementById("error").textContent = "Username already exists"
            // return;
        }

        const player = {
            username,
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            age: document.getElementById("age").value,
            country: document.getElementById("country").selectedOptions[0].dataset.name,
            flag: document.getElementById("country").selectedOptions[0].dataset.flag,
            ranking: document.getElementById("ranking").value
        }

        const team = document.getElementById("teamSelect").value
        if (team === "A") {
            teamA.push(player)
        }
        if (team === "B") {
            teamB.push(player)
        }
        save()
        window.location.href = "index.html"

    })

}

function renderPlayerInfo() {

    const username = localStorage.getItem("selectedPlayer");

    const player = teamA.find(p => p.username === username) || teamB.find(p => p.username === username);

    const profile = document.getElementById("profile");

    profile.innerHTML = `
        <div class="profile">
            <h2>${player?.username}</h2>
            <p><b>Name:</b> ${player?.firstname} ${player?.lastname}</p>
            <p><b>Age:</b> ${player?.age}</p>
            <p><b>Country:</b> ${player?.flag} ${player?.country}</p>
            <p><b>Ranking:</b> ${player?.ranking}</p>
            <br>
            <button onclick="window.location='index.html'">
            Back
            </button>
        </div>
    `;
}

function changeTeam(team, index) {
    if (team === "A") {
        if (teamB.length >= 7) {
            alert("Team B is full")
            return
        }
        const player = teamA.splice(parseInt(index), 1)[0]
        teamB.push(player)
    } else {
        if (teamA.length >= 7) {
            alert("Team A is full")
            return
        }
        const player = teamB.splice(parseInt(index), 1)[0]
        teamA.push(player)
    }
    renderHome()
}

function searchPlayer() {
    const searchInput = document.getElementById('search');
    const playerSearch = searchInput.value;
    const searchedPlayer = teamA.find(p => p.username === playerSearch) || teamB.find(p => p.username === playerSearch);

    if(searchedPlayer) {
        goToPlayer(searchedPlayer.username);
    } else {
        alert ("No player found");
    }
}

async function getCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/region/europe');
        const data = await response.json();

        return data.map(country => ({name: country.name.common, flag: country.flag})).sort(function(a, b){return a.name.localeCompare(b.name)});
    } catch (err) {
        console.error('Could not fetch country:', err);
        alert("Couldn't fetch countries")
        return [];
    }
}

async function addCountriesToDropdown() {
    const countriesDropdown = document.getElementById('country');

    const countries = await getCountries();

    for (let i = 0; i < countries.length; i++) {
        const countryElement = document.createElement('option');
        countryElement.textContent = countries[i].flag + ' ' + countries[i].name;
        countryElement.dataset.name = countries[i].name;
        countryElement.dataset.flag = countries[i].flag;
        console.log(countries[i].flag);
        countriesDropdown.appendChild(countryElement);
    }
}