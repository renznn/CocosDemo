// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import BaseComponent from "../common/BaseComponent";

@ccclass
export default class Update extends cc.Component {

    @property({ type: cc.Asset })
    manifestUrl = null

    @property(cc.Button)
    updateBtn = null

    _updating = false
    _canRetry = false
    _storagePath: string = null
    _am = null
    _updateListener = null
    _failCount = null
    _checkListener = null


    onLoad() {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }


        this.updateBtn.node.on("click", this.hotUpdate, this)

        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'jxy-remote-asset');
        console.log('Storage path for remote asset : ' + this._storagePath);

        console.log(jsb)
        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        console.log(this._am)

        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                console.log("Verification passed : " + relativePath)
                return true;
            }
            else {
                console.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')')
                return true;
            }
        });

        console.log("Hot update is ready, please check or directly update.")

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            console.log("Max concurrent tasks count have been limited to 2")
        }

        // this.panel.fileProgress.progress = 0;
        // this.panel.byteProgress.progress = 0;

    }

    versionCompareHandle(versionA, versionB) {
        console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    }


    updateCb(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('No local manifest file found, hot update skipped.')
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                // this.panel.byteProgress.progress = event.getPercent();
                // this.panel.fileProgress.progress = event.getPercentByFile();

                // this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                console.log(event.getPercent(), event.getPercentByFile())
                var msg = event.getMessage();
                if (msg) {
                    console.log('Updated file: ' + msg)
                    // console.log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log('Fail to download manifest file, hot update skipped.')
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('Already up to date with the latest remote version.')
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('Update finished. ' + event.getMessage())
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log('Update failed. ' + event.getMessage())
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage())
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log(event.getMessage())
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    }


    hotUpdate() {
        console.log("hot update in")
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                var url = this.manifestUrl.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
            }

            this._failCount = 0;
            this._am.update();
            // this.panel.updateBtn.active = false;
            this._updating = true;
        }
    }

    checkCb(event) {
        console.log('Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.")
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped.")
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("Already up to date with the latest remote version.")
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                console.log('New version found, please try to update.')
                // this.panel.checkBtn.active = false;
                // this.panel.fileProgress.progress = 0;
                // this.panel.byteProgress.progress = 0;
                break;
            default:
                return;
        }

        this._am.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
    }

    checkUpdate() {
        if (this._updating) {
            console.log('Checking or updating ...')
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            var url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._am.loadLocalManifest(url);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            console.log('Failed to load local manifest ...')
            return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));

        this._am.checkUpdate();
        this._updating = true;
    }

    retry() {
        if (!this._updating && this._canRetry) {
            // this.panel.retryBtn.active = false;
            this._canRetry = false;

            console.log('Retry failed Assets...')
            this._am.downloadFailedAssets();
        }
    }


    start() {
        this.checkUpdate()
    }

    update(dt) { }

    onDestroy() {
        if (this._updateListener) {
            this._am.setEventCallback(null);
            this._updateListener = null;
        }
    }

}
