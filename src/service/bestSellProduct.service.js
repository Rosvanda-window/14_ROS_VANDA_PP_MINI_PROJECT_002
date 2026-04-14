import headerToken from "../lib/headerToken"

export async function getTopSell() {
    try {
        const headers = await headerToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/top-selling`, {
            method: 'GET',
            headers: headers,
            cache: 'no-store'
        });
        const res = await response.json();
        
        return res.payload || res.data || []; 
        
    } catch (error) {
        console.error("Error fetching products:", error);
        return []; 
    }
}