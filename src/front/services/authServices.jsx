const authService = {};
const url = import.meta.env.VITE_BACKEND_URL;

authService.auth = async (formData) => {
    try {
        const resp = await fetch(url + "/api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),

        });

        const text = await resp.text();
        console.log(text)

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            throw new Error("Respuesta del backend no es JSON");
        }

        if (!resp.ok) {
            throw new Error(data.data || "error auth");
        }

        if (data.token) localStorage.setItem("token", data.token);

        return data;
    } catch (error) {
        console.log("ERROR:", error);
        throw error;
    }
};

authService.logout = () => {
    localStorage.removeItem("token");
};

authService.getMe = async () => {
    try {
        const resp = await fetch(url + "/api/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        });
        if (!resp.ok) throw new Error("error auth");
        const data = await resp.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export default authService;