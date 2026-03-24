let currentUserId = null
let selectedUser = null

// ================= INIT =================
async function init() {

    const { data } = await supabaseClient.auth.getUser()

    if (!data.user) {
        window.location.href = "login.html"
        return
    }

    currentUserId = data.user.id

    loadProfile()
    loadAllUsers()
}

init()

// ================= TOAST =================
function showToast(msg) {

    let toast = document.getElementById("toast")

    if (!toast) {
        toast = document.createElement("div")
        toast.id = "toast"
        toast.style.position = "fixed"
        toast.style.bottom = "90px"
        toast.style.left = "50%"
        toast.style.transform = "translateX(-50%)"
        toast.style.background = "#22c55e"
        toast.style.padding = "10px 20px"
        toast.style.borderRadius = "10px"
        toast.style.color = "black"
        document.body.appendChild(toast)
    }

    toast.innerText = msg
    toast.style.display = "block"

    setTimeout(() => toast.style.display = "none", 2000)
}

// ================= PROFILE =================
async function loadProfile() {

    const { data } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", currentUserId)
        .single()

    if (data) {
        document.getElementById("name").value = data.name || ""
        document.getElementById("teaches").value = data.teaches || ""
        document.getElementById("learns").value = data.learns || ""
    }
}

document.getElementById("saveProfile").onclick = async () => {

    const name = document.getElementById("name").value
    const teaches = document.getElementById("teaches").value
    const learns = document.getElementById("learns").value

    await supabaseClient
        .from("profiles")
        .update({ name, teaches, learns })
        .eq("id", currentUserId)

    showToast("Profile Updated ✅")
}

// ================= ALL USERS =================
async function loadAllUsers() {

    const { data } = await supabaseClient
        .from("profiles")
        .select("*")

    const container = document.getElementById("allUsers")
    container.innerHTML = ""

    data.forEach(user => {

        if (user.id === currentUserId) return

        container.innerHTML += `
      <div class="user-card">
        <b>${user.name}</b><br>
        <small>Teaches: ${user.teaches}</small><br>
        <small>Learns: ${user.learns}</small>
        <button onclick="startChat('${user.id}')">Chat</button>
      </div>
    `
    })
}

// ================= MATCHES =================
document.getElementById("findMatches").onclick = async () => {

    const { data: myProfile } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", currentUserId)
        .single()

    const { data: users } = await supabaseClient
        .from("profiles")
        .select("*")

    const container = document.getElementById("matchContainer")
    container.innerHTML = ""

    users.forEach(user => {

        if (user.id === currentUserId) return

        const isMatch =
            user.teaches?.toLowerCase().includes(
                myProfile.learns?.toLowerCase()
            )

        if (isMatch) {
            container.innerHTML += `
        <div class="user-card" style="animation:fadeIn 0.3s">
          <b>${user.name}</b><br>
          Teaches: ${user.teaches}
          <button onclick="startChat('${user.id}')">Chat</button>
        </div>
      `
        }
    })

    if (container.innerHTML === "") {
        container.innerHTML = "<p>No matches found 😢</p>"
    }
}

// ================= CHAT =================
window.startChat = function (userId) {

    selectedUser = userId
    showToast("Chat started 💬")

    loadMessages()

    // auto refresh (live feel)
    setInterval(loadMessages, 2000)
}

async function loadMessages() {

    if (!selectedUser) return

    const { data } = await supabaseClient
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: true })

    const box = document.getElementById("chatBox")
    box.innerHTML = ""

    data.forEach(msg => {

        if (
            (msg.sender_id === currentUserId && msg.receiver_id === selectedUser) ||
            (msg.sender_id === selectedUser && msg.receiver_id === currentUserId)
        ) {

            const isMe = msg.sender_id === currentUserId

            box.innerHTML += `
        <div style="
          background:${isMe ? '#22c55e' : '#1e293b'};
          padding:8px;
          border-radius:10px;
          margin:5px;
          text-align:${isMe ? 'right' : 'left'};
          animation:fadeIn 0.3s;
        ">
          ${msg.message}
        </div>
      `
        }
    })

    box.scrollTop = box.scrollHeight
}

// ================= SEND MESSAGE =================
document.getElementById("sendMsg").onclick = async () => {

    const text = document.getElementById("chatInput").value

    if (!text || !selectedUser) {
        showToast("Select user first ❌")
        return
    }

    await supabaseClient
        .from("messages")
        .insert([{
            sender_id: currentUserId,
            receiver_id: selectedUser,
            message: text
        }])

    document.getElementById("chatInput").value = ""

    loadMessages()
}

// ================= LOGOUT =================
function logout() {
    supabaseClient.auth.signOut()
    window.location.href = "login.html"
}