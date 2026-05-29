const services = {};
const url = import.meta.env.VITE_BACKEND_URL;

services.auth = async (formData) => {
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

services.logout = () => {
    localStorage.removeItem("token");
};

services.getMe = async () => {
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

/* GET PRODUCTS */

services.getProducts = async () => {
    try {
        const resp = await fetch(`${url}/api/products`);

        if (!resp.ok) {
            throw new Error("Something went wrong");
        }

        const data = await resp.json();

        return data.results || data;

    } catch (error) {
        console.error("getProducts error", error);
        return [];
    }
};

/* IS SUBSCRIPTION ACTIVE */

services.isActive = async () => {
    try {
        const resp = await fetch(url + "/api/subscription/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        });

        const data = await resp.json();
        console.log("isActive response:", data);
        localStorage.setItem("subIsActive", JSON.stringify(data))
        if (!resp.ok) {
            throw new Error(data.msg || "subscription error");
        }

        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
export default services;


/* GET SUBSCRIPTION PLANS */

services.getSubscriptions = async () => {
    try {
        const resp = await fetch(`${url}/api/subscription-plans`);

        if (!resp.ok) {
            throw new Error("Something went wrong");
        }

        const data = await resp.json();
        console.log(data)

        return data.results || data;

    } catch (error) {
        console.error("getSubscriptionPlans error", error);
        return [];
    }
};