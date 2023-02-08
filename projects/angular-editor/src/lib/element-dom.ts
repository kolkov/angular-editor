import { ElementRef } from "@angular/core";

export interface ElementDOM {
    elementDOM: ElementRef<HTMLElement>

    /**
     * 
     * @param id The id of the child element
    */
    getChildById(id: string): HTMLElement;
}