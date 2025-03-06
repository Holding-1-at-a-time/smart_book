
export async function GET(Request: Request) {
    try {
        const response = await fetch('https://api.vercel.app/products');
        if (!response.ok) {
            return Response.json({ error: `API responded with status: ${response.status}` }, { status: response.status });
        }
        const products = await response.json();
        return Response.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}