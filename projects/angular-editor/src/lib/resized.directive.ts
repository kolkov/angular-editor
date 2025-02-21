import { Directive, ElementRef, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';

declare type ResizeEntry = ResizeObserverEntry;
declare type ContentRect = ResizeObserverEntry['contentRect'];

const comparators: (keyof ContentRect)[] = [
    'height',
    'width',
    'x',
    'y',
    'top',
    'bottom',
    'left',
    'right'
];

function isTruthy<T>(val: T | null): val is T {
    return val !== null;
}

function hasContentRectChanged(
    prop: keyof ContentRect,
    current: ContentRect | null,
    last: ContentRect | null
) {
    if (!current || !last || current[prop] === last[prop]) return false;
    return current[prop] as number;
}

@Directive({
    selector: '[ngxResized]',
    exportAs: 'ngxResized',
    standalone: true
})
export class NgxResizedDirective implements OnDestroy {
    private _resizeSubject = new BehaviorSubject<ContentRect | null>(null);
    private _lastEntry: ContentRect | null = null;

    private observer: ResizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0]?.contentRect;
        if (!entry) return;

        // If no initial value has been emitted, we can't compare for changes,
        // so emit the current entry
        if (!this._resizeSubject.value) {
            this._resizeSubject.next(entry);
            return;
        }

        this._lastEntry = this._resizeSubject.value;

        if (!this._lastEntry) {
            this._resizeSubject.next(entry);
            return;
        }

        const noChanges = comparators.every((c) => {
            return this._lastEntry![c] === entry[c];
        });

        if (noChanges) return;

        this._resizeSubject.next(entry);
    });

    @Output('sizechange')
    public onSizeChange = this._resizeSubject.pipe(filter(isTruthy));

    @Output('widthchange')
    public onWidthChange = this._resizeSubject.pipe(
        this._hasContentRectChanged('width')
    );

    @Output('heightchange')
    public onHeightChange = this._resizeSubject.pipe(
        this._hasContentRectChanged('height')
    );

    @Output('xchange')
    public onXChange = this._resizeSubject.pipe(
        this._hasContentRectChanged('x')
    );

    @Output('ychange')
    public onYChange = this._resizeSubject.pipe(
        this._hasContentRectChanged('x')
    );

    @Output('topchange')
    public onTopChange = this._resizeSubject.pipe(
        this._hasContentRectChanged('top')
    );

    @Output('bottomchange')
    public onBottomChange = this._resizeSubject.pipe(
        this._hasContentRectChanged('bottom')
    );

    @Output('leftchange')
    public onLeftChange = this._resizeSubject.pipe(
        this._hasContentRectChanged('left')
    );

    @Output('rightchange')
    public onRightChange = this._resizeSubject.pipe(
        this._hasContentRectChanged('right')
    );

    public constructor(private _element: ElementRef<HTMLDivElement>) {
        this.observer.observe(this._element.nativeElement);
    }

    private _hasContentRectChanged(prop: keyof ContentRect) {
        return map((resizeEntry: ContentRect | null) => {
            return hasContentRectChanged(prop, resizeEntry, this._lastEntry);
        });
    }

    public ngOnDestroy(): void {
        this._resizeSubject.unsubscribe();
        this.observer.disconnect();
    }
}
