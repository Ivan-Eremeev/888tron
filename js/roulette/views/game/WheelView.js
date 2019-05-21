!function() {
    let Sounds = window.classes.Sounds;
    let CellColor = window.classes.CellColor;
    let StateModel = window.classes.StateModel;

    class WheelView {

        /**
         * @return {Number}
         * @constructor
         */
        static get DEFAULT_BALL_RADIUS() {
            return 175;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get END_BALL_RADIUS() {
            return 97;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get BALL_MILLISECONDS_ON_ROUND() {
            return 1200;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get NUMBERS_MILLISECONDS_ON_ROUND() {
            return 4000;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get MILLISECONDS_TO_STOP_BALL() {
            return 2500;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get ANGLE_TO_STOP_BALL() {
            return 180;
        }

        /**
         * @return {Number}
         * @constructor
         */
        static get ROULETTE_ANGLE_SHIFT_ON_IMAGE() {
            return -2;
        }

        /**
         * Event
         * @return {String}
         */
        static get ANIMATION_COMPLETE_EVENT() {
            return 'ANIMATION_COMPLETE_EVENT';
        }

        /**
         * @param canvas {CanvasView}
         * @param imagesModel {window.classes.ImagesModel}
         * @param stateModel {window.classes.StateModel}
         * @param resultModel {window.classes.ResultModel}
         */
        constructor(canvas, imagesModel, stateModel, resultModel) {
            this._canvas = canvas;
            this._imagesModel = imagesModel;
            this._stateModel = stateModel;
            this._resultModel = resultModel;

            this._ballTween = null;

            $(this._stateModel).on(StateModel.CHANGE_EVENT, this._onStateModelChange.bind(this));
        }

        // TODO refactoring this shit
        _onStateModelChange() {
            if (this._stateModel.state === StateModel.GAME) {
                this._removeBallAnimation();
                this._removeNumbersAnimation();
                this._removeNumbersAnimation();
            }
            else if (this._stateModel.state === StateModel.WAITING_RESPONSE) {
                Sounds.getSound('sounds/roulette/reelspin_loop.mp3').play();
                this._alpha = 0;
                this._resultAlpha = 0;
                this._numbersAngle = 360;
                this._ballAngle = 0;
                this._resultFontSize = 90;
                this._winFontSize = 0;
                this._ballRadius = WheelView.DEFAULT_BALL_RADIUS;
                this._startInitialAnimation();
            }
            if (this._stateModel.state === StateModel.SHOW_RESULT) {
                this._startResultAnimation();
            }
        }

        _removeBallAnimation() {
            if (this._ballTween) TWEEN.remove(this._ballTween);
            this._ballTween = null;
        }

        _removeBallRadiusAnimation() {
            if (this._ballRadiusTween) TWEEN.remove(this._ballRadiusTween);
            this._ballRadiusTween = null;
        }

        _removeNumbersAnimation() {
            if (this._numbersTween) TWEEN.remove(this._numbersTween);
            this._numbersTween = null;
        }

        _startInitialAnimation() {
            this._removeBallAnimation();
            this._removeNumbersAnimation();
            new TWEEN.Tween(this)
                .to({_alpha: 1}, 300)
                .start();
            this._numbersTween = new TWEEN.Tween(this)
                .to({_numbersAngle: 0}, WheelView.NUMBERS_MILLISECONDS_ON_ROUND)
                .repeat(Infinity)
                .start();
            this._ballTween = new TWEEN.Tween(this)
                .to({_ballAngle: 360}, WheelView.BALL_MILLISECONDS_ON_ROUND)
                .repeat(Infinity)
                .start();
        }

        _startResultAnimation() {
            this._ballAngleAfterStop = this._ballAngle + WheelView.ANGLE_TO_STOP_BALL - this._getAngleByResult();
            this._numbersAngleAfterStop = this._numbersAngle -
                360 / WheelView.NUMBERS_MILLISECONDS_ON_ROUND * WheelView.MILLISECONDS_TO_STOP_BALL;
            this._angleToSync = this._getAngleToSync(this._numbersAngleAfterStop, this._ballAngleAfterStop);
            this._ballSpeed = 360 / WheelView.BALL_MILLISECONDS_ON_ROUND;
            this._numbersSpeed = 360 / WheelView.NUMBERS_MILLISECONDS_ON_ROUND;
            this._totalSpeed = this._ballSpeed + this._numbersSpeed;
            this._timeToSync = this._angleToSync / this._totalSpeed;

            let ballAngleNew = this._ballAngle + this._timeToSync * this._ballSpeed;
            let numbersAngleNew = this._numbersAngle - this._timeToSync * this._numbersSpeed;

            this._removeBallAnimation();
            this._removeNumbersAnimation();
            new TWEEN.Tween(this)
                .to({_ballAngle: ballAngleNew, _numbersAngle: numbersAngleNew}, this._timeToSync)
                .onComplete(() => {
                    let ballAngleEnd = ballAngleNew + WheelView.ANGLE_TO_STOP_BALL;
                    let numbersAngleEnd = numbersAngleNew -
                        360 / WheelView.NUMBERS_MILLISECONDS_ON_ROUND * WheelView.MILLISECONDS_TO_STOP_BALL;
                    this._ballTween = new TWEEN.Tween(this)
                        .to({_ballAngle: ballAngleEnd}, WheelView.MILLISECONDS_TO_STOP_BALL)
                        .easing(TWEEN.Easing.Cubic.Out)
                        .start();
                    this._ballRadiusTween = new TWEEN.Tween(this)
                        .to({_ballRadius: WheelView.END_BALL_RADIUS}, WheelView.MILLISECONDS_TO_STOP_BALL)
                        .easing(TWEEN.Easing.Bounce.Out)
                        .start();
                    setTimeout(() => Sounds.getSound('sounds/roulette/spin_end.mp3').play(), 700);
                    new TWEEN.Tween(this)
                        .to({_numbersAngle: numbersAngleEnd}, WheelView.MILLISECONDS_TO_STOP_BALL)
                        .onComplete(() => {
                            this._removeBallRadiusAnimation();
                            this._removeBallAnimation();
                            this._removeNumbersAnimation();
                            Sounds.getSound('sounds/roulette/reelspin_loop.mp3').pause();
                            Sounds.getSound('sounds/roulette/stop_wheel.mp3').play();
                            this._ballTween = new TWEEN.Tween(this)
                                .to({_ballAngle: ballAngleEnd - 360, _numbersAngle: numbersAngleEnd - 360}, WheelView.NUMBERS_MILLISECONDS_ON_ROUND)
                                .repeat(Infinity)
                                .start();
                        })
                        .start();
                })
                .start();

            let circleTween = new TWEEN.Tween(this)
                .to({_resultAlpha: 1}, 300)
                .delay(4500);
            circleTween.start();

            this._resultFontSize = 1;
            new TWEEN.Tween(this)
                .to({_resultFontSize: 90}, 1000)
                .easing(TWEEN.Easing.Bounce.Out)
                .delay(4500)
                .onComplete(() => {
                    Sounds.getSound('sounds/roulette/vo_' + this._resultModel.number + '.mp3').play();
                })
                .start();

            this._winFontSize = 0;
            new TWEEN.Tween(this)
                .to({_winFontSize: 60}, 800)
                .onStart(() => {
                    if (this._resultModel.win)
                        Sounds.getSound('sounds/roulette/win.mp3').play();
                    else
                        Sounds.getSound('sounds/roulette/loose.mp3').play();
                })
                .delay(5500)
                .easing(TWEEN.Easing.Bounce.Out)
                .start();

            new TWEEN.Tween(this)
                .to({_alpha: 0, _resultAlpha: 0}, 300)
                .delay(7500)
                .onComplete(() => {
                    $(this).trigger(WheelView.ANIMATION_COMPLETE_EVENT);
                })
                .start();
        }

        /**
         * Returns the distance in degrees that a circle and a ball must pass together to sync.
         * Ball spin clockwise;
         * Circle of numbers spin counter-clockwise;
         * @param numberAngle {Number} Example:
         *     330
         * @param ballAngle {Number} Example:
         *     300
         * @return {Number} Example:
         *     10
         * @private
         */
        _getAngleToSync(numberAngle, ballAngle) {
            numberAngle = this._normalizeAngle(numberAngle);
            ballAngle = this._normalizeAngle(ballAngle);
            let angle = numberAngle - ballAngle;
            return this._normalizeAngle(angle);
        }

        /**
         * Return angle between 0 and 360.
         * @param angle {Number} Example:
         *     -455
         * @return {Number} Example:
         *     265
         * @private
         */
        _normalizeAngle(angle) {
            return (angle % 360 + 360) % 360;
        }

        /**
         * Return angle for result slot on Circle of numbers.
         * @return {Number}
         * @private
         */
        _getAngleByResult() {
            return CellColor.NUMBERS.indexOf(this._resultModel.number) * 360 / CellColor.NUMBERS.length + WheelView.ROULETTE_ANGLE_SHIFT_ON_IMAGE;
        }

        update() {
            this._updateVail();
            this._updateWheelStatic();
            this._updateWheelNumbers();
            this._updateWheelBall();
            this._updateWheelLightMap();
            this._updateResult();
            this._updateWin();
        }

        _updateVail() {
            if (this._stateModel.state !== StateModel.WAITING_RESPONSE &&
                this._stateModel.state !== StateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this._canvas.context.fillRect(0, 0, this._canvas.canvas.width, this._canvas.canvas.height);
            this._canvas.context.restore();
        }

        _updateWheelStatic() {
            if (this._stateModel.state !== StateModel.WAITING_RESPONSE &&
                this._stateModel.state !== StateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.translate(this._canvas.canvas.width / 2, this._canvas.canvas.height / 2);
            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheel/static.png'), -240, -240, 480, 480);
            this._canvas.context.restore();
        }

        _updateWheelNumbers() {
            if (this._stateModel.state !== StateModel.WAITING_RESPONSE &&
                this._stateModel.state !== StateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.translate(this._canvas.canvas.width / 2, this._canvas.canvas.height / 2);
            this._canvas.context.rotate(this._numbersAngle * Math.PI / 180);
            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheel/numbers.png'), -240, -240, 480, 480);
            this._canvas.context.restore();
        }

        _updateWheelBall() {
            if (this._stateModel.state !== StateModel.WAITING_RESPONSE &&
                this._stateModel.state !== StateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.translate(this._canvas.canvas.width / 2, this._canvas.canvas.height / 2);
            this._canvas.context.rotate(this._ballAngle * Math.PI / 180);
            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheel/ball.png'), -15, -this._ballRadius - 15, 30, 30);
            this._canvas.context.restore();
        }

        _updateWheelLightMap() {
            if (this._stateModel.state !== StateModel.WAITING_RESPONSE &&
                this._stateModel.state !== StateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._alpha;
            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheel/light-map.png'), (this._canvas.canvas.width - 480) / 2, (this._canvas.canvas.height - 480) / 2, 480, 480);
            this._canvas.context.restore();
        }

        _updateResult() {
            if (this._stateModel.state !== StateModel.SHOW_RESULT) return;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._resultAlpha;
            this._canvas.context.fillStyle = CellColor.getColor(this._resultModel.number);
            this._canvas.context.beginPath();
            this._canvas.context.arc(this._canvas.canvas.width / 2, this._canvas.canvas.height / 2, 88, 0, 2 * Math.PI);
            this._canvas.context.fill();

            this._canvas.context.drawImage(this._imagesModel.getImage('img/roulette/wheel/result-light-map.png'), (this._canvas.canvas.width - 480) / 2, (this._canvas.canvas.height - 480) / 2, 480, 480);

            this._canvas.context.font = this._resultFontSize + 'px bold Helvetica,Arial,Courier,monospace';
            this._canvas.context.fillStyle = 'white';
            this._canvas.context.textAlign = 'center';
            this._canvas.context.fillText(this._resultModel.number, this._canvas.canvas.width / 2, this._canvas.canvas.height / 2 + this._resultFontSize / 2.5);

            let text = this._resultModel.win ? 'WIN' : 'NO WIN';
            this._canvas.context.font = '18px bold Helvetica,Arial,Courier,monospace';
            this._canvas.context.fillStyle = 'white';
            this._canvas.context.textAlign = 'center';
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2, this._canvas.canvas.height / 2 + 70);

            text = this._getLowHighText();
            this._canvas.context.font = '16px bold Helvetica,Arial,Courier,monospace';
            this._canvas.context.fillStyle = 'white';
            this._canvas.context.textAlign = 'left';
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2 - 55, this._canvas.canvas.height / 2 -50);

            text = this._getOddText();
            this._canvas.context.font = '16px bold Helvetica,Arial,Courier,monospace';
            this._canvas.context.fillStyle = 'white';
            this._canvas.context.textAlign = 'right';
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2 + 55, this._canvas.canvas.height / 2 -50);

            this._canvas.context.restore();
        }

        _updateWin() {
            if (this._stateModel.state !== StateModel.SHOW_RESULT) return;
            if (!this._resultModel.win) return;
            if (!this._resultModel.prize) return;
            if (!this._winFontSize) return;

            let price = parseInt(this._resultModel.prize * 1000) / 1000;
            this._canvas.context.save();
            this._canvas.context.globalAlpha = this._resultAlpha;
            this._canvas.context.font = this._winFontSize + 'px bold Helvetica,Arial,Courier,monospace';
            this._canvas.context.textAlign = 'center';
            this._canvas.context.shadowColor = "#000";
            this._canvas.context.shadowBlur = 20;

            let textBaseY = this._canvas.canvas.height / 2 + 90;
            let gradient = this._canvas.context.createLinearGradient(0, textBaseY - this._winFontSize, 0, textBaseY);
            gradient.addColorStop(0, '#FFFF00');
            gradient.addColorStop(1, '#BB9900');
            this._canvas.context.fillStyle = gradient;
            let text = 'WIN';
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2, textBaseY);
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2, textBaseY);
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2, textBaseY);
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2, textBaseY);

            gradient = this._canvas.context.createLinearGradient(0, textBaseY, 0, textBaseY + this._winFontSize);
            gradient.addColorStop(0, '#FFFF00');
            gradient.addColorStop(1, '#BB9900');
            this._canvas.context.fillStyle = gradient;
            text = price.toLocaleString() +  ' TRX';
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2, textBaseY + this._winFontSize);
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2, textBaseY + this._winFontSize);
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2, textBaseY + this._winFontSize);
            this._canvas.context.fillText(text, this._canvas.canvas.width / 2, textBaseY + this._winFontSize);
            this._canvas.context.restore();
        }

        _getLowHighText() {
            if (this._resultModel.number === 0) return '';
            return (this._resultModel.number < 19) ? 'LOW' : 'HIGH';
        }

        _getOddText() {
            if (this._resultModel.number === 0) return '';
            return (this._resultModel.number % 2) ? 'ODD' : 'EVEN';
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.WheelView = WheelView;
}();