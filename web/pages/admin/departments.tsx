import { propNames } from "@chakra-ui/react";
import { singleton } from "tsyringe";
import { BaseComponent, state} from "../../components/base-component";
import { ConfigService } from "../../services/config-service";
import { RecordBase, RecordHandlerBase } from "../../services/records-handler-base";
import { RequestService } from "../../services/request-service";
import { UrlProvider } from "../../services/url-provider";


interface DepartmentModel extends RecordBase{
    code: string
    name: string
    definitions: Object
}
@singleton()
export class DepartmentHandler extends RecordHandlerBase<DepartmentModel> {
    module: string = "admin"
    type: string = "departments"
    constructor(public config: ConfigService, public urls: UrlProvider, public requests: RequestService){
        super(config, urls, requests)
    }

    
}

export class Departments extends BaseComponent<{}, {records: DepartmentModel[]}> {
    @state records: DepartmentModel[]
   

    constructor(p){
        super(p);
        this.records = []
    }


    componentDidMount(){
        super.componentDidMount()
        this.service.active = true
        this.subscribe(this.service.recordsemitter, (v: DepartmentModel[])=> { this.records = v || [] }, "service.records")
     }

    componenentWillUnmount(){
        super.componentDidMount()
        this.service.active = false
        this.unbind("service.records")
    }

    service: DepartmentHandler
    protected prepareServices(): void {
        this.service = this.depregister.resolve(DepartmentHandler)
    }



    draw(){
        return (
        <div>
            <div>DEPARTMENT</div>
            {(this.records || []).map((dep)=><DepartmentItem department={dep} key={dep.id} />)}
        </div>
        )
        
    }
}

export class DepartmentItem extends BaseComponent<{department: DepartmentModel}> {

    draw(){
      return  <div>
            {this.props.department.code} {this.props.department.name}
        </div>
    }
}