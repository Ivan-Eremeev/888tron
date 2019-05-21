!function () {
    let StateModel = window.classes.StateModel;
    let ButtonsNavigationView = window.classes.ButtonsNavigationView;
    let WheelView = window.classes.WheelView;

    class ButtonsNavigationController {

        /**
         * @param stateModel {window.classes.StateModel}
         * @param resultModel {window.classes.ResultModel}
         * @param cellsModel {window.classes.CellsModel}
         * @param buttonsNavigationView {window.classes.ButtonsNavigationView}
         * @param wheelView {window.classes.WheelView}
         * @param checker {window.classes.ShowFirstTimeChecker}
         */
        constructor(stateModel, resultModel, cellsModel, buttonsNavigationView, wheelView, checker) {
            this._stateModel = stateModel;
            this._resultModel = resultModel;
            this._cellsModel = cellsModel;
            this._buttonsNavigationView = buttonsNavigationView;
            this._wheelView = wheelView;
            this._checker = checker;

            this._autoplayTimer = null;

            $(this._buttonsNavigationView).on(ButtonsNavigationView.DOUBLE_EVENT, this._onButtonsNavigationDouble.bind(this));
            $(this._buttonsNavigationView).on(ButtonsNavigationView.HALF_EVENT, this._onButtonsNavigationHalf.bind(this));
            $(this._buttonsNavigationView).on(ButtonsNavigationView.UNDO_EVENT, this._onButtonsNavigationUndo.bind(this));
            $(this._buttonsNavigationView).on(ButtonsNavigationView.RE_BET_EVENT, this._onButtonsNavigationReBet.bind(this));
            $(this._buttonsNavigationView).on(ButtonsNavigationView.CLEAR_EVENT, this._onButtonsNavigationClear.bind(this));
            $(this._buttonsNavigationView).on(ButtonsNavigationView.SPIN_EVENT, this._onButtonsNavigationSpin.bind(this));
            $(this._wheelView).on(WheelView.ANIMATION_COMPLETE_EVENT, this._onWheelAnimationComplete.bind(this));
            window.testRoulette = {};
            window.testRoulette.spin = this.___spin.bind(this);
        }

        _onButtonsNavigationDouble() {
            this._cellsModel.double();
        }

        _onButtonsNavigationHalf() {
            this._cellsModel.half();
        }

        _onButtonsNavigationUndo() {
            this._cellsModel.undo();
        }

        _onButtonsNavigationReBet() {
            this._cellsModel.reBet();
        }

        _onButtonsNavigationClear() {
            this._cellsModel.clear();
        }

        _onButtonsNavigationSpin() {
            gtag('event', 'spin', {
                'event_category': 'game'
            });

            if (!window.common.getTronlinkAddress()) {
                $('#tronLinkModal').modal();
                return;
            }

            if (window.common.app.myBalance < this._cellsModel.total) {
                $('#noMoneyModal').modal();
                return;
            }

            this._stateModel.state = StateModel.WAITING_RESPONSE;
            this._contractLoading();
        }

        _findBlockByTxId(startBlockNumber, blockNumber, txId) {
            const duration = 1000;

            return getTronWeb(false).then(tronweb => {

                return tronweb.trx.getBlock(blockNumber).then(block => {

                    log('findBlockByTxId from ' + startBlockNumber + ' current ' + blockNumber + ' ' + txId);

                    if (block) {

                        const tx = block.transactions ? block.transactions.find(tx => {
                            return tx.txID === txId;
                        }) : null;

                        const blockInfo = {
                            blockNumber: blockNumber,
                            hash: block.blockID
                        };

                        //logJson(blockInfo);


                        if (tx) {
                            logLine('founded tx', tx);
                            const txRes = (tx.ret && tx.ret.length) ? tx.ret[0].contractRet : tx;
                            if (txRes === "SUCCESS") {
                                log('find complete', blockInfo.blockNumber);
                                return blockInfo;
                            } else {

                                logError('findBlockByTxId', txRes);
                                return null;
                            }
                        }

                        blockNumber++;
                    }

                    return delay(duration).then(() => {
                        return this._findBlockByTxId(startBlockNumber, blockNumber, txId);
                    })

                    //logJson('block', block);

                }).catch(err => {
                    logError('_findBlockByTxId', err);

                    return delay(duration).then(() => {
                        return this._findBlockByTxId(startBlockNumber, blockNumber, txId);
                    });
                });
            });

        }

        /**
         * TRUE CONTRACT LOAD
         * @private
         */
        _contractLoading() {
            let betDataObject = this._cellsModel.betData;
            let betData = this._getBetData(betDataObject.ids, betDataObject.values);
            console.log('betDataObject', betDataObject);
            console.log('betDataObject pack', betData);

            clearTimeout(this._autoplayTimer);

            getContract(gameManagerAddress, true).then(gameManager => {
                getCurrentBlockNumber().then(blockNumber => {
                    gameManager.createBet(rouletteAddress, getTronlinkAddress(), app.parentUserId, betData).send({
                        feeLimit: 1e7,
                        shouldPollResponse: false,
                        callValue: betDataObject.sum * 1e6
                    }).then(txId => {
                        log('txId', txId);

                        this._findBlockByTxId(blockNumber, blockNumber, txId, 3).then(block => {

                            if(block) {

                                getContract(rouletteAddress).then(contract => {

                                    contract.getWinNumberFromHash(getTronlinkAddress(), '0x' + block.hash).call().then(winIndexBigNumber => {

                                        this._completeFakeLoading(winIndexBigNumber.toNumber());
                                    });
                                });
                            }else{
                                if (this._buttonsNavigationView.switchIsChecked) {
                                    this._contractLoading();
                                }
                                else {
                                    this._stateModel.state = StateModel.GAME;
                                }

                            }

                        });

                    }).catch(err => {

                        logError('createBet', err);

                        if (this._buttonsNavigationView.switchIsChecked) {
                            this._contractLoading();
                        }
                        else {
                            this._stateModel.state = StateModel.GAME;
                        }


                    });
                })
            })
        }

        /**
         * FAKE FOR TEST
         * @private
         */
        _fakeLoading() {
            let betDataObject = this._cellsModel.betData;
            let betData = this._getBetData(betDataObject.ids, betDataObject.values);
            console.log(betData);
            clearTimeout(this._autoplayTimer);
            setTimeout(() => {
                this._completeFakeLoading()
            }, 1500 + Math.random() * 2000)
        }

        /**
         * FAKE FOR TEST
         * @private
         */
        _completeFakeLoading(number) {
            number = (number === undefined) ? Math.floor(Math.random() * 37) : number;
            let win = this._cellsModel.isWin(number);
            let prize = this._cellsModel.getPrize(number);
            this._resultModel.update(number, win, prize);
            this._stateModel.state = StateModel.SHOW_RESULT;
        }

        _onWheelAnimationComplete() {
            this._stateModel.state = StateModel.GAME;

            this._resultModel.triggerPrizeChange();

            // Fix numbers history length
            if (window.roulette.numbers.length > 20) window.roulette.numbers.length = 20;

            // Highlight cell
            let cell = this._cellsModel.getCell(this._resultModel.number.toString());
            cell.highlight();

            if (this._buttonsNavigationView.switchIsChecked) {
                this._cellsModel.saveBet();
                this._autoPlay();
            } else {
                this._cellsModel.clearBet(this._resultModel.number);
            }
        }

        _autoPlay() {
            if (!this._checker.visible) return;
            this._stateModel.state = StateModel.WAITING_RESPONSE;
            this._contractLoading();
        }

        /**
         * FOR TEST
         * @param number
         * @private
         */
        ___spin(number) {
            this._stateModel.state = StateModel.WAITING_RESPONSE;
            clearTimeout(this._autoplayTimer);
            setTimeout(() => {
                this._completeFakeLoading(number)
            }, Math.random() * 500)
        }

        /**
         * @param ids {Number[]}
         * @param values {Number[]}
         * @return {Array}
         * @private
         */
        _getBetData(ids, values) {
            let out = [];
            let start = '0x' + ('0').repeat(58);

            let maxBetIndex = -1;
            for (let i = 0; i < ids.length; i++) {
                let betIndex = ids[i];
                if (betIndex < maxBetIndex) {
                    throw(new Error('indices are not sorted'))
                }
                maxBetIndex = betIndex;
                if (ids > 156) {
                    throw(new Error('invalid index'))
                }
                let betValue = values[i];
                if (betValue <= 0) {
                    throw(new Error('invalid bet amount: too small'));
                }
                let valueString = tronWeb.toHex(betValue).substr(2);
                if (valueString.length > 4) {
                    throw(new Error('invalid bet amount: overflows an uint16'))
                }
                valueString = valueString.padStart(4, '0');
                let betIndexString = tronWeb.toHex(betIndex).substr(2);
                betIndexString = betIndexString.padStart(2, '0');
                out.push(start + valueString + betIndexString)
            }
            return out;
        }
    }

    if (!window.classes) window.classes = {};
    window.classes.ButtonsNavigationController = ButtonsNavigationController;
}();