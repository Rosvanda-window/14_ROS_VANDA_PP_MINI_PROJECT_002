import headerToken from "../lib/headerToken";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/products`;

export async function getProductsService() {
    try {
        const headers = await headerToken();
        const response = await fetch(BASE_URL, {
            method: 'GET',
            headers: headers,
            cache: 'no-store'
        });
        const res = await response.json();
        return res.payload || res.data || []; 
    } catch (error) {
        console.error("Fetch Error:", error);
        return []; 
    }
}

export async function createProductService(productData) {
    const headers = await headerToken();
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return await res.json();
}

export async function updateProductService(id, productData) {
    const headers = await headerToken();
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return await res.json();
}

export async function deleteProductService(id) {
    const headers = await headerToken();
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: headers,
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return true;
}