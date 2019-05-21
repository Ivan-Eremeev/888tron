!function() {
    let CellModel = window.classes.CellModel;
    let StateModel = window.classes.StateModel;

    class CellView {

        /**
         * @return {Number}
         */
        static get ALPHA() {
            return 0.7;
        }

        /**
         * @return {Number}
         */
        static get CHIP_SIZE() {
            return 44;
        }

        /**
         * @return {Number}
         */
        static get NOTE_WIDTH() {
            return 100;
        }

        /**
         * @return {Number}
         */
        static get NOTE_HEIGHT() {
            return 44;
        }

        /**
         * @return {Number}
         */
        static get CHIP_FONT_SIZE() {
            return 22;
        }

        /**
         * Event.
         * @return {String}
         */
        static get OVER_EVENT() {
            return 'OVER_EVENT';
        }

        /**
         * @param canvas {CanvasView}
         * @param imagesModel {ImagesModel}
         * @param cellModel {CellModel}
         * @param positionModel {PositionModel}
         * @param chipsModel {ChipsNavigationModel}
         * @param stateModel {StateModel}
         * @param directory {String}
         * @param subDirectory {String}
         */
        constructor(canvas, imagesModel, cellModel, positionModel, chipsModel, stateModel, directory, subDirectory) {
            this._canvas = canvas;
            this._imagesModel = imagesModel;
            this._cellModel = cellModel;
            this._positionModel = positionModel;
            this._chipsModel = chipsModel;
            this._stateModel = stateModel;
            this._directory = directory;
            this._subDirectory = subDirectory;
            this._over = false;
            this._selected = false;
            this._highlightAlpha = 0;
            this._chipValue = 0;
            this._chipAlpha = 0;
            this._chipCenterX = 0;
            this._chipCenterY = 0;
            this._chipZoom = 1;
            this._noteAlpha = 0;

            this._image = null;
            this._maskContext = null;
            this._createMaskImage();

            $(this._cellModel).on(CellModel.HIGHLIGHT_EVENT, this._cellHighlight.bind(this));
            $(this._cellModel).on(CellModel.WIN_EVENT, this._cellWin.bind(this));
            $(this._cellModel).on(CellModel.LOOSE_EVENT, this._cellLose.bind(this));
            $(this._cellModel).on(CellModel.LIMIT_REACHED_EVENT, this._cellLimitReached.bind(this));
            $(this._cellModel).on(CellModel.MAX_BET_REACHED_EVENT, this._cellMaxBetReached.bind(this));
            $(this._cellModel).on(CellModel.BETS_COUNT_LIMIT_REACHED_EVENT, this._cellBetsCountLimit.bind(this));
        }

        _cellHighlight() {
            this._highlightAlpha = 0;
            let delay = 200;
            let repeat = 6;
            for (let i = 0; i < repeat; i++)
            {
                new TWEEN.Tween(this)
                    .to({_highlightAlpha: 1}, delay)
                    .delay(i * delay * 2)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();
                new TWEEN.Tween(this)
                    .to({_highlightAlpha: 0}, delay)
                    .delay(i * delay * 2 + delay)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();
            }
        }


        _cellWin() {
            this._chipWin = true;
            this._chipValue = this._cellModel.value;
            this._chipAlpha = 1;
            this._chipMovingEnd = 0;
            new TWEEN.Tween(this)
                .to({_chipMovingEnd: 1, _chipAlpha: 0}, 2000)
                .delay(2500)
                .easing(TWEEN.Easing.Quintic.Out)
                .start();
        }

        _cellLose() {
            this._chipWin = false;
            this._chipValue = this._cellModel.value;
            this._chipAlpha = 1;
            this._chipCenterX = this._positionModel.x + this._positionModel.width / 2;
            this._chipCenterY = this._positionModel.y + this._positionModel.height / 2;
            new TWEEN.Tween(this)
                .to({_chipCenterY: this._chipCenterY - 1400}, 1800)
                .easing(TWEEN.Easing.Quintic.Out)
                .start();
            new TWEEN.Tween(this)
                .to({_chipAlpha: 0}, 400)
                .delay(1600)
                .easing(TWEEN.Easing.Quintic.Out)
                .start();
        }

        _cellLimitReached() {
            this._tweenNote('Limit reached');
        }

        _cellMaxBetReached() {
            this._tweenNote('Max bet reached');
        }

        _cellBetsCountLimit() {
            this._tweenNote('No more 10 bets');
        }

        /**
         * @param text {String}
         * @private
         */
        _tweenNote(text) {
            this._noteText = text;
            this._noteAlpha = 1;
            if (this._noteAnimation) TWEEN.remove(this._noteAnimation);
            this._noteAnimation = new TWEEN.Tween(this)
                .to({_noteAlpha: 0}, 500)
                .delay(800)
                .easing(TWEEN.Easing.Quintic.Out)
                .start();
        }

        _createMaskImage() {
            if (!this._cellModel.mask) return;
            let path = 'img/roulette/' +  this._directory + '/' + this._subDirectory + '/' + this._cellModel.id + '.svg';
            this._image = this._imagesModel.getImage(path);

            let canvas = document.createElement('canvas');
            canvas.width = this._image.width;
            canvas.height = this._image.height;
            this._maskContext = canvas.getContext('2d');
            this._maskContext.drawImage(this._image, 0, 0, this._image.width, this._image.height);
        }

        /**
         * @param startX {Number}
         * @param startY {Number}
         * @param scale {Number}
         */
        updateMask(startX, startY, scale) {
            if (this._stateModel.state !== StateModel.GAME) return;
            if (this._highlightAlpha) this._fill(startX, startY, scale, this._highlightAlpha);
            if (this._cellModel.hidden || !this._selected) return;
            this._fill(startX, startY, scale, CellView.ALPHA);
        }

        /**
         * @param startX {Number}
         * @param startY {Number}
         * @param scale {Number}
         * @param alpha {Number}
         */
        _fill(startX, startY, scale, alpha) {
            if (this._cellModel.mask) this._drawMask(startX, startY, scale, alpha);
            else this._drawRectangle(startX, startY, scale, alpha);
        }

        /**
         * @param startX {Number}
         * @param startY {Number}
         * @param scale {Number}
         * @param alpha {Number}
         */
        _drawMask(startX, startY, scale, alpha) {
            let imageWidth = this._image.width * scale;
            let imageHeight = this._image.height * scale;

            this._canvas.context.save();
            this._canvas.context.globalAlpha = alpha;
            this._canvas.context.drawImage(this._image, startX, startY, imageWidth, imageHeight);
            this._canvas.context.restore();
        }

        /**
         * @param startX {Number}
         * @param startY {Number}
         * @param scale {Number}
         * @param alpha {Number}
         */
        _drawRectangle(startX, startY, scale, alpha) {
            this._canvas.context.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
            let x = startX + this._positionModel.x * scale;
            let y = startY + this._positionModel.y * scale;
            let width = this._positionModel.width * scale;
            let height = this._positionModel.height * scale;
            this._canvas.context.fillRect(x, y, width, height);
        }

        /**
         * @param startX {Number}
         * @param startY {Number}
         * @param scale {Number}
         */
        updateChip(startX, startY, scale) {
            this._updateStaticChip(startX, startY, scale);
            this._updateFlyingChip(startX, startY, scale);
        }

        /**
         * @param startX {Number}
         * @param startY {Number}
         * @param scale {Number}
         */
        updateNote(startX, startY, scale) {
            if (!this._noteAlpha) return;

            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._noteAlpha;
            let centerX = startX + this._positionModel.x * scale + this._positionModel.width * scale / 2;
            let centerY = startY + this._positionModel.y * scale + this._positionModel.height * scale / 2;

            this._canvas.context.fillStyle = '#4B27BA';
            this._canvas.context.shadowColor = 'black';
            this._canvas.context.shadowBlur = 5;
            this.drawRoundRect(centerX - 70, centerY - 60, 140, 30, 10);
            this.drawRoundRect(centerX - 70, centerY - 60, 140, 30, 10);

            this._canvas.context.font = '18px Helvetica,Arial,Courier,monospace';
            this._canvas.context.fillStyle = 'white';
            this._canvas.context.textAlign = 'center';
            this._canvas.context.shadowBlur = 0;
            this._canvas.context.fillText(this._noteText, centerX, centerY - 40);

            this._canvas.context.restore();
        }

        /**
         * @param x {Number}
         * @param y {Number}
         * @param width {Number}
         * @param height {Number}
         * @param radius {Number}
         * @return {CellView}
         */
        drawRoundRect(x, y, width, height, radius)
        {
            if (width < 2 * radius) radius = width / 2;
            if (height < 2 * radius) radius = height / 2;
            this._canvas.context.beginPath();
            this._canvas.context.moveTo(x + radius, y);
            this._canvas.context.arcTo(x + width, y, x+width, y + height, radius);
            this._canvas.context.arcTo(x + width, y + height, x, y + height, radius);
            this._canvas.context.arcTo(x, y + height, x, y, radius);
            this._canvas.context.arcTo(x, y, x + width, y, radius);
            this._canvas.context.closePath();
            this._canvas.context.fill();
        }

        /**
         * @param startX {Number}
         * @param startY {Number}
         * @param scale {Number}
         */
        _updateStaticChip(startX, startY, scale) {
            if (!this._cellModel.chips || !this._cellModel.value) return;
            let size = CellView.CHIP_SIZE * scale;
            let centerX = startX + this._positionModel.x * scale + this._positionModel.width * scale / 2;
            let centerY = startY + this._positionModel.y * scale + this._positionModel.height * scale / 2;
            let x = centerX - size / 2;
            let y = centerY - size / 2;
            let image = this._getImageByValue(this._cellModel.value);
            this._canvas.context.drawImage(image, x, y, size, size);

            let fontSize = CellView.CHIP_FONT_SIZE * scale;
            let text = this._cellModel.value.toString();
            this._canvas.context.font = 'bold ' + fontSize + 'px Helvetica,Arial,Courier,monospace';
            this._canvas.context.fillStyle = 'white';
            this._canvas.context.textAlign = 'center';
            this._canvas.context.shadowColor = 'black';
            this._canvas.context.shadowBlur = 2;
            this._canvas.context.lineWidth = 2;
            this._canvas.context.fillText(text, centerX, centerY + fontSize * 0.3, fontSize * 2);
            this._canvas.context.shadowBlur = 0;
            this._canvas.context.fillStyle = "white";
            this._canvas.context.fillText(text, centerX, centerY + fontSize * 0.3, fontSize * 2);
        }

        /**
         * @param startX {Number}
         * @param startY {Number}
         * @param scale {Number}
         */
        _updateFlyingChip(startX, startY, scale) {
            if (!this._cellModel.chips || !this._chipAlpha) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._chipAlpha;
            let size = CellView.CHIP_SIZE * scale * this._chipZoom;
            let centerX = 0;
            let centerY = 0;
            if (this._chipWin) {
                centerX = startX + this._positionModel.x * scale + this._positionModel.width * scale / 2;
                centerY = startY + this._positionModel.y * scale + this._positionModel.height * scale / 2;
                let endCenterX = this._canvas.canvas.width / 2;
                let endCenterY = this._canvas.canvas.height;
                centerX = centerX + (endCenterX - centerX) * this._chipMovingEnd;
                centerY = centerY + (endCenterY - centerY) * this._chipMovingEnd;
            }
            else
            {
                centerX = startX + this._chipCenterX * scale;
                centerY = startY + this._chipCenterY * scale;
            }
            let x = centerX - size / 2;
            let y = centerY - size / 2;
            let image = this._getImageByValue(this._chipValue);
            this._canvas.context.drawImage(image, x, y, size, size);

            let fontSize = CellView.CHIP_FONT_SIZE * scale * this._chipZoom;
            let text = this._chipValue.toString();
            this._canvas.context.font = 'bold ' + fontSize + 'px Helvetica,Arial,Courier,monospace';
            this._canvas.context.fillStyle = 'white';
            this._canvas.context.textAlign = 'center';
            this._canvas.context.shadowColor = 'black';
            this._canvas.context.shadowBlur = 2;
            this._canvas.context.lineWidth = 2;
            this._canvas.context.fillText(text, centerX, centerY + fontSize * 0.3, fontSize * 2);
            this._canvas.context.shadowBlur = 0;
            this._canvas.context.fillStyle = "white";
            this._canvas.context.fillText(text, centerX, centerY + fontSize * 0.3, fontSize * 2);
            this._canvas.context.restore();


        }

        /**
         * @param value {Number}
         * @return {Image}
         * @private
         */
        _getImageByValue(value) {
            let defaultValue = this._getValue(value);
            let path = 'img/roulette/chips/' + defaultValue + '_.svg';
            return this._imagesModel.getImage(path);
        }

        /**
         * @param value {Number}
         * @return {Number}
         * @private
         */
        _getValue(value) {
            for (let i = 1; i < this._chipsModel.length; i++) {
                let defaultValue = this._chipsModel.getValueByIndex(i);
                if (value < defaultValue) return this._chipsModel.getValueByIndex(i - 1);
            }
            return this._chipsModel.getValueByIndex(this._chipsModel.length - 1);
        }

        over() {
            if (this._over) return;
            this._over = true;
            $(this).trigger(CellView.OVER_EVENT);
        }

        out() {
            if (!this._over) return;
            this._over = false;
        }

        select() {
            this._selected = true;
        }

        deselect() {
            this._selected = false;
        }

        /**
         * @param x {Number}
         * @param y {Number}
         * @return {Boolean}
         */
        cursorIsOver(x, y) {
            if (this._cellModel.mask)
            {
                if (x > this._image.width || y > this._image.height) return false;
                let data = this._maskContext.getImageData(x, y, 1, 1).data;
                let alpha = data[3];
                return alpha > 0;
            }
            else return (
                x >= this._positionModel.x &&
                x <= (this._positionModel.x + this._positionModel.width) &&
                y >= this._positionModel.y &&
                y <= (this._positionModel.y + this._positionModel.height)
            );
        }

        /**
         * @return {CellModel}
         */
        get model() {
            return this._cellModel;
        }

        /**
         * @return {Boolean}
         */
        get selected() {
            return this._selected;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.CellView = CellView;
}();