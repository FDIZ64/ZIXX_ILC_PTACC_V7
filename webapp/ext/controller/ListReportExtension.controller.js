sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        Edit: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        onEdit: function(oEvent) {
            MessageToast.show("editor invoked.");


        }
    }
});
