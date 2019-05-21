!function () {
    let Data = window.classes.Data;

    class DataNames {

        /**
         * @param serverId {Number}
         * @return {String}
         */
        static getName(serverId) {
            let data = Data.data();
            for (let i = 0; i < data.table.length; i++) {
                let item = data.table[i];
                if (item.serverId.toString() === serverId.toString()) return item.id.replace('t', '');
            }
            return serverId.toString();
        }

    }

    if (!window.classes) window.classes = {};
    window.classes.DataNames = DataNames;
}();