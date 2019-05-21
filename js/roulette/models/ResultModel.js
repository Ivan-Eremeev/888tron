!function() {
    class ResultModel {

        /**
         * Event
         * @return {String}
         */
        static get CHANGE_EVENT() {
            return 'CHANGE_EVENT';
        }

        /**
         * Event
         * @return {String}
         */
        static get PRISE_CHANGE_EVENT() {
            return 'PRISE_CHANGE_EVENT';
        }

        constructor() {
            this._number = 0;
            this._prize = 0;
            this._win = false;
        }

        /**
         * @param number {Number}
         * @param win {Boolean}
         * @param prize {Number}
         */
        update(number, win, prize) {
            this._number = number;
            this._win = win;
            this._prize = prize;
            $(this).trigger(ResultModel.CHANGE_EVENT);
        }

        /**
         * @return {Number}
         */
        get number() {
            return this._number;
        }

        /**
         * @return {Number}
         */
        get win() {
            return this._win;
        }

        /**
         * @return {Number}
         */
        get prize() {
            return this._prize;
        }

        triggerPrizeChange() {
            $(this).trigger(ResultModel.PRISE_CHANGE_EVENT);
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.ResultModel = ResultModel;
}();