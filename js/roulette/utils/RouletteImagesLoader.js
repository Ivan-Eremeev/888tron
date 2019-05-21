!function() {
    let ImagesLoader = window.classes.ImagesLoader;

    class RouletteImagesLoader extends ImagesLoader {

        /**
         * @return {String[]}
         * @constructor
         */
        static get IMAGES() {
            return [
                'img/roulette/background.jpg',

                'img/roulette/wheel/ball.png',
                'img/roulette/wheel/light-map.png',
                'img/roulette/wheel/numbers.png',
                'img/roulette/wheel/static.png',
                'img/roulette/wheel/result-light-map.png',

                'img/roulette/chips/10_.svg',
                'img/roulette/chips/20_.svg',
                'img/roulette/chips/50_.svg',
                'img/roulette/chips/100_.svg',
                'img/roulette/chips/250_.svg',
                'img/roulette/chips/500_.svg',
                'img/roulette/chips/1000_.svg',

                'img/roulette/table/horizontal/0.svg',
                'img/roulette/table/horizontal/1-18.svg',
                'img/roulette/table/horizontal/19-36.svg',
                'img/roulette/table/horizontal/col1.svg',
                'img/roulette/table/horizontal/col3.svg',
                'img/roulette/table/horizontal/table.svg',

                'img/roulette/table/vertical/0.svg',
                'img/roulette/table/vertical/1-18.svg',
                'img/roulette/table/vertical/19-36.svg',
                'img/roulette/table/vertical/col1.svg',
                'img/roulette/table/vertical/col3.svg',
                'img/roulette/table/vertical/table.svg',

                'img/roulette/track/horizontal/0.svg',
                'img/roulette/track/horizontal/3.svg',
                'img/roulette/track/horizontal/5.svg',
                'img/roulette/track/horizontal/8.svg',
                'img/roulette/track/horizontal/10.svg',
                'img/roulette/track/horizontal/23.svg',
                'img/roulette/track/horizontal/26.svg',
                'img/roulette/track/horizontal/orph.svg',
                'img/roulette/track/horizontal/tier.svg',
                'img/roulette/track/horizontal/track.svg',
                'img/roulette/track/horizontal/voisins.svg',
                'img/roulette/track/horizontal/zero.svg',

                'img/roulette/track/vertical/0.svg',
                'img/roulette/track/vertical/3.svg',
                'img/roulette/track/vertical/5.svg',
                'img/roulette/track/vertical/8.svg',
                'img/roulette/track/vertical/10.svg',
                'img/roulette/track/vertical/23.svg',
                'img/roulette/track/vertical/26.svg',
                'img/roulette/track/vertical/orph.svg',
                'img/roulette/track/vertical/tier.svg',
                'img/roulette/track/vertical/track.svg',
                'img/roulette/track/vertical/voisins.svg',
                'img/roulette/track/vertical/zero.svg'
            ]
        }

        constructor() {
            super(RouletteImagesLoader.IMAGES);
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.RouletteImagesLoader = RouletteImagesLoader;
}();