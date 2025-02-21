import { Directive, ElementRef, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare type ContentRect = keyof ResizeObserverEntry['contentRect'];

@Directive({
    selector: '[ngxResized]',
    exportAs: 'ngxResized',
    standalone: false
})
export class NgxResized implements OnDestroy {
    private _subject = new BehaviorSubject<ResizeObserverEntry | null>(null);
    private _lastSize?: ResizeObserverEntry['contentRect'];

    private observer: ResizeObserver = new ResizeObserver((entries) => {
        this._lastSize = this._subject.value?.contentRect;
        this._subject.next(entries ? entries[0] : null);
    });

    @Output()
    resized = this._subject.pipe(
        filter((resizeEntry) => {
            if (!this._lastSize) return false;

            const size = resizeEntry.contentRect;
            const last = this._lastSize;
            return Object.keys(size).every(
                (key) => size[<ContentRect>key] === last[<ContentRect>key]
            );
        })
    );

    public constructor(private _element: ElementRef) {
        this.observer.observe(this._element.nativeElement);
    }

    public ngOnDestroy(): void {
        this._subject.unsubscribe();
        this.observer.disconnect();
    }
}
