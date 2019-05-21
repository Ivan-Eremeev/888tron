!function() {
    class BackgroundView {

        /**
         * @param canvas {CanvasView}
         * @param imagesModel {ImagesModel}
         */
        constructor(canvas, imagesModel) {
            this._canvas = canvas;
            this._imagesModel = imagesModel;
        }

        update() {
            return;
            let canvas = this._canvas.canvas;
            let context = this._canvas.context;

            let image = this._imagesModel.getImage('img/roulette/background.jpg');
            let imageWidth = image.width;
            let imageHeight = image.height;
            let scale = canvas.height / imageHeight;
            let width = scale * imageWidth;
            context.drawImage(image, (canvas.width - width) / 2, 0, width, canvas.height);

            context.save();
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(image, (canvas.width - width) / 2 - width, 0, width, canvas.height);
            context.drawImage(image, (canvas.width - width) / 2 + width, 0, width, canvas.height);
            context.restore();
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.BackgroundView = BackgroundView;
}();