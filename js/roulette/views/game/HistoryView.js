!function() {
    let CellColor = window.classes.CellColor;

    class HistoryView {

        /**
         * @return {Number}
         * @constructor
         */
        static get SHIFT_X() {
            return 20;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get SIZE() {
            return 40;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get COLS() {
            return 2;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get ROWS() {
            return 10;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get FONT_SIZE() {
            return 24;
        }

        /**
         * @param canvas {CanvasView}
         * @param textElement {String}
         */
        constructor(canvas, textElement) {
            this._canvas = canvas;
            this._textElement = $(textElement);

            // Dirty hack for bugly minifier
            if (!window.roulette) window.roulette = {};
            if (!window.roulette.numbers) window.roulette.numbers = [];
        }

        update() {
            this._updateText();
            this._updateCells();
        }

        _updateText() {
            let text = $(this._textElement).text();
            let x = this._canvas.shiftX + HistoryView.SHIFT_X + HistoryView.COLS * HistoryView.SIZE / 2;
            let y = (this._canvas.canvas.height - HistoryView.SIZE * HistoryView.ROWS) / 2 - 8;
            this._canvas.context.font = '18px bold Helvetica,Arial,Courier,monospace';
            this._canvas.context.fillStyle = 'white';
            this._canvas.context.textAlign = 'center';
            this._canvas.context.fillText(text, x, y, 100);
        }

        _updateCells() {
            this._canvas.context.save();
            this._canvas.context.lineWidth = 2;
            this._canvas.context.strokeStyle = '#FFF';
            let shiftY = (this._canvas.canvas.height - HistoryView.SIZE * HistoryView.ROWS) / 2;
            for (let i = 0; i < HistoryView.COLS * HistoryView.ROWS; i++) {
                let number = (i >= window.roulette.numbers.length) ? -1 : window.roulette.numbers[i];
                this._canvas.context.fillStyle = (number === -1) ? 'rgba(0, 0, 0, 0)' : CellColor.getColor(number);
                let x = this._canvas.shiftX + HistoryView.SHIFT_X + (i % HistoryView.COLS) * HistoryView.SIZE;
                let y = shiftY + parseInt(i / HistoryView.COLS) * HistoryView.SIZE;
                this._canvas.context.fillRect(x, y, HistoryView.SIZE, HistoryView.SIZE);
                this._canvas.context.strokeRect(x, y, HistoryView.SIZE, HistoryView.SIZE);
                if (number !== -1) {
                    this._canvas.context.font = HistoryView.FONT_SIZE + 'px bold Helvetica,Arial,Courier,monospace';
                    this._canvas.context.fillStyle = 'white';
                    this._canvas.context.textAlign = 'center';
                    this._canvas.context.fillText(number.toString(), x + HistoryView.SIZE / 2, y + HistoryView.SIZE - HistoryView.FONT_SIZE / 2, HistoryView.SIZE);
                }
            }
            this._canvas.context.restore();
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.HistoryView = HistoryView;
}();