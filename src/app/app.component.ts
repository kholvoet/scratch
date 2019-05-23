import { Component, OnInit } from '@angular/core';


export interface CellAddress {
    row: number;
    col: number;
}

export interface Span {
    cells: CellAddress[];
    unsolvedSubProblems: CellAddress[][];
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    DIM = 9;

    title = 'Holvoet\'s ngrx Sudoku';

    data: CellAddress[] = [];

    spans: Span[] = [];

    ngOnInit(): void {
        let x: number;
        let y: number;

        // init row and col spans
        for ( x = 0; x < this.DIM; ++x ) {
            let rowSpan: Span = this.emptySpan();
            let colSpan: Span = this.emptySpan();
            for ( y = 0; y < this.DIM; ++y ) {
                rowSpan.cells = rowSpan.cells.concat({ row: x, col: y });
                colSpan.cells = colSpan.cells.concat({ row: y, col: x });
            }
            rowSpan.unsolvedSubProblems = this.powerSetSorted(rowSpan.cells);
            this.spans = this.spans.concat(rowSpan);

            colSpan.unsolvedSubProblems = this.powerSetSorted(colSpan.cells);
            this.spans = this.spans.concat(colSpan);
        }

        let patchDIM = Math.sqrt(this.DIM);

        // init patch spans
        for ( x = 0; x < this.DIM; x += patchDIM ) {
            for ( y = 0; y < this.DIM; y += patchDIM ) {
                let r: number;
                let c: number;
                let patchSpan: Span = this.emptySpan();

                for ( r = x; r < x + patchDIM; ++r ) {
                    for ( c = y; c < y + patchDIM; ++c ) {
                        patchSpan.cells = patchSpan.cells.concat({ row: r, col: c });
                    }
                }
                patchSpan.unsolvedSubProblems = this.powerSetSorted(patchSpan.cells);
                this.spans = this.spans.concat(patchSpan);
            }
        }
    }

    private emptySpan() {
        return {
            cells: [],
            unsolvedSubProblems: []
        };
    };

    setToString(e) {
        return JSON.stringify(e, null, "\t");
    }

    powerSetSorted(s) {
        return (theArray => theArray.reduce(
            (subsets, value) => subsets.concat(
                subsets.map(set => [value, ...set])
            ),
            [[]]
        ))(s).sort();
    }
}
