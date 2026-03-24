// ================= GLOBAL =================
let currentDate = new Date()
let selectedDate = null

// ================= GENERATE CALENDAR =================
function generateCalendar() {

    const calendar = document.getElementById("calendar")
    calendar.innerHTML = ""

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // HEADER
    const header = document.createElement("div")
    header.style.gridColumn = "span 7"
    header.style.textAlign = "center"
    header.style.marginBottom = "10px"

    header.innerHTML = `
    <button onclick="prevMonth()">⬅</button>
    <b style="margin:0 10px;">
      ${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}
    </b>
    <button onclick="nextMonth()">➡</button>
  `

    calendar.appendChild(header)

    // DAYS HEADER
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    days.forEach(d => {
        const div = document.createElement("div")
        div.innerText = d
        div.style.fontWeight = "bold"
        calendar.appendChild(div)
    })

    const firstDay = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()

    // EMPTY BOXES BEFORE START
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div")
        calendar.appendChild(empty)
    }

    // DATES
    for (let d = 1; d <= totalDays; d++) {

        const div = document.createElement("div")
        div.innerText = d

        const fullDate = `${year}-${month + 1}-${d}`

        div.onclick = () => {
            selectedDate = fullDate
            loadEvents(fullDate)
        }

        calendar.appendChild(div)
    }
}

// ================= MONTH NAV =================
window.nextMonth = function () {
    currentDate.setMonth(currentDate.getMonth() + 1)
    generateCalendar()
}

window.prevMonth = function () {
    currentDate.setMonth(currentDate.getMonth() - 1)
    generateCalendar()
}

// ================= LOAD MATCH USERS =================
async function loadMatches() {

    const dropdown = document.getElementById("matchUser")

    dropdown.innerHTML = "<option>Loading...</option>"

    const { data, error } = await supabase
        .from("profiles")
        .select("*")

    if (error) {
        console.log(error)
        dropdown.innerHTML = "<option>Error loading users</option>"
        return
    }

    dropdown.innerHTML = "<option value=''>Select user</option>"

    data.forEach(user => {
        dropdown.innerHTML += `
      <option value="${user.id}">
        ${user.name || "No Name"}
      </option>
    `
    })
}

// ================= SAVE EVENT =================
window.saveEvent = async function () {

    const note = document.getElementById("note").value
    const user = document.getElementById("matchUser").value

    if (!selectedDate) {
        alert("Select a date first ❌")
        return
    }

    const link = "https://meet.jit.si/skillswap-" + Date.now()

    await supabase.from("events").insert([{
        user_id: user,
        date: selectedDate,
        note: note,
        meet_link: link
    }])

    alert("Meeting Scheduled ✅")
    loadEvents(selectedDate)
}

// ================= INSTANT MEET =================
window.startInstantMeeting = function () {

    const container = document.getElementById("instantLink")

    if (!container) {
        alert("Open Calendar tab first ⚠️")
        return
    }

    const link = "https://meet.jit.si/skillswap-" + Date.now()

    container.innerHTML = `
    <div style="
      background:#1e293b;
      padding:10px;
      border-radius:10px;
      margin-top:10px;
    ">
      <p style="word-break:break-all;">${link}</p>

      <button onclick="copyMeetLink('${link}')">
        📋 Copy Link
      </button>

      <a href="${link}" target="_blank">
        <button>🚀 Join Meeting</button>
      </a>
    </div>
  `
}
// ================= LOAD EVENTS =================
async function loadEvents(date) {

    const { data } = await supabase
        .from("events")
        .select("*")

    const container = document.getElementById("eventsList")
    container.innerHTML = ""

    data.forEach(e => {
        if (e.date === date) {

            container.innerHTML += `
        <div class="user-card">
          <b>${e.date}</b><br>
          ${e.note}<br>
          <a href="${e.meet_link}" target="_blank">Join</a>
        </div>
      `
        }
    })
}

// ================= INIT =================
window.onload = () => {
    generateCalendar()
    loadMatches()
}