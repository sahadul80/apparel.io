import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
    try {
        // Resolve the path to the JSON file in the public folder
        const filePath = path.join(process.cwd(), 'public', 'products.json');
        // Read the file asynchronously
        const data = await fs.readFile(filePath, 'utf8');
        // Parse the JSON data
        const products = JSON.parse(data);

        // Return the JSON data as a response
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return NextResponse.json(
            { message: 'Failed to load products data' },
            { status: 500 }
        );
    }
}
