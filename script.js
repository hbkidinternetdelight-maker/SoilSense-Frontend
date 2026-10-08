/* =========================================================
   SOILSENSE AUTHENTICATION
   ========================================================= */

const AUTH_BASE = API_BASE.replace(/\/+$/, "");

function showLoginForm() {
    const login = document.getElementById("loginForm");
    const register = document.getElementById("registerForm");

    if (login) login.classList.remove("hidden");
    if (register) register.classList.add("hidden");

    const a = document.getElementById("loginMessage");
    const b = document.getElementById("registerMessage");

    if (a) a.textContent = "";
    if (b) b.textContent = "";
}

function showRegisterForm() {
    const login = document.getElementById("loginForm");
    const register = document.getElementById("registerForm");

    if (login) login.classList.add("hidden");
    if (register) register.classList.remove("hidden");

    const a = document.getElementById("loginMessage");
    const b = document.getElementById("registerMessage");

    if (a) a.textContent = "";
    if (b) b.textContent = "";
}

function showAuthMessage(id, message, success = false) {
    const el = document.getElementById(id);

    if (!el) return;

    el.textContent = message;
    el.classList.toggle("success", success);
    el.classList.toggle("error", !success);
}

function enterSoilSenseAfterAuth() {
    const authPage = document.getElementById("authPage");
    const languagePage = document.getElementById("languagePage");

    if (authPage) {
        authPage.classList.add("hidden");
    }

    if (languagePage) {
        languagePage.classList.remove("hidden");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ================================
   CREATE ACCOUNT
================================ */

async function registerUser() {

    const name =
        document.getElementById("registerName")?.value.trim();

    const email =
        document.getElementById("registerEmail")?.value.trim();

    const password =
        document.getElementById("registerPassword")?.value;

    const confirm =
        document.getElementById("registerConfirm")?.value;


    if (!name || !email || !password || !confirm) {

        showAuthMessage(
            "registerMessage",
            "Please fill in all fields."
        );

        return;
    }


    if (password.length < 8) {

        showAuthMessage(
            "registerMessage",
            "Password must be at least 8 characters."
        );

        return;
    }


    if (password !== confirm) {

        showAuthMessage(
            "registerMessage",
            "Passwords do not match."
        );

        return;
    }


    showAuthMessage(
        "registerMessage",
        "Creating your account..."
    );


    try {

        const response = await fetch(
            `${AUTH_BASE}/api/auth/register`,
            {
                method: "POST",

                credentials: "include",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );


        const data =
            await response.json().catch(() => ({}));


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to create account."
            );
        }


        showAuthMessage(
            "registerMessage",
            "Account created successfully.",
            true
        );


        setTimeout(
            enterSoilSenseAfterAuth,
            300
        );


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        showAuthMessage(
            "registerMessage",
            error.message ||
            "Unable to create account."
        );
    }
}


/* ================================
   LOGIN
================================ */

async function loginUser() {

    const email =
        document.getElementById("loginEmail")?.value.trim();

    const password =
        document.getElementById("loginPassword")?.value;


    if (!email || !password) {

        showAuthMessage(
            "loginMessage",
            "Please enter your email and password."
        );

        return;
    }


    showAuthMessage(
        "loginMessage",
        "Logging in..."
    );


    try {

        const response = await fetch(
            `${AUTH_BASE}/api/auth/login`,
            {
                method: "POST",

                credentials: "include",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data =
            await response.json().catch(() => ({}));


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Invalid email or password."
            );
        }


        showAuthMessage(
            "loginMessage",
            "Login successful.",
            true
        );


        setTimeout(
            enterSoilSenseAfterAuth,
            300
        );


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        showAuthMessage(
            "loginMessage",
            error.message ||
            "Unable to log in."
        );
    }
}


/* ================================
   GOOGLE LOGIN
================================ */

function continueWithGoogle() {

    window.location.href =
        `${AUTH_BASE}/api/auth/google`;
}


/* ================================
   CHECK EXISTING LOGIN
================================ */

async function checkExistingAuth() {

    try {

        const response = await fetch(
            `${AUTH_BASE}/api/auth/me`,
            {
                credentials: "include",
                cache: "no-store"
            }
        );


        if (response.ok) {

            const data =
                await response.json();


            if (data.success) {

                enterSoilSenseAfterAuth();
            }
        }


    } catch (error) {

        console.log(
            "No active SoilSense session."
        );
    }
}


/* ================================
   AUTH INITIALIZATION
================================ */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        checkExistingAuth();

    }
);