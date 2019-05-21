!function() {
    let Data = window.classes.Data;

    let StateModel = window.classes.StateModel;
    let ChipsNavigationModel = window.classes.ChipsNavigationModel;
    let ResultModel = window.classes.ResultModel;
    let ImagesModel = window.classes.ImagesModel;
    let DataModel = window.classes.DataModel;

    class RootModel {

        /**
         *
         * @param chips {Number[]} Example:
         *     [
         *         10,
         *         20
         *     ]
         */
        constructor(chips) {
            this._chipsNavigation = new ChipsNavigationModel(chips);
            this._images = new ImagesModel();
            this._state = new StateModel();
            this._result = new ResultModel();
            this._data = new DataModel(Data.data());
        }

        /**
         * @return {ChipsNavigationModel}
         */
        get chipsNavigation() {
            return this._chipsNavigation;
        }

        /**
         * @return {ImagesModel}
         */
        get images() {
            return this._images;
        }

        /**
         * @return {StateModel}
         */
        get state() {
            return this._state;
        }

        /**
         * @return {ResultModel}
         */
        get result() {
            return this._result;
        }

        /**
         * @return {DataModel}
         */
        get data() {
            return this._data;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.RootModel = RootModel;
}();