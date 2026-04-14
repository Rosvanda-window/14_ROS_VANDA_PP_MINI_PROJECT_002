import headerToken from "../lib/headerToken"

export async function getAllCategories() {
    try {
        const headers = await headerToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`, {
            method: 'GET',
            headers: headers,
            cache: 'no-store'
        });
        const res = await response.json();
        
        return res.payload || res.data || []; 
        
    } catch (error) {
        console.error("Error fetching categories:", error);
        return []; 
    }
}