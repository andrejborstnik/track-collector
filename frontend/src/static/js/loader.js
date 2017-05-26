//
// FUNCTIONS
//


// Dynamically load a script.
function loadScript(src, callback) {
    console.debug("Loading-script:", src, "...");

    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;

    let success = function () {
        console.debug("Loaded-script:", src);
        callback();
    };

    let fail = function (e) {
        console.error("Error:", src, ":", e);
    };

    script.onreadystatechange = success;
    script.onload = success;
    script.onerror = fail;

    head.appendChild(script);
}

// // Dynamically load link.
// function loadLink(rel, href, callback) {
//     var head = document.getElementsByTagName('head')[0];
//     var link = document.createElement('link');
//     link.rel = rel;
//     link.href = href;
//     link.onreadystatechange = callback;
//     link.onload = callback;
//     head.appendChild(link);
//     console.debug("Loading-link:", href);
// }

function loadSeqOfScripts(urls_list) {
    let _script = function() {console.debug("All scripts have been loaded ...");}

    for (url of urls_list.reverse()) {
        _script = function(url, script) {
            return function() {
                loadScript('static/js/' + url, script);
            }
        }(url, _script);
    }

    // Run the chain.
    _script();
}

// Gets an XMLHttpRequest. For Internet Explorer 6, attempts to use MSXML 6.0,
// then falls back to MXSML 3.0.
// Returns null if the object could not be created.
// @return {XMLHttpRequest or equivalent ActiveXObject}
function getXHR() {
  if (window.XMLHttpRequest) {
    // Chrome, Firefox, IE7+, Opera, Safari
    return new XMLHttpRequest();
  }
  // IE6
  try {
    return new ActiveXObject('MSXML2.XMLHTTP.6.0');
  } catch (e) {
    try {
      // The fallback.
      return new ActiveXObject('MSXML2.XMLHTTP.3.0');
    } catch (e) {
      return null;
    }
  }
}

// A HTTP get request.
function httpGetAsync(theUrl, callback)
{
    let xmlHttp = getXHR();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}


//
// MAIN
//


// Load CSS.
// loadLink("stylesheet", "<frontend-css-bundle>", function() {});

loadScript("static/vendor/jquery/dist/jquery.min.js", function () {
    let scripts = <frontend-scripts-array>;
    scripts.push('static/js/<main-application-file>');
    loadSeqOfScripts(scripts);
});
