/**
 * @file Trying to replace https://joequery.github.io/Stupid-Table-Plugin/ on jQuery-less website
 * @copyleft Oleksa Vyshnivsky <dying.escape@gmail.com> 2022
 * @license ISC
 * */

/**
 * If the table header contains merged cells, `data-sort-col` attribute might be needed
 * to specify the correct column index (first column's index is 0)
 *	
 * Available settings:
 *	data-sort (defines datatype): string | int | float | date
 * 	data-sort-dir (defined direction, optional): asc (default) | desc
 * 
 * Wrong number/date values are treated as empty values. 
 * Empty values are first at ascending sorting and last at desc.
 *
 */

/** 
 * Index of a clicked column 
 */
function getCellIndex(cell) {
	const row = cell.parentNode
	const rowIndex = Array.from(row.parentNode.children).indexOf(row)
	let columnIndex = 0

	for (let i = 0; i < row.cells.length; i++) {

		const colSpan = row.cells[i].colSpan
		columnIndex += colSpan

		if (rowIndex === 0) {
			if (i === cell.cellIndex) {
				return columnIndex - 1
			}
		} else {
			if (!isNaN(parseInt(cell.dataset.sortCol))) return parseInt(cell.dataset.sortCol)
		}
	}

	return columnIndex - 1
}

// ————————————————————————————————————————————————————————————————————————————————
// 
// ————————————————————————————————————————————————————————————————————————————————
let is_sorting_process_on = false
let delay = 100 // ms

// ————————————————————————————————————————————————————————————————————————————————
// 
// ————————————————————————————————————————————————————————————————————————————————
Node.prototype.tsortable = function() {
	var ths = this.querySelectorAll('thead th[data-sort], thead td[data-sort]')
	ths.forEach(th => th.onclick = tablesort)
}

// ————————————————————————————————————————————————————————————————————————————————
// 
// ————————————————————————————————————————————————————————————————————————————————
function tablesort(e) {
	if (is_sorting_process_on) return false
	is_sorting_process_on = true

	// ~~~~~~~~~~~~~~~~~~~~
	var table = e.currentTarget.closest('table')
	// Column for sorting
	// var J = Array.from(e.currentTarget.parentNode.children).indexOf(e.currentTarget)
	var J = getCellIndex(e.currentTarget)
	// Data type
	var datatype = e.currentTarget.dataset.sort
	// Delete sort direction from the column of previous sorting
	var olderTH = table.querySelector('th[data-dir]')
	if (olderTH && olderTH !== e.currentTarget) delete olderTH.dataset.dir
	// Sorting direction
	var dir = e.currentTarget.dataset.dir ? (e.currentTarget.dataset.dir === 'asc' ? 'desc' : 'asc') : (e.currentTarget.dataset.sortDefault ? e.currentTarget.dataset.sortDefault : 'asc')
	e.currentTarget.dataset.dir = dir

	// Inner table for sorting
	var itable = []

	// Data to be sorted
	var trs = table.querySelectorAll('tbody tr')
	let tr, td, tds, value, itab
	for (j = 0, jj = trs.length; j < jj; j++) {
		tr = trs[j]
		itable.push({tr: tr, values: []})
		itab = itable[j]
		tds = tr.querySelectorAll('th, td')
		for (i = 0, ii = tds.length; i < ii; i++) {
			td = tds[i]
			value = td.dataset.sortValue ? td.dataset.sortValue : td.innerText
			if (datatype === 'int') value = parseInt(value) 
			else if (datatype === 'float') value = parseFloat(value)
			else if (datatype === 'date') value = new Date(value)
			itab.values.push(value)
		}
	}

	// Inner sorting
	if (datatype === 'string') {
		if (dir === 'asc') {
			itable.sort((a, b) => {
				return ('' + a.values[J]).localeCompare(b.values[J])
			})
		} else {
			itable.sort((a, b) => {
				return -('' + a.values[J]).localeCompare(b.values[J])
			})
		}
	} else {
		if (dir === 'asc') {
			itable.sort((a, b) => {
				if (!isNaN(a.values[J]) && !isNaN(b.values[J])) {
					return a.values[J] < b.values[J] ? -1 : (a.values[J] > b.values[J] ? 1 : 0)
				} else if (!isNaN(a.values[J])) {
					return 1 // Sort non-empty after empty
				} else if (!isNaN(b.values[J])) {
					return -1 // Sort non-empty before empty
				} else {
					return 0
				}
			})
		} else {
			itable.sort((a, b) => {
				if (!isNaN(a.values[J]) && !isNaN(b.values[J])) {
					return a.values[J] < b.values[J] ? 1 : (a.values[J] > b.values[J] ? -1 : 0)
				} else if (!isNaN(a.values[J])) {
					return -1 // Sort non-empty before empty
				} else if (!isNaN(b.values[J])) {
					return 1 // Sort non-empty after empty
				} else {
					return 0
				}
			})
		}		
	}
	
	// Redrawing
	const fragment = document.createDocumentFragment()
	itable.forEach(row => fragment.appendChild(row.tr))
	table.querySelector('tbody').replaceChildren(fragment)

	// ~~~~~~~~~~~~~~~~~~~~
	setTimeout(() => is_sorting_process_on = false, delay)
	return true
}
