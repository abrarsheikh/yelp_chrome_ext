var format = require('string-format');
format.extend(String.prototype);

var yelp_base_search_url = 'https://www.yelp.com/search?'

chrome.contextMenus.create({
    "title": "Yelp Me",
    "contexts": ["page", "selection", "image"],
    "onclick" : contextMenusClickHandler
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
        if(request.source == 'popup') {
            launch_yelp(create_url_from_find_location(
                request.y_find, request.y_location
            ), function(msg) {
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

//   navigator.geolocation.getCurrentPosition(function(position) {
//       var yelp_url = '{0}l={1}'.format(yelp_base_url, l_g);
//       window.open(yelp_url, '_blank')
//   }, function(positionError) {
//       console.error(positionError);
//   });