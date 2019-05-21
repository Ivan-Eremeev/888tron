!function() {
    let CellsModel = window.classes.CellsModel;

    class DataModel {

        /**
         * @return {Number}
         */
        static get TABLE_HEIGHT() {
            return 426;
        }

        /**
         * @return {Number}
         */
        static get TRACK_HEIGHT() {
            return 278;
        }

        /**
         * @param data {Object}
         * @param data.table {Object}
         * @param data.track {Object}
         */
        constructor(data) {
            this._table = new CellsModel(data.table, DataModel.TABLE_HEIGHT);
            this._track = new CellsModel(data.track, DataModel.TRACK_HEIGHT);
        }

        /**
         * @return CellsModel
         */
        get table() {
            return this._table;
        }

        /**
         * @return CellsModel
         */
        get track() {
            return this._track;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.DataModel = DataModel;
}();