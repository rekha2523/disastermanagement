

let registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let role = document.getElementById("registerRole").value;
        let name = document.getElementById("registerName").value.trim();
        let email = document.getElementById("registerEmail").value.trim();
        let mobile = document.getElementById("registerMobile").value.trim();
        let password = document.getElementById("registerPassword").value;
        let confirmPassword = document.getElementById("confirmPassword").value;

        let message = document.getElementById("registerMessage");

        if (name.length < 3) {
            message.innerText = "Enter a valid name.";
            message.style.color = "red";
            return;
        }

        if (!/^[0-9]{10}$/.test(mobile)) {
            message.innerText = "Enter a valid 10-digit mobile number.";
            message.style.color = "red";
            return;
        }

        if (password.length < 6) {
            message.innerText = "Password must have at least 6 characters.";
            message.style.color = "red";
            return;
        }

        if (password !== confirmPassword) {
            message.innerText = "Passwords do not match.";
            message.style.color = "red";
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        let existing = users.find(function(user) {
            return user.email === email;
        });

        if (existing) {
            message.innerText = "Email already registered.";
            message.style.color = "red";
            return;
        }

        let user = {
            role: role,
            name: name,
            email: email,
            mobile: mobile,
            password: password
        };

        users.push(user);

        localStorage.setItem("users", JSON.stringify(users));

        message.innerText = "Registration successful!";
        message.style.color = "green";

        registerForm.reset();

        setTimeout(function() {
            window.location.href = "login.html";
        }, 1000);
    });
}


/* LOGIN */

let loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let role = document.getElementById("loginRole").value;
        let email = document.getElementById("loginEmail").value.trim();
        let password = document.getElementById("loginPassword").value;

        let message = document.getElementById("loginMessage");

        let users = JSON.parse(localStorage.getItem("users")) || [];

        let user = users.find(function(item) {

            return item.role === role &&
                   item.email === email &&
                   item.password === password;

        });

        if (!user) {

            message.innerText =
                "Invalid role, email or password.";

            message.style.color = "red";

            return;
        }

        localStorage.setItem(
            "loggedUser",
            JSON.stringify(user)
        );

        window.location.href = "dashboard.html";

    });
}


/* DASHBOARD */

if (window.location.pathname.includes("dashboard.html")) {

    let user =
        JSON.parse(localStorage.getItem("loggedUser"));

    if (!user) {

        window.location.href = "login.html";

    } else {

        document.getElementById("welcome").innerText =
            "Welcome, " + user.name;

        document.getElementById("role").innerText =
            "Role: " + user.role;


        if (user.role === "user") {
            document.getElementById("userSection").style.display = "block";
            displayReports();
        }

        if (user.role === "volunteer") {
            document.getElementById("volunteerSection").style.display = "block";
        }

        if (user.role === "admin") {
            document.getElementById("adminSection").style.display = "block";
        }
    }
}


/* USER - REPORT DISASTER */

let reportForm = document.getElementById("reportForm");

if (reportForm) {

    reportForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let reports =
            JSON.parse(localStorage.getItem("reports")) || [];

        let report = {

            type: document.getElementById("disasterType").value,
            location: document.getElementById("location").value,
            details: document.getElementById("details").value,
            status: "Reported"

        };

        reports.push(report);

        localStorage.setItem(
            "reports",
            JSON.stringify(reports)
        );

        document.getElementById("reportMessage").innerText =
            "Disaster reported successfully.";

        document.getElementById("reportMessage").style.color =
            "green";

        reportForm.reset();

        displayReports();
    });
}


/* USER - REQUEST HELP */

let helpForm = document.getElementById("helpForm");

if (helpForm) {

    helpForm.addEventListener("submit", function(event) {

        event.preventDefault();

        document.getElementById("helpMessage").innerText =
            "Help request submitted successfully.";

        document.getElementById("helpMessage").style.color =
            "green";

        helpForm.reset();
    });
}


/* DISPLAY REPORTS */

function displayReports() {

    let box = document.getElementById("reports");

    if (!box) {
        return;
    }

    let reports =
        JSON.parse(localStorage.getItem("reports")) || [];

    if (reports.length === 0) {
        box.innerText = "No reports available.";
        return;
    }

    box.innerHTML = "";

    reports.forEach(function(report, index) {

        box.innerHTML += `
            <div class="card">
                <b>Report ${index + 1}</b>
                <p>Disaster: ${report.type}</p>
                <p>Location: ${report.location}</p>
                <p>Details: ${report.details}</p>
                <p>Status: ${report.status}</p>
            </div>
        `;

    });
}


/* VOLUNTEER */

function showMessage(message) {

    document.getElementById("volunteerMessage").innerText =
        message;

}


/* ADMIN - REPORTS */

function showAdminReports() {

    let reports =
        JSON.parse(localStorage.getItem("reports")) || [];

    let box =
        document.getElementById("adminInfo");

    if (reports.length === 0) {

        box.innerText = "No disaster reports available.";

        return;
    }

    box.innerHTML = "";

    reports.forEach(function(report, index) {

        box.innerHTML += `
            <div class="card">
                <b>Report ${index + 1}</b>
                <p>Disaster: ${report.type}</p>
                <p>Location: ${report.location}</p>
                <p>Details: ${report.details}</p>
                <p>Status: ${report.status}</p>
            </div>
        `;

    });
}


/* ADMIN - VOLUNTEERS */

function showVolunteers() {

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    let volunteers =
        users.filter(function(user) {
            return user.role === "volunteer";
        });

    let box =
        document.getElementById("adminInfo");

    if (volunteers.length === 0) {

        box.innerText = "No volunteers registered.";

        return;
    }

    box.innerHTML = "<h3>Registered Volunteers</h3>";

    volunteers.forEach(function(volunteer) {

        box.innerHTML += `
            <p>
                Name: ${volunteer.name}<br>
                Email: ${volunteer.email}<br>
                Mobile: ${volunteer.mobile}
            </p>
            <hr>
        `;

    });
}


/* ADMIN - STATUS */

function updateStatus() {

    let reports =
        JSON.parse(localStorage.getItem("reports")) || [];

    if (reports.length === 0) {

        document.getElementById("adminInfo").innerText =
            "No disaster reports available.";

        return;
    }

    let status =
        document.getElementById("status").value;

    reports[reports.length - 1].status = status;

    localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    );

    document.getElementById("adminInfo").innerText =
        "Latest disaster status updated to: " + status;
}


/* LOGOUT */

function logout() {

    localStorage.removeItem("loggedUser");

    window.location.href = "index.html";
}

