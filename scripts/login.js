const form = document.getElementById("formularioLogin");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const duracaoInput = document.getElementById("duracaoSessao");
    const duracaoMinutos = duracaoInput ? parseInt(duracaoInput.value) : 60;

    try {
        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: usuario,
                password: senha
            })
        });

        const data = await response.json();

        if (response.ok) {
            const duracaoMs = duracaoMinutos * 60 * 1000;
            const expiresAt = Date.now() + duracaoMs;

            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("expiresAt", expiresAt.toString());

            window.location.href = "posts.html";
        } else {
            document.getElementById("mensagemErro").textContent = data.message || "Erro ao autenticar.";
        }
    } catch (error) {
        document.getElementById("mensagemErro").textContent = "Erro na conexão com o servidor.";
        console.error("Erro no login:", error);
    }
});
