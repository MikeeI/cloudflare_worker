const DATADOG_API_KEY = '45814898a6681cc7e7e10086d3cae350'
const SITE_NAME = 'spodcast'
const DATADOG_API_URL = 'https://api.datadoghq.com/api/v1/series?api_key=' + DATADOG_API_KEY

function parse_http_header(request_headers) {
    let headers = {}
    let keys = new Map(request_headers).keys()
    let key
    while ((key = keys.next().value)) {
        headers[key] = request_headers.get(key)
    }

    for (const [key, value] of Object.entries(headers)) {
        console.log(key + " : " + value);
        if (key == "user-agent") {
            submitMetricDatadog('request_headers', value, true, key)
        }

    }

    return headers
}

function sanitizeDatadogString(string) {
    //string = string.replace(/\?/g, ':')
    //string = string.replace(/\=/g, '_')
    //string = string.replace(/\//g, '_')
    //string = string.replace(/[\W_]+/g,"_");
    if (string == "") {
        string = "empty"
    }
    string = string.replace(/[^a-zA-Z\d.]/g, '_')
    string = string.replace(/_+/g, '_')

    return string
}

async function submitMetricDatadog(
    metric_name,
    metric_value,
    metric_tag_enabled,
    metric_tag_name,
) {
    if (metric_name === undefined || metric_value === undefined) {
        return null
    } else {
        //String Sanitation
        metric_value = sanitizeDatadogString(metric_value)
        metric_name = sanitizeDatadogString(metric_name)

        secondsSinceEpoch = Math.round(new Date().getTime() / 1000)

        if (metric_tag_name == undefined) {
            tags = metric_name + ':' + metric_value
        } else {
            tags = metric_tag_name + ':' + metric_value
        }

        if (metric_tag_enabled == true) {
            body_json = JSON.stringify({
                series: [{
                    host: SITE_NAME,
                    metric: SITE_NAME + '.metric.' + metric_name,
                    points: [
                        [secondsSinceEpoch, '1']
                    ],
                    tags: tags,
                }, ],
            })
        } else {
            body_json = JSON.stringify({
                series: [{
                    host: SITE_NAME,
                    metric: SITE_NAME + '.metric.' + metric_name,
                    points: [
                        [secondsSinceEpoch, '1']
                    ],
                }, ],
            })
        }

        return await fetch(DATADOG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body_json,
        })
    }
}

addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event.request).catch(
            (err) => new Response(err.stack, {
                status: 500
            })
        )
    );
});

async function handleRequest(request) {
    const {
        pathname
    } = new URL(request.url);

    parse_http_header(request.headers)
    submitMetricDatadog('worker_called', '1', false)

    console.log(pathname)
    if (pathname == "/feed/4rOoJ6Egrf8K2IrywzwOMk.rss") {
        response = await fetch("https://spc.cdnly.eu/files/4rOoJ6Egrf8K2IrywzwOMk/index.rss");
        return response;
    }

    return new Response("")
}