!function() {
    let Sounds = window.classes.Sounds;

    class RouletteSounds extends Sounds{

        static loadAll() {
            let urls = {
                'sounds/roulette/vo_0.mp3': false,
                'sounds/roulette/vo_1.mp3': false,
                'sounds/roulette/vo_2.mp3': false,
                'sounds/roulette/vo_3.mp3': false,
                'sounds/roulette/vo_4.mp3': false,
                'sounds/roulette/vo_5.mp3': false,
                'sounds/roulette/vo_6.mp3': false,
                'sounds/roulette/vo_7.mp3': false,
                'sounds/roulette/vo_8.mp3': false,
                'sounds/roulette/vo_9.mp3': false,
                'sounds/roulette/vo_10.mp3': false,
                'sounds/roulette/vo_11.mp3': false,
                'sounds/roulette/vo_12.mp3': false,
                'sounds/roulette/vo_13.mp3': false,
                'sounds/roulette/vo_14.mp3': false,
                'sounds/roulette/vo_15.mp3': false,
                'sounds/roulette/vo_16.mp3': false,
                'sounds/roulette/vo_17.mp3': false,
                'sounds/roulette/vo_18.mp3': false,
                'sounds/roulette/vo_19.mp3': false,
                'sounds/roulette/vo_20.mp3': false,
                'sounds/roulette/vo_21.mp3': false,
                'sounds/roulette/vo_22.mp3': false,
                'sounds/roulette/vo_23.mp3': false,
                'sounds/roulette/vo_24.mp3': false,
                'sounds/roulette/vo_25.mp3': false,
                'sounds/roulette/vo_26.mp3': false,
                'sounds/roulette/vo_27.mp3': false,
                'sounds/roulette/vo_28.mp3': false,
                'sounds/roulette/vo_29.mp3': false,
                'sounds/roulette/vo_30.mp3': false,
                'sounds/roulette/vo_31.mp3': false,
                'sounds/roulette/vo_32.mp3': false,
                'sounds/roulette/vo_33.mp3': false,
                'sounds/roulette/vo_34.mp3': false,
                'sounds/roulette/vo_35.mp3': false,
                'sounds/roulette/vo_36.mp3': false,

                'sounds/roulette/ambient.mp3': true,
                'sounds/roulette/win.mp3': false,
                'sounds/roulette/loose.mp3': false,
                'sounds/roulette/reelspin_loop.mp3': true,
                'sounds/roulette/spin_end.mp3': false,
                'sounds/roulette/stop_wheel.mp3': false,
                'sounds/roulette/vo_place_your_bets_please.mp3': false,
                'sounds/roulette/click_fishka.mp3': false,
                'sounds/roulette/mini_popup_stavka.mp3': false,
                'sounds/roulette/mini_popup_stavka_min_max.mp3': false,
                'sounds/roulette/switch_table.mp3': false,

                'sounds/roulette/click_double.mp3': false,
                'sounds/roulette/click_undo.mp3': false,
                'sounds/roulette/click_clear.mp3': false,
                'sounds/roulette/click_repeat.mp3': false,
                'sounds/roulette/click_spin.mp3': false,
                'sounds/roulette/navedenie_pole.mp3': false,
            };
            Sounds.load(urls);
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.RouletteSounds = RouletteSounds;
}();