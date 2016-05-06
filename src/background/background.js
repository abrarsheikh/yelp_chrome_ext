var format = require('string-format');
format.extend(String.prototype);


var yelp_base_search_url = 'https://www.yelp.com/search?';
var yelp_search_suggest_url = 'https://www.yelp.com.au/search_suggest/prefetch?loc={0}&prefix={1}';

chrome.contextMenus.create({
    "title": "Yelp Me",
    "contexts": ["page", "selection", "image"],
    "onclick": contextMenusClickHandler
});

function contextMenusClickHandler(e) {
    var url = e.pageUrl;
    if (e.selectionText) {
        // The user selected some text, put this in the message.
        var selected_text = e.selectionText.trim();
        launch_yelp(create_url_from_find_location(
            selected_text
        ), function (msg) {
            sendResponse(msg);
        });
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.source == 'popup') {
            launch_yelp(create_url_from_find_location(
                request.y_find, request.y_location
            ), function (msg) {
                console.log(msg);
            });
        }
    });

function create_url_from_find(y_find) {
    return '{0}find_desc={1}'.format(yelp_base_search_url, y_find);
}

function create_url_from_find_location(y_find, y_location) {
    return '{0}find_desc={1}&find_loc={2}'.format(yelp_base_search_url, y_find, y_location);
}

function launch_yelp(url, callback) {
    chrome.tabs.create({
            url: url
        },
        function (tab) {
            callback({
                status: 'OK',
                message: 'created new tab with url : {0}'.format(url),
                tab: tab
            });
        }
    );
}

var currentRequest = null;

chrome.omnibox.onInputChanged.addListener(
    function (text, suggest) {
        if (currentRequest != null) {
            currentRequest.onreadystatechange = null;
            currentRequest.abort();
            currentRequest = null;
        }

        updateDefaultSuggestion(text);
        if (text == '' || text == 'halp')
            return;

        currentRequest = search(text, function (res) {
            var results = [];
            var suggestions = res.suggestions;
            for (var suggestion_key in suggestions) {
                var suggestion = suggestions[suggestion_key];
                if (suggestion.hasOwnProperty('typeahead') &&
                    suggestion.typeahead != null &&
                    suggestion.typeahead.hasOwnProperty('typeahead_text') &&
                    suggestion.typeahead.typeahead_text != null &&
                    suggestion.typeahead.typeahead_text != "") {
                    results.push({
                        content: create_url_from_find_location(suggestion.typeahead.typeahead_text),
                        description: suggestion.typeahead.typeahead_text
                    });
                }
            }
            suggest(results);
        });
    }
);

function resetDefaultSuggestion() {
    chrome.omnibox.setDefaultSuggestion({
        description: '<url><match>src:</match></url> Search Chromium source'
    });
}

resetDefaultSuggestion();

function updateDefaultSuggestion(text) {
    var isRegex = /^re:/.test(text);
    var isFile = /^file:/.test(text);
    var isHalp = (text == 'halp');
    var isPlaintext = text.length && !isRegex && !isFile && !isHalp;

    var description = '<match><url>src</url></match><dim> [</dim>';
    description +=
        isPlaintext ? ('<match>' + text + '</match>') : 'plaintext-search';
    description += '<dim> | </dim>';
    description += isRegex ? ('<match>' + text + '</match>') : 're:regex-search';
    description += '<dim> | </dim>';
    description += isFile ? ('<match>' + text + '</match>') : 'file:filename';
    description += '<dim> | </dim>';
    description += isHalp ? '<match>halp</match>' : 'halp';
    description += '<dim> ]</dim>';

    chrome.omnibox.setDefaultSuggestion({
        description: description
    });
}

chrome.omnibox.onInputStarted.addListener(function () {
    updateDefaultSuggestion('');
});

chrome.omnibox.onInputCancelled.addListener(function () {
    resetDefaultSuggestion();
});

function search(query, callback) {
    var url = yelp_search_suggest_url.format('', query);
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            callback(JSON.parse(req.responseText));
        }
    }
    req.send(null);
}

function navigate(url) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.update(tabs[0].id, {url: url});
    });
}

chrome.omnibox.onInputEntered.addListener(function (text) {
    launch_yelp(text)
});
