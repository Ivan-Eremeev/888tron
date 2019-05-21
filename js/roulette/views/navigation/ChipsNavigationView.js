!function() {
    let ChipsNavigationModel = window.classes.ChipsNavigationModel;

    class ChipsNavigationView {
        /**
         * Event.
         * @return String
         */
        static get CLICK_EVENT() {
            return 'CLICK_EVENT';
        }

        /**
         * Event.
         * @return String
         */
        static get ACTIVE_CLASS_NAME() {
            return 'active';
        }

        /**
         * @param model {ChipsNavigationModel}
         * @param cssClass {String} Example:
         *     '.roulette-navigation-chip-xxxx-js',
         * @param cssClassPartForReplace {String} Example:
         *     'xxxx'
         */
        constructor(model, cssClass, cssClassPartForReplace) {
            this._model = model;
            this._chips = model;

            this._index = -1;

            this._chip = $('<img src="img/roulette/chips/10.svg">');
            $('body').append(this._chip);
            $(this._chip).css('position', 'fixed');
            $(this._chip).css('width', '30px');
            $(this._chip).css('height', '30px');
            $(this._chip).css('top', 0);
            $(this._chip).css('left', 0);
            $(this._chip).css('pointer-events', 'none');
            $(this._chip).hide();

            for (let i = 0; i < this._model.length; i++) {
                let value = this._model.getValueByIndex(i);
                let className = cssClass.replace(cssClassPartForReplace, value);
                let chip = $(className);
                $(chip).data('index', i);
                $(chip).on('mousedown', this._onChipMouseDown.bind(this));
                $(chip).on('touchstart', this._onChipTouchStart.bind(this));
                this._chips[i] = chip;
            }


            $(this._model).on(ChipsNavigationModel.CHANGE_EVENT, this._update.bind(this));
            window.addEventListener('mousemove', this._onWindowMouseMove.bind(this), { passive: false });
            window.addEventListener('touchmove', this._onWindowTouchMove.bind(this), { passive: false });
            window.addEventListener('mouseup', this._onChipTouchMouseUp.bind(this), { passive: false });
            window.addEventListener('touchend', this._onChipTouchEnd.bind(this), { passive: false });
            this._update();
        }

        /**
         * @param event {Object}
         * @param event.currentTarget {Object}
         * @private
         */
        _onChipMouseDown(event) {
            this._chipInDrag = true;
            let index = $(event.currentTarget).data('index');
            if (this._index !== index) {
                $(this).trigger(ChipsNavigationView.CLICK_EVENT, index);
                this._index = index;
            }
            $(this._chip).attr('src', $(event.target).attr('src'));
            $(this._chip).css('left', event.clientX - 15);
            $(this._chip).css('top', event.clientY - 15);
            $(this._chip).show();
        }

        _onChipTouchStart(event) {
            this._chipInDrag = true;
            let index = $(event.currentTarget).data('index');
            if (this._index !== index) {
                $(this).trigger(ChipsNavigationView.CLICK_EVENT, index);
                this._index = index;
            }
            $(this._chip).attr('src', $(event.target).attr('src'));
            $(this._chip).css('left', event.originalEvent.touches[0].clientX - 15);
            $(this._chip).css('top', event.originalEvent.touches[0].clientY - 15);
            $(this._chip).show();

            if (window.innerWidth < 1190) this._blockScrolling();
        }

        static get _scrollbarWidth() {
            return window.innerWidth - document.documentElement.clientWidth;
        }

        _onChipTouchMouseUp(event)  {
            if (this._chipInDrag) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                $(this._chip).hide();
                this._unBlockScrolling();
                this._model.triggerMouseDrop();
                this._chipInDrag = false;
            }
        }
        /**
         * @param event {Object}
         * @private
         */
        _onChipTouchEnd(event) {
            if (this._chipInDrag) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                $(this._chip).hide();
                this._unBlockScrolling();
                this._model.triggerDrop();
                this._chipInDrag = false;
            }
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

        _onWindowMouseMove(event) {
            $(this._chip).css('left', event.clientX - 15);
            $(this._chip).css('top', event.clientY - 15);
        }

        _onWindowTouchMove(event) {
            if (this._block) event.preventDefault();
            let touch = event.touches[0] || event.changedTouches[0];
            $(this._chip).css('left', touch.clientX - 15);
            $(this._chip).css('top', touch.clientY - 15);
        }

        _update() {
            for (let i = 0; i < this._model.length; i++) {
                let chip = this._chips[i];
                $(chip).removeClass(ChipsNavigationView.ACTIVE_CLASS_NAME);
            }
            let chip = this._chips[this._model.index];
            $(chip).addClass(ChipsNavigationView.ACTIVE_CLASS_NAME);
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.ChipsNavigationView = ChipsNavigationView;
}();