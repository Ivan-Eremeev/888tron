!function() {
    let PositionModel = window.classes.PositionModel;

    class CellModel {

        /**
         * @return {String}
         * @constructor
         */
        static get HIGHLIGHT_EVENT() {
            return 'HIGHLIGHT_EVENT';
        }

        /**
         * @return {String}
         * @constructor
         */
        static get WIN_EVENT() {
            return 'WIN_EVENT';
        }

        /**
         * @return {String}
         * @constructor
         */
        static get LOOSE_EVENT() {
            return 'LOOSE_EVENT';
        }

        /**
         * @return {String}
         * @constructor
         */
        static get LIMIT_REACHED_EVENT() {
            return 'LIMIT_REACHED_EVENT';
        }

        /**
         * @return {String}
         * @constructor
         */
        static get MAX_BET_REACHED_EVENT() {
            return 'MAX_BET_REACHED_EVENT';
        }


        /**
         * @return {String}
         * @constructor
         */
        static get BETS_COUNT_LIMIT_REACHED_EVENT() {
            return 'BETS_COUNT_LIMIT_REACHED_EVENT';
        }

        /**
         * @return {Object}
         * @constructor
         */
        static get MAX_BETS() {
            return {
                '0': 100,
                '2': 200,
                '3': 300,
                '4': 400,
                '6': 600,
                '12': 2000,
                '18': 5000
            };
        }

        /**
         * @return {Object}
         * @constructor
         */
        static get PRIZE_COEFFICIENT() {
            return {
                '0': 36,
                '2': 18,
                '3': 12,
                '4': 9,
                '6': 6,
                '12': 3,
                '18': 2
            };
        }

        /**
         * @param data {Object}
         * @param data.id {String}
         * @param data.serverId {Number}
         * @param data.chips {Boolean}
         * @param data.mask {Boolean}
         * @param data.hidden {Boolean}
         * @param data.position {Object}
         * @param data.children {Number[]}
         * @param horizontalHeight {Number}
         */
        constructor(data, horizontalHeight) {
            this._value = 0;
            this._id = data.id;
            this._serverId = data.serverId;
            this._chips = data.chips;
            this._mask = data.mask;
            this._hidden = data.hidden;
            this._horizontal = new PositionModel(data.position);
            let verticalData = CellModel._getHorizontalData(data.position, horizontalHeight);
            this._vertical = new PositionModel(verticalData);
            this._children = data.children;
            this._prizeCoefficient = CellModel.PRIZE_COEFFICIENT[this._children.length.toString()];
            this._maxBet = CellModel.MAX_BETS[this._children.length.toString()];
        }

        /**
         *
         * @param data {Object}
         * @param data.x {Number}
         * @param data.y {Number}
         * @param data.width {Number}
         * @param data.height {Number}
         * @param horizontalHeight {Number}
         * @private
         * @return {Object}
         */
        static _getHorizontalData(data, horizontalHeight) {
            return {
                'x': (horizontalHeight - data.y - data.height),
                'y': data.hasOwnProperty('x') ? data.x : 0,
                'width': data.hasOwnProperty('height') ? data.height : 0,
                'height': data.hasOwnProperty('width') ? data.width : 0
            };
        }

        highlight() {
            $(this).trigger(CellModel.HIGHLIGHT_EVENT);
        }

        /**
         * @param value {Number}
         */
        set value(value) {
            this._value = value;
        }

        /**
         * @return {Number}
         */
        get value() {
            return this._value;
        }

        /**
         * @return {String}
         */
        get id() {
            return this._id;
        }

        /**
         * @return {Number}
         */
        get serverId() {
            return this._serverId;
        }

        /**
         * @return {Boolean}
         */
        get chips() {
            return this._chips;
        }

        /**
         * @return {Boolean}
         */
        get mask() {
            return this._mask;
        }

        /**
         * @return {Boolean}
         */
        get hidden() {
            return this._hidden;
        }

        /**
         * @return {PositionModel}
         */
        get horizontal() {
            return this._horizontal;
        }

        /**
         * @return {PositionModel}
         */
        get vertical() {
            return this._vertical;
        }

        /**
         * @param index
         * @return {String}
         */
        getChildrenId(index) {
            return this._children[index].toString();
        }

        /**
         * @return {Number}
         */
        get childrenLength() {
            return this._children.length;
        }

        /**
         * @return {Number}
         */
        get prize() {
            return this._value * this._prizeCoefficient;
        }


        /**
         * @return {Number}
         */
        get maxBet() {
            return this._maxBet;
        }

        richMaxBet() {
            $(this).trigger(CellModel.MAX_BET_REACHED_EVENT);
        }

        richLimit() {
            $(this).trigger(CellModel.LIMIT_REACHED_EVENT);
        }

        richBetsCountLimit() {
            $(this).trigger(CellModel.BETS_COUNT_LIMIT_REACHED_EVENT);
        }

        /**
         * @param number {Number}
         */
        resultReaction(number) {
            if (!this._value) return;
            if (this._id === number.toString() || this._childIdExist(number)) $(this).trigger(CellModel.WIN_EVENT);
            else $(this).trigger(CellModel.LOOSE_EVENT);
        }

        /**
         * @param number {Number}
         * @return {boolean}
         * @private
         */
        _childIdExist(number) {
            let id = number.toString();
            for (let i = 0; i < this.childrenLength; i++) {
                if (id === this.getChildrenId(i)) return true;
            }
            return false;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.CellModel = CellModel;
}();