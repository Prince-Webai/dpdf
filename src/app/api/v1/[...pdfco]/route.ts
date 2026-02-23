import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// This is the main proxy handler for all PDF.co API routes
// Users call: https://docunexu.com/api/v1/pdf/convert/to/json
// We proxy: https://api.pdf.co/v1/pdf/convert/to/json

const PDFCO_BASE_URL = "https://api.pdf.co/v1";

async function proxyRequest(req: NextRequest, { params }: { params: Promise<{ pdfco: string[] }> }) {
    try {
        const authHeader = req.headers.get("authorization");

        // 1. Authenticate the User's API Key
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
        }

        const userApiKey = authHeader.split(" ")[1];

        // 2. Securely check `userApiKey` against Supabase
        const cookieStore = cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    async getAll() {
                        return (await cookieStore).getAll()
                    },
                    async setAll(cookiesToSet) {
                        try {
                            const store = await cookieStore;
                            cookiesToSet.forEach(({ name, value, options }) =>
                                store.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )

        // Use the secure RPC function to bypass RLS since the proxy request might not have a session cookie
        const { data: keyData, error: keyError } = await supabase
            .rpc('validate_api_key', { input_key: userApiKey })

        if (keyError || !keyData || keyData.length === 0) {
            return NextResponse.json({ error: "Invalid DocuNexu API Key" }, { status: 401 });
        }

        const { user_id, is_active } = keyData[0];

        if (!is_active) {
            return NextResponse.json({ error: "This API Key has been deactivated" }, { status: 403 });
        }

        // 2. Build the target URL
        const routeParams = await params;
        const path = routeParams.pdfco.join("/");
        const searchParams = req.nextUrl.search;
        const targetUrl = `${PDFCO_BASE_URL}/${path}${searchParams}`;

        // 3. Prepare the headers for the PDF.co request
        const pdfcoApiKey = process.env.PDFCO_MASTER_API_KEY;

        if (!pdfcoApiKey) {
            console.error("PDFCO_MASTER_API_KEY is not configured on the server.");
            return NextResponse.json({ error: "Internal Server Error: Missing upstream configuration" }, { status: 500 });
        }

        const headers = new Headers();
        headers.set("x-api-key", pdfcoApiKey);

        const contentType = req.headers.get("content-type");
        // We ONLY set the content-type if it's NOT multipart/form-data.
        // For FormData, the fetch API automatically sets the correct Content-Type with the necessary boundary.
        if (contentType && !contentType.includes("multipart/form-data")) {
            headers.set("content-type", contentType);
        }

        // 4. Extract body if necessary
        let body: any = null;
        if (req.method !== "GET" && req.method !== "HEAD") {
            if (contentType?.includes("multipart/form-data")) {
                // Reconstruct FormData for clean passing
                const reqFormData = await req.formData();
                const newFormData = new FormData();
                reqFormData.forEach((value, key) => {
                    newFormData.append(key, value);
                });
                body = newFormData;
            } else if (contentType?.includes("application/json")) {
                const text = await req.text();
                body = text ? text : null;
            } else {
                const buffer = await req.arrayBuffer();
                body = buffer;
            }
        }

        // 5. Proxy the request to PDF.co
        const proxyResponse = await fetch(targetUrl, {
            method: req.method,
            headers: headers,
            body: body,
            // Pass along cache control or other necessary options
        });

        // 6. Return the PDF.co response exactly as it is received
        const responseHeaders = new Headers(proxyResponse.headers);
        // Explicitly prevent sending back our upstream API key if somehow it was echoed
        responseHeaders.delete('x-api-key');

        // Return blob for binary data, or text/json
        const responseBuffer = await proxyResponse.arrayBuffer();

        return new NextResponse(responseBuffer, {
            status: proxyResponse.status,
            statusText: proxyResponse.statusText,
            headers: responseHeaders
        });

    } catch (error: any) {
        console.error("DocuNexu Proxy Error:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}

export async function GET(req: NextRequest, props: { params: Promise<{ pdfco: string[] }> }) {
    return proxyRequest(req, props);
}

export async function POST(req: NextRequest, props: { params: Promise<{ pdfco: string[] }> }) {
    return proxyRequest(req, props);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ pdfco: string[] }> }) {
    return proxyRequest(req, props);
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ pdfco: string[] }> }) {
    return proxyRequest(req, props);
}
