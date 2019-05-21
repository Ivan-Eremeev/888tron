!function() {
    class PositionModel {

        /**
         * @param data {Object}
         */
        constructor(data) {
            this._x = data.x;
            this._y = data.y;
            this._width = data.width;
            this._height = data.height;
        }

        /**
         * @return {Number}
         */
        get x() {
            return this._x;
        }

        /**
         * @return {Number}
         */
        get y() {
            return this._y;
        }

        /**
         * @return {Number}
         */
        get width() {
            return this._width;
        }

        /**
         * @return {Number}
         */
        get height() {
            return this._height;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.PositionModel = PositionModel;
}();