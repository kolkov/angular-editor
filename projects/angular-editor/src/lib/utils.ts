import { Block, SelectOption } from './types';

export function isDefined(value: any) {
    return value !== undefined && value !== null;
}

export function formatHtmlTag(
    tagName: string,
    innerText: string,
    props: { [propName: string]: string }
) {
    const formattedProps = Object.entries(props).map(([key, val]) => {
        return `${key}="${val}"`;
    });

    return (
        `<${tagName} ${formattedProps.join(' ')}>` + innerText + `</${tagName}>`
    );
}

export function makeFontSizes(): SelectOption[] {
    return new Array(7).fill(8).map((item, i) => {
        const val = item * (i + 1) + 'px';
        return {
            label: val,
            value: val
        };
    });
}

export function makeFontStyle(): SelectOption<Block>[] {
    const styles: SelectOption<Block>[] = [
        { label: 'Paragraph', value: 'p' },
        { label: 'Code', value: 'code' }
    ];

    for (let i = 6; i > 0; i--) {
        styles.unshift({
            label: 'Heading ' + i,
            value: <Block>('h' + i)
        });
    }

    return styles;
}

export function getButtons() {
    return [
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'link'
    ];
}
