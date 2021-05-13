export interface CCUEasymodeTemplateParameter {
    readonly: boolean;
    value: string;
}

export interface CCUEasymodeTemplateOption {
    desc: string;
    option: string;
    combo?: string[];
    input: string;
    param: string;
}

export interface CCUEasymodeTemplate {
    name: string;
    options: [key: string, value: CCUEasymodeTemplateOption];
    params: [key: string, value: CCUEasymodeTemplateParameter];
}
