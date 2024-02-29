import { Directive, Type, ViewContainerRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export class DynamicComponentItem {
    constructor(public component: Type<any>, public data?: any) {}
}

export interface IDynamicComponent {
    data: any;
    isEdit$?: BehaviorSubject<boolean>;
    getForms?: () => AbstractControl[];
}

@Directive({
    selector: '[appDynamicComponent]'
})
export class DynamicComponentDirective {
    constructor(public readonly viewContainerRef: ViewContainerRef) {}
}
