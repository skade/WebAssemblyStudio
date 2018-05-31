export declare enum ServiceTypes {
    Rustc = 0,
    Clang = 1,
    Service = 2,
}
export interface IServiceRequestTask {
    file: string;
    name: string;
    output: string;
    console: string;
    success: boolean;
}
export interface IServiceRequest {
    success: boolean;
    tasks: IServiceRequestTask[];
    output: string;
    wasmBindgenJs: string | undefined;
}
export declare function sendRequestJSON(content: Object, to: ServiceTypes): Promise<IServiceRequest>;
export declare function sendRequest(content: string, to: ServiceTypes): Promise<IServiceRequest>;
