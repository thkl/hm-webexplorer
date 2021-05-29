import { CCUAddon } from "../_interface/ccu/addon";
import { DataService } from "../_service/data.service";

export class CoreProvider {
    constructor(
        private dataService: DataService
    ) {

    }

    refresh() {

    }

    fetchLogFile(logType): Promise<string> {
        return new Promise(resolve => {
            this.dataService.networkService.getLogData(`core/log/${logType}`).then(result => {
                result.text().then(text => {
                    resolve(text)
                })
            })
        })
    }

    fetchAddons(): Promise<CCUAddon[]> {
        return new Promise(resolve => {
            const addonList = []
            this.dataService.networkService.getJsonData(`addons`).then(result => {
                if (result) {
                    Object.keys(result).forEach(id => {
                        const hma = result[id];
                        addonList.push({ id: id, name: hma.name, config: hma.config, operations: hma.operations, update: hma.update, version: hma.version })
                    })
                }
                resolve(addonList);
            })
        })
    }

    restartAddon(addon: CCUAddon): Promise<any> {
        return this.dataService.networkService.getJsonData(`addons/${addon.id}/restart`)
    }
}