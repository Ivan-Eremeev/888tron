!function() {
    let ShowFirstTimeChecker = window.classes.ShowFirstTimeChecker;
    let ChipsNavigationView = window.classes.ChipsNavigationView;
    let LimitsNavigationView = window.classes.LimitsNavigationView;
    let CanvasView = window.classes.CanvasView;
    let GameView = window.classes.GameView;
    let ButtonsNavigationView = window.classes.ButtonsNavigationView;

    class RootView {

        /**
         * @type {String}
         */
        static get CANVAS_ID() {
            return '#rouletteCanvas';
        }

        /**
         * @param model {RootModel}
         */
        constructor(model) {
            this._chipsNavigation = new ChipsNavigationView(model.chipsNavigation, '.roulette-navigation-chip-xxxx-js', 'xxxx');
            this._limitsNavigation = new LimitsNavigationView(model.data.table, model.result, '.limit-min-js', '.limit-max-js', '.limit-bet-js', '.limit-paid-js');
            this._buttonsNavigation = new ButtonsNavigationView(
                model.state,
                model.data.table,
                '#gameRoulette .double-js',
                '#gameRoulette .half-js',
                '#gameRoulette .undo-js',
                '#gameRoulette .re-bet-js',
                '#gameRoulette .clear-js',
                '#switch-id3',
                '#spinRouletteButton'
            );
            this._checker = new ShowFirstTimeChecker(RootView.CANVAS_ID);
            let canvas = new CanvasView(RootView.CANVAS_ID);
            this._game = new GameView(model, canvas);
        }

        /**
         * @return {ChipsNavigationView}
         */
        get chipsNavigation() {
            return this._chipsNavigation;
        }

        /**
         * @return {ButtonsNavigationView}
         */
        get buttonsNavigation() {
            return this._buttonsNavigation;
        }

        /**
         * @return {GameView}
         */
        get game() {
            return this._game;
        }

        /**
         * @return {ShowFirstTimeChecker}
         */
        get checker() {
            return this._checker;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.RootView = RootView;
}();