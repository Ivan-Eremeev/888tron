!function() {
    let Sounds = window.classes.Sounds;
    let CellView = window.classes.CellView;

    class TableVerticalView {

        /**
         * @return {Number}
         */
        static get SMALL_SIZE() {
            return 160 * 0.7;
        }

        /**
         * @return {Number}
         */
        static get BIG_SIZE() {
            return 315 * 0.7;
        }

        /**
         * @return {Number}
         */
        static get SHIFT() {
            return 130;
        }

        /**
         * @return {Number}
         */
        static get ANIMATION_DURATION() {
            return 300;
        }

        /**
         * Event.
         * @return {String}
         */
        static get CLICK_EVENT() {
            return 'CLICK_EVENT';
        }

        /**
         * Event.
         * @return {String}
         */
        static get BET_EVENT() {
            return 'BET_EVENT';
        }

        /**
         * @return {String}
         */
        static get OVER_EVENT() {
            return 'OVER_EVENT';
        }

        /**
         * @return {String}
         */
        static get OUT_EVENT() {
            return 'OUT_EVENT';
        }

        /**
         * @param canvas {CanvasView}
         * @param imagesModel {ImagesModel}
         * @param cellsModel {CellsModel}
         * @param chipsNavigationModel {ChipsNavigationModel}
         * @param stateModel {StateModel}
         */
        constructor(canvas, imagesModel, cellsModel, chipsNavigationModel, stateModel) {
            this._canvas = canvas;
            this._imagesModel = imagesModel;
            this._cellsModel = cellsModel;
            this._chipsNavigationModel = chipsNavigationModel;
            this._stateModel = stateModel;

            this._scale = 0;
            this._x = 0;
            this._y = 0;
            this._endX = 0;
            this._endY = 0;
            this._size = TableVerticalView.BIG_SIZE;
            this._enable = true;
            this._animation = null;

            this._over = false;
            this._cells = [];
            this._cellsObject = {};
            this._initCells();
        }

        _initCells() {
            let ids = this._cellsModel.getIds();
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let cellModel = this._cellsModel.getCell(id);
                let cell = new CellView(this._canvas, this._imagesModel, cellModel, cellModel.vertical, this._chipsNavigationModel, this._stateModel, 'table', 'vertical');
                this._cells.push(cell);
                this._cellsObject[id] = cell;
                $(cell).on(CellView.OVER_EVENT, this._onCellOver.bind(this));
            }
        }

        update() {
            if (!this._canvas.mobile) return;
            this._drawTable();
            this._drawCellsMask();
            this._drawCellsChips();
            this._drawCellsNotes();
        }

        _drawTable() {
            if (!this._canvas.mobile) return;
            let image = this._imagesModel.getImage('img/roulette/table/vertical/table.svg');
            this._scale = this._size / image.width;
            let imageWidth = this._size;
            let imageHeight = image.height * this._scale;
            this._x = TableVerticalView.SHIFT;
            this._y = (this._canvas.canvas.height - imageHeight) / 2;
            this._endX = this._x + imageWidth;
            this._endY = this._y + imageHeight;
            this._canvas.context.drawImage(image, this._x, this._y, imageWidth, imageHeight);
        }

        _drawCellsMask() {
            for (let i = 0; i < this._cells.length; i++) {
                let cell = this._cells[i];
                cell.updateMask(this._x, this._y, this._scale);
            }
        }

        _drawCellsChips() {
            for (let i = 0; i < this._cells.length; i++) {
                let cell = this._cells[i];
                cell.updateChip(this._x, this._y, this._scale);
            }
        }

        _drawCellsNotes() {
            for (let i = 0; i < this._cells.length; i++) {
                let cell = this._cells[i];
                cell.updateNote(this._x, this._y, this._scale);
            }
        }

        /**
         * @param parentX {Number}
         * @param parentY {Number}
         */
        mouseMove(parentX, parentY) {
            if (!this._canvas.mobile) return;
            if (!this._enable) {
                this._outCell();
                return;
            }
            let x = (parentX - this._x) / this._scale;
            let y = (parentY - this._y) / this._scale;
            let cell = this._getCellUnderCursor(x, y);
            if (cell) {
                this._overCell(cell);
            }
            else {
                this._outCell();
            }
        }

        /**
         * @param parentX {Number}
         * @param parentY {Number}
         * @return {Boolean}
         */
        isIn(parentX, parentY) {
            if (!this._canvas.mobile || !this._enable) return false;
            return (
                parentX >= this._x &&
                parentX <= this._endX &&
                parentY >= this._y &&
                parentY <= this._endY
            );
        }

        /**
         * @param cell {CellView}
         * @private
         */
        _overCell(cell) {
            cell.over();
            for (let i = 0; i < this._cells.length; i++) {
                let item = this._cells[i];
                if (item === cell) continue;
                item.out();
            }
        }

        _outCell() {
            if (!this._over) return;
            this._over = false;
            $(this).trigger(TableVerticalView.OUT_EVENT);
        }

        /**
         * @param event {Object}
         * @param event.target {CellView}
         * @private
         */
        _onCellOver(event) {
            this._over = true;
            $(this).trigger(TableVerticalView.OVER_EVENT, event.target);
        }

        /**
         * @param model {CellModel}
         */
        selectCell(model) {
            this._selectCell(model.id);
            for (let i = 0; i < model.childrenLength; i++) {
                let childrenId = model.getChildrenId(i);
                this._selectCell(childrenId);
            }
        }

        /**
         * @param id {String}
         * @private
         */
        _selectCell(id) {
            let cellView = this._cellsObject[id];
            if (cellView) cellView.select();
        }

        deselectCells() {
            for (let i = 0; i < this._cells.length; i++) {
                let cell = this._cells[i];
                cell.deselect();
                cell.out();
            }
        }

        /**
         * @param parentX {Number}
         * @param parentY {Number}
         */
        mouseClick(parentX, parentY) {
            if (!this._canvas.mobile) return;
            if (
                parentX <= this._x ||
                parentX >= this._endX ||
                parentY <= this._y ||
                parentY >= this._endY
            ) return;
            if (this._enable) {
                let x = (parentX - this._x) / this._scale;
                let y = (parentY - this._y) / this._scale;
                let cell = this._getCellUnderCursor(x, y);
                if (cell) $(this).trigger(TableVerticalView.BET_EVENT, cell);
            }
            else {
                $(this).trigger(TableVerticalView.CLICK_EVENT);
            }
        }

        enable() {
            this._enable = true;
            if (this._animation) TWEEN.remove(this._animation);
            let sound = Sounds.getSound('sounds/roulette/switch_table.mp3');
            sound.currentTime = 0;
            sound.play();
            this._animation = new TWEEN.Tween(this)
                .to({_size: TableVerticalView.BIG_SIZE}, TableVerticalView.ANIMATION_DURATION)
                .start();
        }

        disable() {
            this._enable = false;
            if (this._animation) TWEEN.remove(this._animation);
            this._animation = this._animation = new TWEEN.Tween(this)
                .to({_size: TableVerticalView.SMALL_SIZE}, TableVerticalView.ANIMATION_DURATION)
                .start();
        }

        /**
         * @param x {Number}
         * @param y {Number}
         * @return {CellView|null}
         * @private
         */
        _getCellUnderCursor(x, y) {
            for (let i = 0; i < this._cells.length; i++) {
                let cell = this._cells[i];
                if (cell.cursorIsOver(x, y)) return cell;
            }
            return null;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.TableVerticalView = TableVerticalView;
}();