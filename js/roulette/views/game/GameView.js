!function() {
    let Sounds = window.classes.Sounds;
    let BackgroundView = window.classes.BackgroundView;
    let WheelView = window.classes.WheelView;
    let FieldView = window.classes.FieldView;
    let HistoryView = window.classes.HistoryView;

    class GameView {

        /**
         * @param rootModel {RootModel}
         * @param canvas {CanvasView}
         */
        constructor(rootModel, canvas) {
            this._visible = false;

            this._canvas = canvas;
            this._background = new BackgroundView(canvas, rootModel.images);
            this._history = new HistoryView(canvas, '.history-text-js');
            this._field = new FieldView(canvas, rootModel.images, rootModel.data, rootModel.chipsNavigation, rootModel.state);
            this._wheel = new WheelView(canvas, rootModel.images, rootModel.state, rootModel.result);
        }

        update() {
            this._updateSounds();
            this._updateViews();
        }

        _updateSounds() {
            if (!this._visible && this._canvas.visible) {
                this._visible = true;
                let sound = Sounds.getSound('sounds/roulette/ambient.mp3');
                sound.currentTime = 0;
                sound.play();

                sound = Sounds.getSound('sounds/roulette/vo_place_your_bets_please.mp3');
                sound.currentTime = 0;
                setTimeout(() => sound.play(), 1000);
            }
            else if (this._visible && !this._canvas.visible) {
                this._visible = false;
                Sounds.stopAll();
            }
        }

        _updateViews() {
            if (!this._canvas.visible) return;
            this._canvas.updateSize();
            this._canvas.clear();
            this._background.update();
            this._field.update();
            this._history.update();
            this._wheel.update();
        }

        init() {
            this._field.init();
        }

        /**
         * @return {WheelView}
         */
        get wheel() {
            return this._wheel;
        }

        /**
         * @return {FieldView}
         */
        get field() {
            return this._field;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.GameView = GameView;
}();