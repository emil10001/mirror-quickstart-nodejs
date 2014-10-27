/**
 * Created by ejf3 on 10/19/14.
 */

ClientManager = function () {
    var clientMap = {};

    this.add = function (profile, oauth2Client) {
        clientMap[profile.id] = {
            oauth2Client: oauth2Client,
            profile: profile
        };
    };

    this.users = function () {
        return clientMap;
    };

    this.get = function (id) {
        return clientMap[id];
    };

};

module.exports = ClientManager;