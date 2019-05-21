!function() {
    let CellsModel = window.classes.CellsModel;
    let ResultModel = window.classes.ResultModel;

    class LimitsNavigationView {

        /**
         * @param cellsModel {CellsModel}
         * @param resultModel {ResultModel}
         * @param min {String} Example:
         *     '.element-js',
         * @param max {String} Example:
         *     '.element-js',
         * @param bet {String} Example:
         *     '.element-js',
         * @param paid {String} Example:
         *     '.element-js',
         */
        constructor(cellsModel, resultModel, min, max, bet, paid) {
            this._cellsModel = cellsModel;
            this._resultModel = resultModel;
            this._min = $(min);
            this._max = $(max);
            this._bet = $(bet);
            this._paid = $(paid);

            $(this._cellsModel).on(CellsModel.CHANGE_VALUE_EVENT, this._update.bind(this));
            $(this._resultModel).on(ResultModel.PRISE_CHANGE_EVENT, this._updatePrize.bind(this));
            this._init();
            this._update();
            this._updatePrize();
        }

        _init() {
            $(this._min).text(CellsModel.MIN * CellsModel.ONE_CHIP_IN_TRX);
            $(this._max).text((CellsModel.MAX * CellsModel.ONE_CHIP_IN_TRX).toLocaleString());
        }

        _update() {
            let text = (this._cellsModel.total * CellsModel.ONE_CHIP_IN_TRX).toLocaleString();
            let html = (this._cellsModel.total >= CellsModel.MAX) ? '<strong style="color: #AB2">' + text + '</strong>': text;
            $(this._bet).html(html);
        }

        _updatePrize() {
            $(this._paid).text(this._resultModel.prize.toLocaleString());
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.LimitsNavigationView = LimitsNavigationView;
}();