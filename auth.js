// SIGNUP
async function signup() {

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    })

    console.log("Signup Data:", data)
    console.log("Signup Error:", error)

    if (error) {
        alert("❌ " + error.message)
    } else {
        alert("✅ Signup Successful")

        // redirect to login
        window.location.href = "login.html"
    }
}


// LOGIN
async function login() {

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    })

    console.log("DATA:", data)
    console.log("ERROR:", error)

    if (error) {
        alert("❌ " + error.message)
    } else {
        alert("✅ Login Success")
        window.location.href = "dashboard.html"
    }
}

// LOGOUT
async function logout() {
    await supabase.auth.signOut()
    window.location.href = "login.html"
}
// ADD EVENT
async function addEvent() {

    const title = document.getElementById("title").value
    const date = document.getElementById("date").value

    const { data: userData } = await supabaseClient.auth.getUser()

    const user = userData.user

    if (!title || !date) {
        alert("Enter all details")
        return
    }

    const { error } = await supabaseClient.from("events").insert([
        {
            user_id: user_id,
            title: title,
            date: date
        }
    ])

    if (error) {
        alert(error.message)
    } else {
        alert("✅ Event Added")
        loadEvents()
    }
}


// LOAD EVENTS
async function loadEvents() {

    const { data: userData } = await supabaseClient.auth.getUser()
    const user = userData.user

    const { data, error } = await supabaseClient
        .from("events")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true })

    const container = document.getElementById("events")
    container.innerHTML = ""

    data.forEach(event => {
        container.innerHTML += `
      <div style="margin:10px; padding:10px; background:#111; border-radius:10px;">
        <b>${event.title}</b><br>
        <small>${new Date(event.date).toLocaleString()}</small>
      </div>
    `
    })
}


// LOAD ON PAGE OPEN
loadEvents()
