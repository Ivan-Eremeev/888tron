!function() {
    class Sounds {

        /**
         * @param urls {Object} Example:
         *     {
         *         'sounds/roulette/win.mp3': false,
         *         'sounds/roulette/loose.mp3': true'
         *     }
         */
        static load(urls) {
            if (!Sounds.sounds) Sounds.sounds = {};
            for (let url in urls) {
                let loop = urls[url];
                Sounds.sounds[url] = window.soundManager.createSound(url, loop);
            }
        }

        /**
         * @param url {String} Example:
         *     'sounds/roulette/win.mp3'
         */
        static getSound(url) {
            return Sounds.sounds[url];
        }

        static stopAll() {
            for (let url in Sounds.sounds) {
                let sound = Sounds.sounds[url];
                sound.currentTime = 0;
                sound.pause();
            }
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.Sounds = Sounds;
}();