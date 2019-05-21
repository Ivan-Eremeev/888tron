!function() {
    let RouletteSounds = window.classes.RouletteSounds;
    let Sounds = window.classes.Sounds;
    let ShowFirstTimeChecker = window.classes.ShowFirstTimeChecker;
    let StateModel = window.classes.StateModel;
    let RootModel = window.classes.RootModel;
    let RootView = window.classes.RootView;
    let ChipsNavigationController = window.classes.ChipsNavigationController;
    let ButtonsNavigationController = window.classes.ButtonsNavigationController;
    let ImagesLoader = window.classes.ImagesLoader;
    let RouletteImagesLoader = window.classes.RouletteImagesLoader;
    let FieldController = window.classes.FieldController;

    class RootController {

        /**
         * @return {Number[]}
         */
        static get CHIPS() {
            return [
                10,
                20,
                50,
                100,
                250,
                500,
                1000
            ];
        }

        constructor() {
            this._imagesLoader = new RouletteImagesLoader();
            this._model = new RootModel(RootController.CHIPS);
            this._view = new RootView(this._model);
            new ChipsNavigationController(this._model.chipsNavigation, this._view.chipsNavigation);
            new ButtonsNavigationController(this._model.state, this._model.result, this._model.data.table, this._view.buttonsNavigation, this._view.game.wheel, this._view.checker);
            new FieldController(this._model.chipsNavigation, this._model.data.table, this._model.data.track, this._view.game.field);
            this._checkFirstShow();
        }

        /**
         * Wait first game show.
         * @private
         */
        _checkFirstShow() {
            $(this._view.checker).on(ShowFirstTimeChecker.SHOW_FIRST_TIME_EVENT, this._onShowFirstTime.bind(this));
            this._view.checker.check();
        }

        /**
         * Load images.
         * @private
         */
        _onShowFirstTime() {
            $(this._imagesLoader).on(ImagesLoader.COMPLETE_EVENT, this._onImagesLoaderComplete.bind(this));
            this._imagesLoader.load();
        }

        /**
         * Wait sound manager activation.
         * @private
         */
        _onImagesLoaderComplete() {
            if (!window.soundManager) $(window).on('SOUND_MANAGER_ACTIVATED', this._onSoundManagerActivated.bind(this));
            else this._onSoundManagerActivated();
        }

        /**
         * Start sounds loading and start game timer.
         * @private
         */
        _onSoundManagerActivated() {
            RouletteSounds.loadAll();
            this._model.state.state = StateModel.GAME;
            this._model.images.setLoader(this._imagesLoader);
            this._view.game.init();
            requestAnimationFrame(this._update.bind(this));
        }

        /**
         * Execute every frame.
         * @private
         */
        _update() {
            this._view.game.update();
            requestAnimationFrame(this._update.bind(this));
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.RootController = RootController;
}();