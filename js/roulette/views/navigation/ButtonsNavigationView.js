!function() {
    let Sounds = window.classes.Sounds;
    let StateModel = window.classes.StateModel;
    let CellsModel = window.classes.CellsModel;

    class ButtonsNavigationView {

        /**
         * Event
         * @return {String}
         */
        static get DOUBLE_EVENT() {
            return 'DOUBLE_EVENT';
        }

        /**
         * Event
         * @return {String}
         */
        static get HALF_EVENT() {
            return 'HALF_EVENT';
        }

        /**
         * Event
         * @return {String}
         */
        static get UNDO_EVENT() {
            return 'UNDO_EVENT';
        }

        /**
         * Event
         * @return {String}
         */
        static get RE_BET_EVENT() {
            return 'RE_BET_EVENT';
        }

        /**
         * Event
         * @return {String}
         */
        static get CLEAR_EVENT() {
            return 'CLEAR_EVENT';
        }

        /**
         * Event
         * @return {String}
         */
        static get SPIN_EVENT() {
            return 'SPIN_EVENT';
        }

        /**
         * @param stateModel {StateModel}
         * @param cellsModel {CellsModel}
         * @param doubleButton {String} Example:
         *     '#button',
         * @param halfElement {String} Example:
         *     '#button',
         * @param undoButton {String} Example:
         *     '#button',
         * @param reBetButton {String} Example:
         *     '#button',
         * @param clearElement {String} Example:
         *     '#button',
         * @param spinButton {String} Example:
         *     '#button',
         * @param switchElement {String} Example:
         *     '#button',
         */
        constructor(
            stateModel,
            cellsModel,
            doubleButton,
            halfElement,
            undoButton,
            reBetButton,
            clearElement,
            switchElement,
            spinButton,
        ) {
            this._stateModel = stateModel;
            this._cellsModel = cellsModel;
            this._doubleButton = $(doubleButton);
            this._halfElement = $(halfElement);
            this._undoButton = $(undoButton);
            this._reBetButton = $(reBetButton);
            this._clearElement = $(clearElement);
            this._switchElement = $(switchElement);
            this._spinButton = $(spinButton);

            $(this._stateModel).on(StateModel.CHANGE_EVENT, this._update.bind(this));
            $(this._cellsModel).on(CellsModel.CHANGE_VALUE_EVENT, this._update.bind(this));

            $(this._doubleButton).click(this._onDoubleClick.bind(this));
            $(this._halfElement).click(this._onHalfClick.bind(this));
            $(this._undoButton).click(this._onUndoClick.bind(this));
            $(this._reBetButton).click(this._onReBetClick.bind(this));
            $(this._clearElement).click(this._onClearClick.bind(this));
            $(this._spinButton).click(this._onSpinClick.bind(this));
            this._update();
        }

        /**
         * @return {Boolean}
         */
        get switchIsChecked() {
            return $(this._switchElement).is(':checked');
        }

        _onDoubleClick() {
            let sound = Sounds.getSound('sounds/roulette/click_double.mp3');
            sound.currentTime = 0;
            sound.play();
            $(this).trigger(ButtonsNavigationView.DOUBLE_EVENT);
        }

        _onHalfClick() {
            let sound = Sounds.getSound('sounds/roulette/click_double.mp3');
            sound.currentTime = 0;
            sound.play();
            $(this).trigger(ButtonsNavigationView.HALF_EVENT);
        }

        _onUndoClick() {
            let sound = Sounds.getSound('sounds/roulette/click_undo.mp3');
            sound.currentTime = 0;
            sound.play();
            $(this).trigger(ButtonsNavigationView.UNDO_EVENT);
        }

        _onReBetClick() {
            let sound = Sounds.getSound('sounds/roulette/click_repeat.mp3');
            sound.currentTime = 0;
            sound.play();
            $(this).trigger(ButtonsNavigationView.RE_BET_EVENT);
        }

        _onClearClick() {
            let sound = Sounds.getSound('sounds/roulette/click_clear.mp3');
            sound.currentTime = 0;
            sound.play();
            $(this).trigger(ButtonsNavigationView.CLEAR_EVENT);
        }

        _onSpinClick() {
            let sound = Sounds.getSound('sounds/roulette/click_spin.mp3');
            sound.currentTime = 0;
            sound.play();
            $(this).trigger(ButtonsNavigationView.SPIN_EVENT);
        }

        _update() {
            this._updateBetButtons();
            this._updateSpitButton();
        }

        _updateBetButtons() {
            if (this._stateModel.state === StateModel.GAME) {
                $(this._doubleButton).removeAttr('disabled');
                $(this._halfElement).removeAttr('disabled');
                $(this._undoButton).removeAttr('disabled');
                $(this._reBetButton).removeAttr('disabled');
                $(this._clearElement).removeAttr('disabled');
            }
            else {
                $(this._doubleButton).attr('disabled', 'disabled');
                $(this._halfElement).attr('disabled', 'disabled');
                $(this._undoButton).attr('disabled', 'disabled');
                $(this._reBetButton).attr('disabled', 'disabled');
                $(this._clearElement).attr('disabled', 'disabled');
            }
        }

        _updateSpitButton() {
            if (this._stateModel.state === StateModel.GAME &&
                this._cellsModel.total >= CellsModel.MIN &&
                this._cellsModel.total <= CellsModel.MAX
            ) {
                $(this._spinButton).removeAttr('disabled');
            }
            else {
                $(this._spinButton).attr('disabled', 'disabled');
            }
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.ButtonsNavigationView = ButtonsNavigationView;
}();