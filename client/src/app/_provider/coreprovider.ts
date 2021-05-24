import { DataService } from "../_service/data.service";

export class CoreProvider {
    constructor(
        private dataService: DataService
    ) {

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
}