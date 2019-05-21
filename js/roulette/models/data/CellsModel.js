!function () {
    let CellModel = window.classes.CellModel;

    class CellsModel {

        /**
         * @return {Number}
         * @constructor
         */
        static get ONE_CHIP_IN_TRX() {
            return 1;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get MIN() {
            return 10;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get MAX() {
            return 20000;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get CELL_MIN() {
            return 10;
        }

        /**
         * @return {String}
         * @constructor
         */
        static get CHANGE_VALUE_EVENT() {
            return 'CHANGE_VALUE_EVENT';
        }

        /**
         * @param data {Array}
         * @param horizontalHeight {Number}
         */
        constructor(data, horizontalHeight) {
            this._total = 0;
            this._cells = {};
            this._ids = [];
            this._snapshots = [];
            this._lastBet = null;

            this._init(data, horizontalHeight);
        }

        /**
         * @param data {Array}
         * @param horizontalHeight {Number}
         */
        _init(data, horizontalHeight) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                let cell = new CellModel(item, horizontalHeight);
                let id = cell.id;
                this._ids.push(id);
                this._cells[id] = cell;
            }
            this._makeSnapshot();
        }

        /**
         * @param id {String}
         * @return {CellModel}
         */
        getCell(id) {
            return this._cells[id];
        }

        /**
         * @return {String[]}
         */
        getIds() {
            return this._ids;
        }

        /**
         * @return {Number}
         */
        get total() {
            return this._total;
        }

        /**
         * @return {{ids: {Number[]}, values: {String[]}}}
         */
        get bets() {
            let bets = {};
            for (let id in this._cells) {
                let cell = this._cells[id];
                if (!cell.value) continue;

                if (!bets.hasOwnProperty(cell.serverId)) bets[cell.serverId] = 0;
                bets[cell.serverId] += cell.value;
            }

            let ids = [];
            let values = [];
            for (let id in bets) {
                ids.push(id);
                values.push(bets[id]);
            }
            return {
                'ids': ids,
                'values': values,
            }
        }

        /**
         * @param clickedCellModel {CellModel}
         * @param cells {CellModel[]}
         * @param value {Number}
         */
        add(clickedCellModel, cells, value) {
            let count = 0;
            for (let id in this._cells) {
                let cell = this._cells[id];
                if (cells.indexOf(cell) !== -1 || cell.value) count++;
                if (count > 10) {
                    clickedCellModel.richBetsCountLimit();
                    return;
                }
            }

            let totalChange = 0;
            for (let i = 0; i < cells.length; i++) {
                let cell = cells[i];
                let newValue = cell.value + value;
                totalChange += Math.min(newValue, cell.maxBet) - cell.value;
                if (newValue > cell.maxBet) cell.richLimit();
            }
            if (!totalChange) return;
            if ((this._total + totalChange) > CellsModel.MAX) {
                clickedCellModel.richMaxBet();
                return;
            }
            this._makeSnapshot();
            this._total += totalChange;

            for (let i = 0; i < cells.length; i++) {
                let cell = cells[i];
                let newValue = cell.value + value;
                cell.value = Math.min(newValue, cell.maxBet);
            }
            $(this).trigger(CellsModel.CHANGE_VALUE_EVENT);
        }

        /**
         * @param clickedCellModel {CellModel}
         * @param cells {CellModel[]}
         * @param value {Number}
         */
        checkBetLimits(clickedCellModel, cells, value) {
            let totalChange = 0;
            for (let i = 0; i < cells.length; i++) {
                let cell = cells[i];
                let newValue = cell.value + value;
                totalChange += Math.min(newValue, cell.maxBet) - cell.value;
            }
            if (!totalChange) return;
            if ((this._total + totalChange) > CellsModel.MAX)
                clickedCellModel.richMaxBet();
        }

        double() {
            let totalChange = 0;
            for (let id in this._cells) {
                let cell = this._cells[id];
                let newValue = cell.value + cell.value;
                totalChange += Math.min(newValue, cell.maxBet) - cell.value;
                if (newValue > cell.maxBet) cell.richLimit();
            }
            if (!totalChange) return;
            if ((this._total + totalChange) > CellsModel.MAX) return;
            this._makeSnapshot();
            this._total += totalChange;

            for (let id in this._cells) {
                let cell = this._cells[id];
                let newValue = cell.value + cell.value;
                cell.value = Math.min(newValue, cell.maxBet);
            }
            $(this).trigger(CellsModel.CHANGE_VALUE_EVENT);
        }

        half() {
            let totalChange = 0;
            for (let id in this._cells) {
                let cell = this._cells[id];
                if (cell.value) totalChange += Math.max(parseInt(cell.value / 2), CellsModel.CELL_MIN) - cell.value;
            }
            if (!totalChange) return;
            if ((this._total + totalChange) < CellsModel.MIN) return;
            this._makeSnapshot();
            this._total += totalChange;

            for (let id in this._cells) {
                let cell = this._cells[id];
                if (cell.value) cell.value = Math.max(parseInt(cell.value / 2), CellsModel.CELL_MIN);
            }
            $(this).trigger(CellsModel.CHANGE_VALUE_EVENT);
        }

        undo() {
            if (this._snapshots.length === 1) return;
            let snapshot = this._snapshots[this._snapshots.length - 1];
            this._snapshots.length--;
            this._total = 0;
            for (let id in snapshot) {
                let cell = this._cells[id];
                cell.value = snapshot[id];
                this._total += cell.value;
            }

            $(this).trigger(CellsModel.CHANGE_VALUE_EVENT);
        }

        /**
         * @param number {Number}
         */
        clearBet(number) {
            for (let id in this._cells) {
                let cell = this._cells[id];
                cell.resultReaction(number);
            }

            this._makeSnapshot();
            this._lastBet = this._snapshots[this._snapshots.length - 1];
            this._clear();
        }

        reBet() {
            if (!this._lastBet) return;
            this._makeSnapshot();
            this._total = 0;
            for (let id in this._lastBet) {
                let cell = this._cells[id];
                cell.value = this._lastBet[id];
                this._total += cell.value;
            }

            $(this).trigger(CellsModel.CHANGE_VALUE_EVENT);
        }

        saveBet() {
            this._lastBet = {};
            for (let id in this._cells) {
                let cell = this._cells[id];
                this._lastBet[id] = cell.value;
            }
        }

        clear() {
            if (!this._total) return;
            this._makeSnapshot();
            this._clear();
        }

        _clear() {
            this._total = 0;
            for (let id in this._cells) {
                let cell = this._cells[id];
                cell.value = 0;
            }
            $(this).trigger(CellsModel.CHANGE_VALUE_EVENT);
        }

        _makeSnapshot() {
            let snapshot = {};
            for (let id in this._cells) {
                let cell = this._cells[id];
                snapshot[id] = cell.value;
            }
            this._snapshots[this._snapshots.length] = snapshot;
        }

        /**
         * @param number {Number}
         * @return {boolean}
         */
        isWin(number) {
            number = number.toString();
            for (let id in this._cells) {
                let cell = this._cells[id];
                if (!cell.value) continue;
                if (cell.id === number) return true;
                for (let i = 0; i < cell.childrenLength; i++) {
                    let cellId = cell.getChildrenId(i);
                    if (number === cellId) return true;
                }
            }
            return false;
        }

        /**
         * @param number {Number}
         * @return {boolean}
         */
        getPrize(number) {
            number = number.toString();
            let result = 0;
            for (let id in this._cells) {
                let cell = this._cells[id];
                if (!cell.value) continue;
                if (cell.id === number) result += cell.value * 35;
                else {
                    for (let i = 0; i < cell.childrenLength; i++) {
                        let cellId = cell.getChildrenId(i);
                        if (number === cellId) {
                            result += cell.prize;
                        }
                    }
                }
            }
            return result * CellsModel.ONE_CHIP_IN_TRX;
        }

        /**
         * @return {Object}
         */
        get betData() {
            let data = [];
            let ids = [];
            let values = [];
            for (let id in this._cells) {
                let cell = this._cells[id];
                if (cell.serverId === undefined || !cell.value) continue;
                data[cell.serverId] = cell.value;
                ids.push(cell.serverId);
            }
            ids = ids.sort(
                (a, b) => {
                    return a - b
                }
            );
            let sum = 0;
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                values.push(data[id]);
                sum += data[id];
            }
            return {
                'ids': ids,
                'values': values,
                'sum': sum,
            }
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.CellsModel = CellsModel;
}();