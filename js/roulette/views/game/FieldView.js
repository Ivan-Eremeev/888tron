!function() {
    let StateModel = window.classes.StateModel;
    let ChipsNavigationModel = window.classes.ChipsNavigationModel;

    let TableView = window.classes.TableView;
    let TableVerticalView = window.classes.TableVerticalView;
    let TrackView = window.classes.TrackView;
    let TrackVerticalView = window.classes.TrackVerticalView;

    class FieldView {

        /**
         * @return {String}
         */
        static get CLICK_EVENT() {
            return 'CLICK_EVENT';
        }

        /**
         * @param canvas {CanvasView}
         * @param imagesModel {ImagesModel}
         * @param dataModel {DataModel}
         * @param chipsNavigationModel {ChipsNavigationModel}
         * @param stateModel {StateModel}
         */
        constructor(canvas, imagesModel, dataModel, chipsNavigationModel, stateModel) {
            this._canvas = canvas;
            this._imagesModel = imagesModel;
            this._dataModel = dataModel;
            this._chipsNavigationModel = chipsNavigationModel;
            this._stateModel = stateModel;

            this._lastTouchX = 0;
            this._lastTouchY = 0;
        }

        init() {
            this._table = new TableView(this._canvas, this._imagesModel, this._dataModel.table, this._chipsNavigationModel, this._stateModel);
            this._tableVertical = new TableVerticalView(this._canvas, this._imagesModel, this._dataModel.table, this._chipsNavigationModel, this._stateModel);
            this._track = new TrackView(this._canvas, this._imagesModel, this._dataModel.track, this._chipsNavigationModel, this._stateModel);
            this._trackVertical = new TrackVerticalView(this._canvas, this._imagesModel, this._dataModel.track, this._chipsNavigationModel, this._stateModel);
            $(this._canvas.canvas).on('mouseup', this._onCanvasMouseUp.bind(this));
            $(this._tableVertical).on(TableVerticalView.CLICK_EVENT, this._onTableVerticalClick.bind(this));
            $(this._trackVertical).on(TrackVerticalView.CLICK_EVENT, this._onTrackVerticalClick.bind(this));
            $(this._canvas.canvas).mousemove(this._onCanvasMouseMove.bind(this));
            $(this._canvas.canvas).on('mouseout', this._onCanvasMouseOut.bind(this));
            this._canvas.canvas.addEventListener('touchend', this._onCanvasTouchEnd.bind(this), {passive: false});
            $(this._canvas.canvas).on('touchstart', this._onCanvasTouchStart.bind(this));
            window.addEventListener('touchstart', this._onWindowTouchMove.bind(this), { passive: false });
            window.addEventListener('touchmove', this._onWindowTouchMove.bind(this), { passive: false });
            $(window).on('touchend', this._onWindowTouchEnd.bind(this));

            $(this._table).on(TableView.OVER_EVENT, this._onTableOver.bind(this));
            $(this._table).on(TableView.OUT_EVENT, this._onTrackOrTableOut.bind(this));
            $(this._track).on(TrackView.OVER_EVENT, this._onTrackOver.bind(this));
            $(this._track).on(TrackView.OUT_EVENT, this._onTrackOrTableOut.bind(this));

            $(this._tableVertical).on(TableVerticalView.OVER_EVENT, this._onTableVerticalOver.bind(this));
            $(this._tableVertical).on(TableVerticalView.OUT_EVENT, this._onTrackOrTableVerticalOut.bind(this));
            $(this._trackVertical).on(TrackVerticalView.OVER_EVENT, this._onTrackVerticalOver.bind(this));
            $(this._trackVertical).on(TrackVerticalView.OUT_EVENT, this._onTrackOrTableVerticalOut.bind(this));

            $(this._table).on(TableView.BET_EVENT, this._onBet.bind(this));
            $(this._tableVertical).on(TableVerticalView.BET_EVENT, this._onBet.bind(this));
            $(this._track).on(TrackView.BET_EVENT, this._onBet.bind(this));
            $(this._trackVertical).on(TrackVerticalView.BET_EVENT, this._onBet.bind(this));

            $(this._chipsNavigationModel).on(ChipsNavigationModel.CHIP_DROP_EVENT, this._onChipsNavigationModelDrop.bind(this));
            $(this._chipsNavigationModel).on(ChipsNavigationModel.CHIP_MOUSE_DROP_EVENT, this._onChipsNavigationModelMouseDrop.bind(this));
        }

        update() {
            this._track.update();
            this._trackVertical.update();
            this._table.update();
            this._tableVertical.update();
        }

        /**
         * @param event {Object}
         * @param event.offsetX {Number}
         * @param event.offsetY {Number}
         * @private
         */
        _onCanvasMouseMove(event) {
            if (this._stateModel.state !== StateModel.GAME) return;
            let scaleX = this._canvas.canvas.width / $(this._canvas.canvas).width();
            let scaleY = this._canvas.canvas.height / $(this._canvas.canvas).height();
            let x = event.offsetX * scaleX;
            let y = event.offsetY * scaleY;
            this._table.mouseMove(x, y);
            this._track.mouseMove(x, y);
            this._tableVertical.mouseMove(x, y);
            this._trackVertical.mouseMove(x, y);
        }

        _onCanvasMouseOut() {
            let x = 0;
            let y = 0;
            this._table.mouseMove(x, y);
            this._track.mouseMove(x, y);
            this._tableVertical.mouseMove(x, y);
            this._trackVertical.mouseMove(x, y);
        }

        /**
         * @param event {Object}
         * @param event.originalEvent.touches[0].pageX {Number}
         * @param event.originalEvent.touches[0].pageY {Number}
         * @param event.originalEvent.changedTouches[0].pageX {Number}
         * @param event.originalEvent.changedTouches[0].pageY {Number}
         * @private
         */
        _onWindowTouchMove(event) {
            this._touchStarted = true;
            if (this._block) event.preventDefault();
            if (this._stateModel.state !== StateModel.GAME) return;
            let scaleX = this._canvas.canvas.width / $(this._canvas.canvas).width();
            let scaleY = this._canvas.canvas.height / $(this._canvas.canvas).height();
            let offset = $(this._canvas.canvas).offset();
            let touch =  event.touches[0] || event.changedTouches[0];
            this._lastTouchX = (touch.pageX - offset.left) * scaleX;
            this._lastTouchY = (touch.pageY - offset.top) * scaleY;
            this._table.mouseMove(this._lastTouchX, this._lastTouchY);
            this._track.mouseMove(this._lastTouchX, this._lastTouchY);
            this._tableVertical.mouseMove(this._lastTouchX, this._lastTouchY);
            this._trackVertical.mouseMove(this._lastTouchX, this._lastTouchY);
        }

        _onWindowTouchEnd() {
            this._touchStarted = false;
            this._onTouchEnd();
        }

        _onChipsNavigationModelDrop() {
            this._dropChip();
            this._lastTouchX = 0;
            this._lastTouchY = 0;
            this._table.mouseMove(0, 0);
            this._track.mouseMove(0, 0);
            this._tableVertical.mouseMove(0, 0);
            this._trackVertical.mouseMove(0, 0);
        }

        _onChipsNavigationModelMouseDrop() {
            this._dropChip();
        }

        _dropChip() {
            if (!this._fuckingMultiEventHackCounter) this._fuckingMultiEventHackCounter = 0;
            this._fuckingMultiEventHackCounter++;
            if (this._fuckingMultiEventHackCounter > 1) return;
            this._lastTouch();
            setTimeout(() => {this._fuckingMultiEventHackCounter = 0}, 100);
        }

        _lastTouch() {
            this._table.mouseClick(this._lastTouchX, this._lastTouchY);
            this._track.mouseClick(this._lastTouchX, this._lastTouchY);
            this._tableVertical.mouseClick(this._lastTouchX, this._lastTouchY);
            this._trackVertical.mouseClick(this._lastTouchX, this._lastTouchY)
        }

        /**
         * @param event {Object}
         * @private
         */
        _onCanvasTouchEnd(event) {
            if (!this._touchStarted) return;
            this._touchStarted = false;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            this._lastTouch();
            this._onTouchEnd();
        }

        /**
         * @param event {Object}
         * @param event.originalEvent.touches[0].pageX {Number}
         * @param event.originalEvent.touches[0].pageY {Number}
         * @param event.originalEvent.changedTouches[0].pageX {Number}
         * @param event.originalEvent.changedTouches[0].pageY {Number}
         * @private
         */
        _onCanvasTouchStart(event) {
            let scaleX = this._canvas.canvas.width / $(this._canvas.canvas).width();
            let scaleY = this._canvas.canvas.height / $(this._canvas.canvas).height();
            let offset = $(this._canvas.canvas).offset();
            let touch =  event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
            let touchX = (touch.pageX - offset.left) * scaleX;
            let touchY = (touch.pageY - offset.top) * scaleY;

            if (
                this._table.isIn(touchX, touchY) ||
                this._track.isIn(touchX, touchY) ||
                this._tableVertical.isIn(touchX, touchY) ||
                this._trackVertical.isIn(touchX, touchY)
            ) this._blockScrolling();
        }

        _blockScrolling() {
            this._block = true;
            $('html').css({'overflow-y': 'hidden', 'position': 'relative'});
            $('body').css({'overflow-y': 'hidden', 'position': 'relative'});
        }

        _unBlockScrolling() {
            this._block = false;
            $('html').css({'overflow-y': 'auto', 'position': 'auto'});
            $('body').css({'overflow-y': 'auto', 'position': 'auto'});
        }

        _onTouchEnd() {
            this._unBlockScrolling();
            if (this._stateModel.state !== StateModel.GAME) return;
            this._lastTouchX = 0;
            this._lastTouchY = 0;
            this._table.mouseMove(0, 0);
            this._track.mouseMove(0, 0);
            this._tableVertical.mouseMove(0, 0);
            this._trackVertical.mouseMove(0, 0);
        }

        /**
         * @param event {Object}
         * @param event.offsetX {Number}
         * @param event.offsetY {Number}
         * @param event.preventDefault {Function}
         * @param event.stopPropagation {Function}
         * @private
         */
        _onCanvasMouseUp(event) {
            event.preventDefault();
            if (this._stateModel.state !== StateModel.GAME) return;
            let scaleX = this._canvas.canvas.width / $(this._canvas.canvas).width();
            let scaleY = this._canvas.canvas.height / $(this._canvas.canvas).height();
            let x = event.offsetX * scaleX;
            let y = event.offsetY * scaleY;
            this._table.mouseClick(x, y);
            this._tableVertical.mouseClick(x, y);
            this._track.mouseClick(x, y);
            this._trackVertical.mouseClick(x, y);
        }

        _onTableVerticalClick() {
            this._tableVertical.enable();
            this._trackVertical.disable();
        }

        _onTrackVerticalClick() {
            this._tableVertical.disable();
            this._trackVertical.enable();
        }

        /**
         * @param event {String}
         * @param data {CellView}
         * @private
         */
        _onTableOver(event, data) {
            this._table.deselectCells();
            this._table.selectCell(data.model);
        }

        /**
         * @param event {String}
         * @param data {CellView}
         * @private
         */
        _onTrackOver(event, data) {
            this._table.deselectCells();
            this._track.deselectCells();
            this._table.selectCell(data.model);
            this._track.selectCell(data.model);
        }

        _onTrackOrTableOut() {
            if (!this._track.over) this._track.deselectCells();
            if (!this._track.over && !this._table.over) this._table.deselectCells();
        }

        /**
         * @param event {String}
         * @param data {CellView}
         * @private
         */
        _onTableVerticalOver(event, data) {
            this._tableVertical.deselectCells();
            this._tableVertical.selectCell(data.model);
        }

        /**
         * @param event {String}
         * @param data {CellView}
         * @private
         */
        _onTrackVerticalOver(event, data) {
            this._tableVertical.deselectCells();
            this._trackVertical.deselectCells();
            this._tableVertical.selectCell(data.model);
            this._trackVertical.selectCell(data.model);
        }

        _onTrackOrTableVerticalOut() {
            if (!this._trackVertical.over) this._trackVertical.deselectCells();
            if (!this._trackVertical.over && !this._tableVertical.over) this._tableVertical.deselectCells();
        }

        /**
         * @param event {String}
         * @param data {CellView}
         * @private
         */
        _onBet(event, data) {
            $(this).trigger(FieldView.CLICK_EVENT, data.model);
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.FieldView = FieldView;
}();