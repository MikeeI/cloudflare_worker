addEventListener('fetch', function (event) {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const origin_base = 'https://feed.oddjobsman.me/debug';

    const newRequestInit = {
    };

    const cloudflare_url = new URL(request.url);
    const {
        searchParams,
        pathname,
        search
    } = cloudflare_url;

    // Best practice is to always use the original request to construct the new request
    // to clone all the attributes. Applying the URL also requires a constructor
    // since once a Request has been constructed, its URL is immutable.
    //const newRequest = new Request(new_url.toString(), new Request(request, newRequestInit));

    if (pathname == '/redirect') {
        var origin_url = origin_base + pathname + search;
        const newRequest = new Request(origin_url, new Request(request, newRequestInit));
        try {
            return await fetch(newRequest);
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    if (pathname != "/") {
        var origin_url = origin_base + pathname + search;
        const newRequest = new Request(origin_url, new Request(request, newRequestInit));
        try {
            let response = await fetch(newRequest);
            return response;
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    var origin_url = origin_base + "/feed_worker.php";
    const newRequest = new Request(origin_url, new Request(request, newRequestInit));
    try {
        return await fetch(newRequest);
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

function MethodNotAllowed(request) {
    return new Response(`Method ${request.method} not allowed.`, {
        status: 405,
        headers: {
            Allow: 'GET',
        },
    });
}