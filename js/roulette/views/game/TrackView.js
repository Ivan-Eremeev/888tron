!function() {
    let CellView = window.classes.CellView;

    class TrackView {

        /**
         * @return {Number}
         */
        static get SIZE() {
            return 180;
        }

        /**
         * @return {Number}
         */
        static get SHIFT() {
            return 20;
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
         * @return {String}
         */
        static get BET_EVENT() {
            return 'BET_EVENT';
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
                let cell = new CellView(this._canvas, this._imagesModel, cellModel, cellModel.horizontal,  this._chipsNavigationModel, this._stateModel, 'track', 'horizontal');
                this._cells.push(cell);
                this._cellsObject[id] = cell;
                $(cell).on(CellView.OVER_EVENT, this._onCellOver.bind(this));
            }
        }

        update() {
            if (this._canvas.mobile) return;
            this._drawTrack();
            this._drawCellsMask();
            this._drawCellsChips();
            this._drawCellsNotes();
        }

        _drawTrack() {
            let image = this._imagesModel.getImage('img/roulette/track/horizontal/track.svg');
            this._scale = TrackView.SIZE / image.height;
            let imageWidth = image.width * this._scale;
            let imageHeight = TrackView.SIZE;
            this._x = (this._canvas.canvas.width - imageWidth) / 2;
            this._y = TrackView.SHIFT;
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
            if (this._canvas.mobile) return;
            let x = (parentX - this._x) / this._scale;
            let y = (parentY - this._y) / this._scale;
            let cell = this._getCellUnderCursor(x, y);
            if (cell) {
                this._overCell(cell);
            }
            else {
                this._outCell();
            }
            if (this._lastCell !== cell) {
                this._lastCell = cell;
                this._initSounds();
                if (this._lastCell)
                {
                    if (this._soundBlock) return;
                    this._soundBlock = true;
                    setTimeout(() => {this._soundBlock = false}, 20);
                    this._soundIndex++;
                    let index = this._soundIndex % 100;
                    let sound = this._sounds[index];
                    sound.currentTime = 0;
                    sound.play();
                }
            }
        }

        _initSounds() {
            if (this._soundsInited) return;
            this._soundsInited = true;
            this._sounds = [];
            this._soundIndex = 0;
            for (let i = 0; i < 100; i++) {
                this._sounds[i] = window.soundManager.createSound('sounds/roulette/navedenie_pole.mp3');
            }

        }

        /**
         * @param parentX {Number}
         * @param parentY {Number}
         * @return {Boolean}
         */
        isIn(parentX, parentY) {
            if (this._canvas.mobile) return false;
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
            $(this).trigger(TrackView.OUT_EVENT);
        }

        /**
         * @param event {Object}
         * @param event.target {CellView}
         * @private
         */
        _onCellOver(event) {
            this._over = true;
            $(this).trigger(TrackView.OVER_EVENT, event.target);
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
            if (this._canvas.mobile) return;
            if (
                parentX <= this._x ||
                parentX >= this._endX ||
                parentY <= this._y ||
                parentY >= this._endY
            ) return;
            let x = (parentX - this._x) / this._scale;
            let y = (parentY - this._y) / this._scale;
            let cell = this._getCellUnderCursor(x, y);
            if (cell) $(this).trigger(TrackView.BET_EVENT, cell);
        }

        /**
         * @return {Boolean}
         */
        get over() {
            return this._over;
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
    window.classes.TrackView = TrackView;
}();