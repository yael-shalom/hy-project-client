const myFetch = async (url, method = 'GET', options = { headers: {} }) => {
    try {
        const res = await fetch(url, {
            ...options,
            method,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await res.json();

        if (!res.ok)
            throw new Error({ ok: res.ok, status: res.status, message: data.error.message });

        return { ok: res.ok, status: res.status, data };
    } catch (error) {
        throw error;
    }
}