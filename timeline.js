/**
 * Created by ejf3 on 10/19/14.
 *
 * This class is to illustrate how to make various calls to the mirror
 * timeline, using the googleapis package
 */

TimelineHelper = function (oauth2Client, mirror) {

    /**
     * send a timeline card
     *
     * @param card
     * @param errorCallback
     * @param successCallback
     *
     * https://developers.google.com/glass/v1/reference/timeline/insert
     */
    this.insert = function (card, errorCallback, successCallback) {
        if (null == mirror) {
            errorCallback("no mirror");
            return;
        }

        card['auth'] = oauth2Client;

        mirror.timeline.insert(
            card,
            function (err, data) {
                if (!!err)
                    errorCallback(err);
                else
                    successCallback(data);
            });
    };

    /**
     * get the user's timeline
     *
     * @param errorCallback
     * @param successCallback
     *
     * NOTE: There appears to be a way to request only specific items to be returned.
     * This library only supports requesting the everything. Pull requests welcome.
     *
     * https://developers.google.com/glass/v1/reference/timeline/list
     */
    this.listTimeline = function (errorCallback, successCallback) {
        if (null == mirror) {
            errorCallback("no mirror");
            return;
        }

        mirror.timeline.list({
            auth: oauth2Client
        }, function (err, data) {
            if (!!err)
                errorCallback(err);
            else
                successCallback(data);
        });
    };

    /**
     * Deletes item with id from timeline
     * @param id
     * @param errorCallback
     * @param successCallback
     *
     * https://developers.google.com/glass/v1/reference/timeline/delete
     */
    this.delete = function (id, errorCallback, successCallback) {
        if (null == mirror) {
            errorCallback("no mirror");
            return;
        }

        mirror.timeline.delete({
            id: id,
            auth: oauth2Client
        }, function (err, data) {
            if (!!err)
                errorCallback(err);
            else
                successCallback(data);
        });
    };

    /**
     * Gets item with id from timeline
     * @param id
     * @param errorCallback
     * @param successCallback
     *
     * https://developers.google.com/glass/v1/reference/timeline/get
     */
    this.get = function (id, errorCallback, successCallback) {
        if (null == mirror) {
            errorCallback("no mirror");
            return;
        }

        mirror.timeline.get({
            id: id,
            auth: oauth2Client
        }, function (err, data) {
            if (!!err)
                errorCallback(err);
            else
                successCallback(data);
        });
    };


    /**
     * Patches item with id in timeline, only changes included fields
     *
     * @param card
     * @param errorCallback
     * @param successCallback
     *
     * https://developers.google.com/glass/v1/reference/timeline/get
     */
    this.patch = function (card, errorCallback, successCallback) {
        if (null == mirror) {
            errorCallback("no mirror");
            return;
        }

        if (!!!(card.id)) {
            errorCallback("card must specify a card id");
            return;
        }

        mirror.timeline.patch({
                id: card.id,
                card: card,
                auth: oauth2Client
            },
            function (err, data) {
                if (!!err)
                    errorCallback(err);
                else
                    successCallback(data);
            });
    };

    /**
     * Updates item with id in timeline, replaces entire card
     *
     * @param card
     * @param errorCallback
     * @param successCallback
     *
     * https://developers.google.com/glass/v1/reference/timeline/get
     */
    this.update = function (card, errorCallback, successCallback) {
        if (null == mirror) {
            errorCallback("no mirror");
            return;
        }

        if (!!!(card.id)) {
            errorCallback("card must specify a card id");
            return;
        }

        mirror.timeline.update({
                id: card.id,
                card: card,
                auth: oauth2Client
            },
            function (err, data) {
                if (!!err)
                    errorCallback(err);
                else
                    successCallback(data);
            });
    };


    /**
     * Deletes an attachment from a timeline item
     *
     * @param itemId
     * @param attachmentId
     * @param errorCallback
     * @param successCallback
     *
     * https://developers.google.com/glass/v1/reference/timeline/attachments/delete
     */
    this.deleteAttachment = function (itemId, attachmentId, errorCallback, successCallback) {
        if (null == mirror) {
            errorCallback("no mirror");
            return;
        }

        if (!!!(attachmentId) || !!!(itemId)) {
            errorCallback("both attachmentId and itemId must be specified");
            return;
        }

        mirror.timeline.attachments.delete({
                itemId: itemId,
                attachmentId: attachmentId,
                auth: oauth2Client
            },
            function (err, data) {
                if (!!err)
                    errorCallback(err);
                else
                    successCallback(data);
            });

    };

    /**
     * Retrieves an attachment on a timeline item by item ID and attachment ID.
     *
     * @param itemId
     * @param attachmentId
     * @param errorCallback
     * @param successCallback
     *
     * https://developers.google.com/glass/v1/reference/timeline/attachments/get
     */
    this.getAttachment = function (itemId, attachmentId, errorCallback, successCallback) {
        if (null == mirror) {
            errorCallback("no mirror");
            return;
        }

        if (!!!(attachmentId) || !!!(itemId)) {
            errorCallback("both attachmentId and itemId must be specified");
            return;
        }

        mirror.timeline.attachments.get({
                itemId: itemId,
                attachmentId: attachmentId,
                auth: oauth2Client
            },
            function (err, data) {
                if (!!err)
                    errorCallback(err);
                else
                    successCallback(data);
            });

    };

    /**
     * Adds a new attachment to a timeline item.
     *
     * NOTE: Not sure if this works or not, pull requests welcome.
     *
     * @param media
     * @param itemId
     * @param uploadType
     * @param mediaType
     * @param errorCallback
     * @param successCallback
     *
     * https://developers.google.com/glass/v1/reference/timeline/attachments/insert
     */
    this.insertAttachment = function (media, itemId, uploadType, mediaType, errorCallback, successCallback) {
        if (null == mirror) {
            errorCallback("no mirror");
            return;
        }

        mirror.timeline.attachments.insert({
                itemId: itemId,
                media: media,
                uploadType: uploadType,
                alt: mediaType,
                auth: oauth2Client
            },
            function (err, data) {
                if (!!err)
                    errorCallback(err);
                else
                    successCallback(data);
            });

    };

    /**
     * Returns a list of attachments for a timeline item.
     *
     * @param itemId
     * @param errorCallback
     * @param successCallback
     *
     * https://developers.google.com/glass/v1/reference/timeline/attachments/list
     */
    this.listAttachments = function (itemId, errorCallback, successCallback) {
        if (null == mirror) {
            errorCallback("no mirror");
            return;
        }

        if (!!!(itemId)) {
            errorCallback("itemId must be specified");
            return;
        }

        mirror.timeline.attachments.list({
                itemId: itemId,
                auth: oauth2Client
            },
            function (err, data) {
                if (!!err)
                    errorCallback(err);
                else
                    successCallback(data);
            });

    };
};

module.exports = TimelineHelper;