export async function checkToken(redirect=true): Promise<boolean> {

    if(!redirect) {
        const response = await fetch("/api/auth", {
            headers: {
                authorization: "Bearer " + localStorage.getItem("token")
            }
        });

        return response.ok;
    }
    const response = await fetch("/api/auth", {
        headers: {
            authorization: "Bearer " + localStorage.getItem("token")
        }
    });

    if(response.ok) {
        return true;
    } else {
        window.location.href = "/auth";

        return false;
    }
}
