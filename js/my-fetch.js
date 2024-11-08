const myFetch = async (url, method = 'GET', headers = {}) => {
    try {
        const res = await fetch(url, {
            ...headers,
            method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await res.json();

        if (!res.ok)
            throw new Error({ status: res.status, message: data.error.message });

        return { status: res.statusCode, data };
    } catch (error) {
        throw error;
    }
}