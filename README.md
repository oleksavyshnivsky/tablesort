# Simple table sorting

Created in trying to replace https://joequery.github.io/Stupid-Table-Plugin/ on a jQuery-less website

No defence against large tables (redraw uses a document fragment, but if the sorting itself is slow, so be it)

If the table header contains merged cells, a `data-sort-col` attribute might be needed to specify the correct column index (the first column's index is 0).

`data-sort-` attributes for header cells:

- dir: asc | desc
- datatype: string | int | float | date

Wrong number/date values are treated as empty values.

Empty values are first at ascending sorting and last at desc.

## Examples: 

https://oleksavyshnivsky.github.io/tablesort/
