export async function checkToken(redirect=true): Promise<boolean | undefined> {

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
        return
    } else {
        window.location.href = "/auth";
    }
}
