!function() {
    let Sounds = window.classes.Sounds;
    let FieldView = window.classes.FieldView;

    class FieldController {

        /**
         * @param chipsNavigationModel {ChipsNavigationModel}
         * @param tableCellsModel {CellsModel}
         * @param trackCellsModel {CellsModel}
         * @param fieldView {FieldView}
         */
        constructor(chipsNavigationModel, tableCellsModel, trackCellsModel, fieldView) {
            this._chipsNavigationModel = chipsNavigationModel;
            this._tableCellsModel = tableCellsModel;
            this._trackCellsModel = trackCellsModel;
            $(fieldView).on(FieldView.CLICK_EVENT, this._onFieldViewClick.bind(this));
        }

        /**
         * @param event {String}
         * @param cellModel {CellModel}
         * @private
         */
        _onFieldViewClick(event, cellModel) {
            let value = this._chipsNavigationModel.value;
            let cells = [];
            if (cellModel.chips) cells[0] = cellModel;
            else {
                for (let i = 0; i < cellModel.childrenLength; i++) {
                    let id = cellModel.getChildrenId(i);
                    let cell = this._tableCellsModel.getCell(id);
                    cells.push(cell);
                }
            }

            let total = this._tableCellsModel.total;
            this._tableCellsModel.add(cellModel, cells, value);
            this._trackCellsModel.checkBetLimits(cellModel, cells, value);
            if (this._tableCellsModel.total > total)
            {
                let sound = Sounds.getSound('sounds/roulette/mini_popup_stavka.mp3');
                sound.currentTime = 0;
                sound.play();
            }
            else {
                let sound = Sounds.getSound('sounds/roulette/mini_popup_stavka_min_max.mp3');
                sound.currentTime = 0;
                sound.play();
            }
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.FieldController = FieldController;
}();