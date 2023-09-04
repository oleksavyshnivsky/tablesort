# Simple table sorting

Created in trying to replace https://joequery.github.io/Stupid-Table-Plugin/ on a jQuery-less website

No significant defence against large tables (redraw uses a document fragment, but if the sorting itself is slow, so be it)

### Header cell attributes:

- **data-sort** – only columns with this attribute are sortable. Defines the column datatype. Possible values: *string* | *int* | *float* | *date*
- **data-sort-dir** (optional) – direction of sorting. Possible values: *asc* (default) | *desc*
- **data-sort-col** (optional) — if the table header contains merged cells, it might be needed to specify the correct column index (the first column's index is 0).

### Data cell attribute:

- **data-sort-value** (optional) — in case if the displayed cell content is not the value that has to be sorted.  

### Handling values

- Wrong number/date values are treated as empty values.
- Empty values are first at ascending sorting and last at desc.

### Examples: 

https://oleksavyshnivsky.github.io/tablesort/
