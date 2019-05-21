!function() {
    class CellColor {

        /**
         * @return {Number[]}
         * @constructor
         */
        static get NUMBERS() {
            return [
                13,
                36,
                11,
                30,
                8,
                23,
                10,
                5,
                24,
                16,
                33,
                1,
                20,
                14,
                31,
                9,
                22,
                18,
                29,
                7,
                28,
                12,
                35,
                3,
                26,
                0,
                32,
                15,
                19,
                4,
                21,
                2,
                25,
                17,
                34,
                6,
                27
            ];
        }

        /**
         * @return {String}
         * @constructor
         */
        static get ZERO() {
            return '#363';
        }

        /**
         * @return {String}
         * @constructor
         */
        static get RED() {
            return '#900';
        }

        /**
         * @return {String}
         * @constructor
         */
        static get BLACK() {
            return '#000';
        }

        /**
         * @static
         * @param number {Number}
         * @return {String}
         */
        static getColor(number) {
            if (number === 0) return CellColor.ZERO;
            let zeroIndex = CellColor.NUMBERS.indexOf(0);
            let numberIndex = CellColor.NUMBERS.indexOf(number);
            if (numberIndex < zeroIndex) return (numberIndex % 2) ? CellColor.RED : CellColor.BLACK;
            else return (numberIndex % 2) ?  CellColor.BLACK : CellColor.RED;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.CellColor = CellColor;
}();