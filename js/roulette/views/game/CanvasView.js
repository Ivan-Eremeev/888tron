!function() {
    class CanvasView {

        /**
         * @return {Number}
         * @constructor
         */
        static get DESKTOP_WIDTH() {
            return 960;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get DESKTOP_HEIGHT() {
            return 480;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get MOBILE_WIDTH() {
            return 480;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get MOBILE_HEIGHT() {
            return 960 * 0.7;
        }

        /**
         * @param canvas {String} Example:
         *     '#canvas'
         */
        constructor(canvas) {
            this._needResize = true;
            this._canvas = $(canvas).get(0);
            this._context = this._canvas.getContext('2d');
            this._shiftX = 0;
            this._mobile = false;
            $(window).resize(this._onWindowResize.bind(this));
        }

        updateSize() {
            if (!this._needResize) return;
            this._resize();
            this._needResize = false;
        }

        clear() {
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }

        /**
         * @return {Boolean}
         */
        get visible() {
            return Boolean($(this._canvas).is(':visible'));
        }

        /**
         * @return {HTMLElement}
         */
        get canvas() {
            return this._canvas;
        }

        /**
         * @return {CanvasRenderingContext2D}
         */
        get context() {
            return this._context;
        }

        /**
         * @return {Boolean}
         */
        get mobile() {
            return this._mobile;
        }

        /**
         * @return {Number}
         */
        get shiftX() {
            return this._shiftX;
        }

        _onWindowResize() {
            this._needResize = true;
        }

        _resize() {
            let width = $(this._canvas).width();
            this._mobile = false;
            this._canvas.width = CanvasView.DESKTOP_WIDTH;
            this._canvas.height = CanvasView.DESKTOP_HEIGHT;

            if (width >= CanvasView.DESKTOP_WIDTH) {
                $(this._canvas).height(CanvasView.DESKTOP_HEIGHT);
                this._canvas.width = width;
                this._shiftX = (width - CanvasView.DESKTOP_WIDTH) / 2;
            }
            else if (width >= CanvasView.MOBILE_WIDTH) {
                let canvasElementHeight = width * CanvasView.DESKTOP_HEIGHT / CanvasView.DESKTOP_WIDTH;
                $(this._canvas).height(canvasElementHeight);
                this._canvas.width = CanvasView.DESKTOP_WIDTH;
                this._shiftX = 0;
            }
            else {
                let canvasElementHeight = width / CanvasView.MOBILE_WIDTH * CanvasView.MOBILE_HEIGHT;
                $(this._canvas).height(canvasElementHeight);
                this._canvas.width = CanvasView.MOBILE_WIDTH;
                this._shiftX = 0;
                this._mobile = true;
                this._canvas.width = CanvasView.MOBILE_WIDTH;
                this._canvas.height = CanvasView.MOBILE_HEIGHT;
            }
            this._needResize = false;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.CanvasView = CanvasView;
}();