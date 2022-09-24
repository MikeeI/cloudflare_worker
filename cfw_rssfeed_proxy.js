addEventListener('fetch', function(event) {
    event.respondWith(handleRequest(event.request));
});
async function handleRequest(request) {
    const origin_base = 'https://feed.oddjobsman.me/programmableweb';
    const url = new URL(request.url);
    const {
        searchParams
    } = url;


    const {
        pathname,
        search
    } = url;


    console.log(pathname);
    console.log(search);
    var origin_url = origin_base + "/feed_worker.php";
    if (pathname == '/redirect') {
        origin_url = origin_base + pathname + search;
        console.log(origin_url)
        fetch(origin_url, {
            headers: {
                'User-Agent': request.headers.get('user-agent')
            }
        });
        return Response.redirect(searchParams.get('url'), 302);
    }
    if (pathname != "/") {
        origin_url = origin_base + pathname + search;
        console.log(origin_url)
        fetch(origin_url, {
            headers: {
                'User-Agent': request.headers.get('user-agent')
            }
        });
        origin_url = origin_base + pathname
    }
    return fetch(origin_url, {
        headers: {
            'User-Agent': request.headers.get('user-agent')
        }
    });
}

function MethodNotAllowed(request) {
    return new Response(`Method ${request.method} not allowed.`, {
        status: 405,
        headers: {
            Allow: 'GET',
        },
    });
}
