
export async function GET(Request: Request) {
    const response = await fetch('https://api.vercel.app/products');
    const products = await response.json();
    return Response.json(products);
}