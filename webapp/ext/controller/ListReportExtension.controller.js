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
                    // const oMaterialsModel = this.getOwnerComponent().getModel("MaterialVH");
                    // this._oDialog.setModel(oMaterialsModel, "MaterialVH");
                    return oDialog;
                });
            }
            const oDialog = await this._pDialog;
            oDialog.open();
        },
        onOpenMaterialFilter: function (oEvent) {
            debugger;
            // this._oTargetInput = this.getView().byId("materialInput");
            this._oSourceControl = oEvent.getSource();
            var oView = this.getView();
            this._oSourceView = oView;
            if (!this._pMaterialDialog) {
                this._pMaterialDialog = Fragment.load({
                    id: oView.getId(),
                    name: "zixxilcptaccv7.ext.fragment.MaterialFilterDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    this._oMaterialDialog = oDialog;
                    // oDialog.open();
                    return oDialog;
                }.bind(this));
            }
            this._pMaterialDialog.then(function (oDialog) {
                oDialog.open();
            });



        },
        onSearchMaterial: function () {
            const oSmartTable = this.byId("tblMaterials");
            if (oSmartTable) {
                oSmartTable.rebindTable();
            }
        },
        onConfirmMaterial: function () {
            if (!this._oMaterialDialog) return;

            var oDialog = this.byId("materialFilterDialog");
            var oSFB = oDialog.byId("materialSmartFilterBar");
            // var oInput = oDialog.byId("selectedMaterial");
            var oInput = this.getView().byId("materialInput");

            // Obtener el material filtrado en SmartFilterBar
            var oFilterData = oSFB.getFilterData();
            var sMaterial = oFilterData.Material || "";

            if (!sMaterial) {
                sap.m.MessageToast.show("No hay material seleccionado");
                return;
            }

            // Copiar el valor al Input que disparó el botón
            if (this._oTargetInput) {
                this._oTargetInput.setValue(sMaterial);
            }

            // También actualizar el Input dentro del diálogo (opcional)
            oInput.setValue(sMaterial);

            oDialog.close();
        },

        onCloseMaterialDialog: function () {
            debugger;

            const oTable = this.byId("materialTable");
            const aSelectedItems = oTable.getSelectedItems(); // devuelve array

            if (aSelectedItems.length) {
                const oSelectedItem = aSelectedItems[0];
                const oContext = oSelectedItem.getBindingContext();
                const oData = oContext.getObject(); // objeto con los datos
                // if (this._oSourceControl) {
                //     if (this._oSourceControl.setValue) {
                //         this._oSourceControl.setValue(oData.Matnr);
                //     } else if (this._oSourceControl.setText) {
                //         this._oSourceControl.setText(oData.Matnr);
                //     }
                // }
                if (this._oSourceView) {
                    const oMaterialField = this._oSourceView.byId("materialInput");
                    if (oMaterialField.setValue) {
                        oMaterialField.setValue(oData.Matnr);
                    } else if (oMaterialField.setText) {
                        oMaterialField.setText(oData.Matnr);
                    }
                }

            }


            this._pMaterialDialog.then(function (oDialog) {
                oDialog.close();
            });
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
            const sPath = oModel.createKey("/ZV_IXX_IL_CPTACCSet", {
                RBUKRS: oLocalData.RBUKRS,
                RACCT: oLocalData.RACCT,
                GJAHR: oLocalData.GJAHR,
                BELNR: oLocalData.BELNR,
                BUZEI: oLocalData.BUZEI
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
