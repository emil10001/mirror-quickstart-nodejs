var express = require('express'),
    app = express(),
    ejs = require('ejs'),
    fs = require('fs'),
    http = require('http'),
    mirror = require('mirror-utils'),
    authUtils = new mirror.Auth(),
    ClientManager = require('./client_manager'),
    clientManager = new ClientManager(),
    TimelineHelper = require('./timeline'),
// https://github.com/expressjs/cookies
    Cookies = require("cookies"),
// https://github.com/expressjs/keygrip
    Keygrip = require("keygrip"),
    keys = Keygrip(["SEKRIT2", "SEKRIT1"]),
    bodyParser = require('body-parser');


app.set('port', 8444);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // to support URL-encoded bodies

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.ejs').
app.set('view engine', 'ejs');

app.set('views', __dirname + '/public');

function failure(data) {
    console.log('falure', data);
}
function success(data) {
    console.log('success', data);
}

var PAGINATED_HTML =
    "<article class='auto-paginate'>"
    + "<h2 class='blue text-large'>Did you know...?</h2>"
    + "<p>Cats are <em class='yellow'>solar-powered.</em> The time they spend napping in "
    + "direct sunlight is necessary to regenerate their internal batteries. Cats that do not "
    + "receive sufficient charge may exhibit the following symptoms: lethargy, "
    + "irritability, and disdainful glares. Cats will reactivate on their own automatically "
    + "after a complete charge cycle; it is recommended that they be left undisturbed during "
    + "this process to maximize your enjoyment of your cat.</p><br/><p>"
    + "For more cat maintenance tips, tap to view the website!</p>"
    + "</article>";

function insertCard(userId, card) {
    var client = clientManager.get(userId).client,
        oauth2Client = clientManager.get(userId).oauth2Client;

    if (!!!client || !!!oauth2Client) {
        failure("no client or no oauth2Client");
        return;
    }

    new TimelineHelper(oauth2Client, client).insert(card, failure, success);
}

function insertItem(userId, req, res) {
    var currentdate = new Date();
    var cardId = currentdate + "0",
        mediaId = currentdate + "1";

    var message = req.body.message,
        imageUrl = req.body.imageUrl,
        contentType = req.body.contentType;

    var card = new mirror.Card()
        .id(cardId)
        .title("node quick start");
    if (!!message)
        card.text(message);

    if (!!imageUrl && !!contentType) {
        var attachment = new mirror.Attachments()
            .id(mediaId)
            .contentUrl(imageUrl)
            .contentType(contentType)
            .isProcessingContent(false)
            .build();
        card.addAttachment(attachment);
    }

    insertCard(userId, card.build());
}

function deleteTimelineItem(userId, req, res) {
    var itemId = req.body.itemId;

    var client = clientManager.get(userId).client,
        oauth2Client = clientManager.get(userId).oauth2Client;

    if (!!!client || !!!oauth2Client) {
        failure("no client or no oauth2Client");
        return;
    }

    new TimelineHelper(oauth2Client, client).delete(itemId, failure, success);
}

function insertPaginatedItem(userId, req, res) {
    var currentdate = new Date();
    var cardId = currentdate + "0";

    var card = new mirror.Card()
        .id(cardId)
        .title("node quick start")
        .html(PAGINATED_HTML)
        .build();

    insertCard(userId, card);
}

function insertItemWithAction(userId, req, res) {
    var currentdate = new Date();
    var cardId = currentdate + "0";

    var menu = new mirror.Menu()
        .buildSimpleDefault()
        .build();

    var card = new mirror.Card()
        .id(cardId)
        .title("node quick start")
        .text("card with action")
        .menus(menu)
        .build();

    insertCard(userId, card);
}

function insertItemAllUsers(req, res) {
    for (var userId in clientManager.users()) {
        var currentdate = new Date();
        var cardId = currentdate + "0";

        var menu = new mirror.Menu()
            .buildSimpleDefault()
            .build();

        var card = new mirror.Card()
            .id(cardId)
            .text("all users get this")
            .title("node quick start")
            .menus(menu)
            .build();

        insertCard(userId, card);
    }
}

function insertContact(userId, req, res) {
    var contactId = req.body.id,
        iconUrl = req.body.iconUrl,
        name = req.body.name;

    var contact = new mirror.Contacts()
        .buildContact(contactId, name, iconUrl);

    var client = clientManager.get(userId).client,
        oauth2Client = clientManager.get(userId).oauth2Client;

    if (!!!client || !!!oauth2Client) {
        failure("no client or no oauth2Client");
        return;
    }

    contact['auth'] = oauth2Client;

    client.contacts.insert(contact,
        function (err, data) {
            if (!!err)
                failure(err);
            else
                success(data);
        });
}

function deleteContact(userId, req, res) {
    var contactId = req.body.id;

    var client = clientManager.get(userId).client,
        oauth2Client = clientManager.get(userId).oauth2Client;

    if (!!!client || !!!oauth2Client) {
        failure("no client or no oauth2Client");
        return;
    }

    client
        .mirror.contacts.delete({
            id: contactId,
            auth: oauth2Client
        },
        function (err, data) {
            if (!!err)
                failure(err);
            else
                success(data);
        });

}

function deleteSubscription(userId, req, res) {
    var subscriptionId = req.body.subscriptionId;

    var client = clientManager.get(userId).client,
        oauth2Client = clientManager.get(userId).oauth2Client;

    if (!!!client || !!!oauth2Client) {
        failure("no client or no oauth2Client");
        return;
    }
    console.log('attempting to delete subscription', subscriptionId);

    clientsubscriptions.delete({
            id: subscriptionId,
            auth: oauth2Client
        },
        function (err, data) {
            if (!!err)
                failure(err);
            else
                success(data);
        });
}

function insertSubscription(userId, req, res) {
    var subscriptionId = req.body.collection;

    var subscription = new mirror.Subscription()
        .collection(subscriptionId)
        .callbackUrl('https://' + req.get('host') + '/notify')
        .operation(['UPDATE', 'INSERT', 'DELETE']);

    var client = clientManager.get(userId).client,
        oauth2Client = clientManager.get(userId).oauth2Client;

    if (!!!client || !!!oauth2Client) {
        failure("no client or no oauth2Client");
        return;
    }
    console.log('attempting to insert subscription', subscription.build());

    var params = subscription.build();
    params['auth'] = oauth2Client;

    client.subscriptions.insert(params,
        function (err, data) {
            if (!!err)
                failure(err);
            else
                success(data);
        });
}

app.post('/', function (req, res) {
    var operation = req.body.operation;

    var cookies = new Cookies(req, res, keys);
    var userId = cookies.get("user_id");
    if (!!!userId || !!!clientManager.get(userId)) {
        console.log("This user has not been authenticated", clientManager.get(userId));
        authUtils.install(req, res);
        return;
    }

    switch (operation) {
        case "insertItem":
            insertItem(userId, req, res);
            break;
        case "insertPaginatedItem":
            insertPaginatedItem(userId, req, res);
            break;
        case "insertItemWithAction":
            insertItemWithAction(userId, req, res);
            break;
        case "insertItemAllUsers":
            insertItemAllUsers(req, res);
            break;
        case "insertContact":
            insertContact(userId, req, res);
            break;
        case "deleteContact":
            deleteContact(userId, req, res);
            break;
        case "deleteSubscription":
            deleteSubscription(userId, req, res);
            break;
        case "insertSubscription":
            insertSubscription(userId, req, res);
            break;
        case "deleteTimelineItem":
            deleteTimelineItem(userId, req, res);
            break;
    }
    res.redirect('/');
    res.end();
});
app.post('/notify', function (req, res) {
    console.log('post notified', req);
});

app.get('/notify', function (req, res) {
    console.log('get notified', req);
});

function tryRender(params, asyncRequests, res) {
    if (!!asyncRequests.timeline_items && !!asyncRequests.subscriptions) {
        console.log("render", params);
        res.render('index', params);
        res.end();
    }
}

app.get('/', function (req, res) {
    var cookies = new Cookies(req, res, keys);
    var userId = cookies.get("user_id");
    if (!!!userId || !!!clientManager.get(userId)) {
        console.log("This user has not been authenticated, no userId");
        authUtils.install(req, res);
        return;
    }

    var client = clientManager.get(userId).mirror,
        oauth2Client = clientManager.get(userId).oauth2Client;

    if (!!!client || !!!oauth2Client) {
        console.log("This user has not been authenticated, no cached objects");
        authUtils.install(req, res);
        return;
    }

    var params = {
        timeline_items: [],
        timeline_subscription: {},
        location_subscription: {},
        appbase_url: 'https://' + req.get('host'),
        contact_id: "3rn2-rnoi2",
        contact_name: "Herbert Shoe"
    };

    var asyncRequests = {
        timeline_items: false,
        subscriptions: false
    };

    new TimelineHelper(oauth2Client, client).listTimeline(function (err) {
        console.log("couldn't get timeline items", err);
        asyncRequests.timeline_items = true;
        asyncRequests.subscriptions = true;
        tryRender(params, asyncRequests, res);
    }, function (timelineItems) {
        params.timeline_items = timelineItems.items;
        console.log("got timeline items");
        asyncRequests.timeline_items = true;
        client.subscriptions.list({
                auth: oauth2Client
            },
            function (err, data) {
                if (!!err) {
                    console.log("couldn't get subscriptions", err);
                    asyncRequests.subscriptions = true;
                    tryRender(params, asyncRequests, res);
                } else {
                    if (!!data && !!data.items) {
                        for (var i = 0; i < data.items.length; i++) {
                            if ("timeline" === data.items[i].collection)
                                params.timeline_subscription = data.items[i]
                            else if ("location" === data.items[i].collection)
                                params.location_subscription = data.items[i]
                        }
                    }
                    console.log("got subscriptions", params.timeline_subscription, params.location_subscription);
                    asyncRequests.subscriptions = true;
                    tryRender(params, asyncRequests, res);
                }
            });
    });


});
app.get('/install', function (req, res) {
    var cookies = new Cookies(req, res, keys);
    var userId = cookies.get("user_id");
    if (!!userId && !!clientManager.get(userId)) {
        console.log("This user has been authenticated", clientManager.get(userId));
        res.redirect('/');
        res.end();
    } else
        authUtils.install(req, res);
});
app.get('/oauth2callback', function (req, res) {
    var cookies = new Cookies(req, res, keys);
    console.log('oauth2callback');
    // if we're able to grab the token, redirect the user back to the main page
    authUtils.getToken(req.query.code, function (data) {
        console.log('failure', data);
        res.end();
    }, function (oauth2Client, client, profile) {
        // save user info in the client manager (not included in library!)
        clientManager.add(profile, oauth2Client, client);
        cookies.set("user_id", profile.id, { signed: true });

//        console.log('success',clientManager.get(profile.id));

        res.redirect('/');
        res.end();
    });
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    console.log('MIRROR_CLIENT_ID', process.env.MIRROR_CLIENT_ID);
    console.log('MIRROR_CLIENT_SECRET', process.env.MIRROR_CLIENT_SECRET);
    console.log('MIRROR_REDIRECT_URL', process.env.MIRROR_REDIRECT_URL);
});
