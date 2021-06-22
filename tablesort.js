// ————————————————————————————————————————————————————————————————————————————————
// Made by Oleksa Vyshnivsky <
//	in trying to replace https://joequery.github.io/Stupid-Table-Plugin/ on jQuery-less website
//	
//	No defence against complicated THEADs or very large tables
//	
// 	dir: asc | desc
//	datatype: string | int | float | date
// ————————————————————————————————————————————————————————————————————————————————

Node.prototype.tsortable = function() {
	var ths = this.querySelectorAll('thead tr:last-child th[data-sort]')
	ths.forEach(th => th.onclick = tablesort)
}

function tablesort(e) {
	var table = e.currentTarget.closest('table')
	// Column for sorting
	var J = Array.from(e.currentTarget.parentNode.children).indexOf(e.currentTarget)
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

	var trs = table.querySelectorAll('tbody tr')
	trs.forEach((tr, i) => {
		itable.push({tr: tr, values: []})
		var tds = tr.querySelectorAll('td')
		tds.forEach(td => {
			var value = td.dataset.sortValue ? td.dataset.sortValue : td.innerText
			if (datatype === 'int') value = parseInt(value)
			else if (datatype === 'float') value = parseFloat(value)
			else if (datatype === 'date') value = new Date(value)
			itable[i].values.push(value)
		})
	})

	// Inner sorting
	if (dir === 'asc') {
		itable.sort((a, b) => {
			return a.values[J] < b.values[J] ? -1 : (a.values[J] > b.values[J] ? 1 : 0)
		})
	} else {
		itable.sort((a, b) => {
			return a.values[J] < b.values[J] ? 1 : (a.values[J] > b.values[J] ? -1 : 0)
		})
	}

	// Redrawing
	table.querySelector('tbody').innerHTML = ''
	itable.forEach(row => table.querySelector('tbody').append(row.tr))
}
