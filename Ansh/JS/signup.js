const form = document.getElementById("signup-form");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, password2 })
        });

        if (response.ok) {
            window.location.href = "home.html";
        } else {
            const errorMessage = await response.text();
            alert(errorMessage || 'An error occurred');
        }
    } catch (error) {
        console.error('Error creating user:', error);
        alert('An error occurred');
    }
});
