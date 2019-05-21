!function() {
    class ChipsNavigationModel {

        /**
         * Event.
         * @return {String}
         */
        static get CHANGE_EVENT() {
            return 'CHANGE_EVENT';
        }

        /**
         * Event.
         * @return {String}
         */
        static get CHIP_DROP_EVENT() {
            return 'CHIP_DROP_EVENT';
        }

        /**
         * Event.
         * @return {String}
         */
        static get CHIP_MOUSE_DROP_EVENT() {
            return 'CHIP_MOUSE_DROP_EVENT';
        }

        /**
         * @param chips {Number[]}
         */
        constructor(chips) {
            this._chips = chips;
            this._length = chips.length;
            this._index = 2;
        }

        next() {
            if (this._index === this._length - 1) return;
            this.index++;
        }

        previous() {
            if (this._index === 0) return;
            this.index--;
        }

        /**
         * @return {Number}
         */
        get length() {
            return this._length;
        }

        /**
         * @return {Number}
         */
        get index() {
            return this._index;
        }

        /**
         *
         * @param value {Number}
         */
        set index(value) {
            if (this._index === value) return;
            this._index = value;
            $(this).trigger(ChipsNavigationModel.CHANGE_EVENT);
        }

        /**
         * @param index {Number}
         * @return {Number}
         */
        getValueByIndex(index) {
            return this._chips[index];
        }

        /**
         * @return {Number}
         */
        get value() {
            return this._chips[this.index];
        }

        triggerDrop() {
            $(this).trigger(ChipsNavigationModel.CHIP_DROP_EVENT);
        }

        triggerMouseDrop() {
            $(this).trigger(ChipsNavigationModel.CHIP_MOUSE_DROP_EVENT);
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.ChipsNavigationModel = ChipsNavigationModel;
}();