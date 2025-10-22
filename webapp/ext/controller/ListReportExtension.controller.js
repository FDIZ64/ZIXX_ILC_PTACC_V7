sap.ui.define([
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/Fragment"

], function (MessageToast, JSONModel, Fragment) {
    'use strict';

    return {
        Edit: function (oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        onEdit: async function (oEvent) {
            MessageToast.show("editor invoked.");
            debugger;
            const oView = this.getView();
            const oContext = oEvent.getSource().getBindingContext();

            // Clonar datos de la entidad seleccionada
            const oData = Object.assign({}, oContext.getObject());

            // Crear modelo local temporal
            const oLocalModel = new JSONModel(oData);
            oView.setModel(oLocalModel, "localModel");

            // Cargar el fragmento si no está creado
            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "zixxilcptaccv7.ext.fragment.EditDialog",
                    controller: this
                }).then(oDialog => {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            const oDialog = await this._pDialog;
            oDialog.open();
        },
        onCancelDialog: function () {
            this.byId("editDialog").close();
        },
        onSaveDialog: function () {
            debugger;
            const oView = this.getView();
            const oDialog = this.byId("editDialog");
            const oModel = oView.getModel(); // modelo OData v2 principal
            const oLocalData = oView.getModel("localModel").getData();

            // Construir path del registro
            const sPath = oModel.createKey("/ZIXX_ILC_PTACC_V", {
                rbukrs: oLocalData.rbukrs,
                racct: oLocalData.racct,
                gjahr: oLocalData.gjahr,
                belnr: oLocalData.belnr,
                buzei: oLocalData.buzei
            });
        // Actualizar entidad vía OData
        oModel.update(sPath, oLocalData, {
          success: () => {
            MessageToast.show("Cliente actualizado correctamente");
            oDialog.close();
            oModel.refresh(); // refrescar la tabla
          },
          error: () => {
            MessageToast.show("Error al actualizar el cliente");
          }
        });




        }
    }
});
