const createNode = element => {
  return document.createElement(element);
};

const append = (parent, el) => {
  return parent.appendChild(el);
};

// loader
const emptyState = () => {
  const newText = createNode('div');
  newText.classList = 'c-empty-state';
  newText.innerHTML = `
		<svg class="c-empty-state__icon" viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
			<line x1="12" y1="2" x2="12" y2="6"></line>
			<line x1="12" y1="18" x2="12" y2="22"></line>
			<line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
			<line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
			<line x1="2" y1="12" x2="6" y2="12"></line>
			<line x1="18" y1="12" x2="22" y2="12"></line>
			<line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
			<line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
		</svg>
		<div style="margin-top: 8px;">Loading...</div>
	`;
  append(wrapper, newText);
  setTimeout(() => {
    newText.remove();
  }, 500);
};

const renderList = year => {
  const url = `https://ergast.com/api/f1/2019/driverStandings.json`;
  emptyState();
  fetch(url).
  then(response => {
    return response.json();
  }).
  then(data => {
    const tableClass = 'c-table';
    let table = createNode('table');
    table.classList = tableClass;
    const tableContainer = document.querySelector(tableClass);
    table.innerHTML = `
			<thead class="c-table__head">
				<tr class="c-table__head-row">
					<th class="c-table__head-cell u-text--center">Place</th>
					<th class="c-table__head-cell">Driver</th>
					<th class="c-table__head-cell">Wins</th>
					<th class="c-table__head-cell u-text--right">Points</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		`;
    const title = createNode('div');
    title.classList = 'c-headline';
    title.innerHTML = `<h4 class="c-headline__title"><small class="u-text--danger">FORMULA 1</small><br />Driver Standings <small class="u-text--secondary">(${year == 'current' ? '2019' : year})</small></h4><span class="c-chip ${year == 'current' ? 'c-chip--success' : 'c-chip--secondary'}">Season Completed'</span>`;
    append(wrapper, title);
    append(wrapper, table);
    data.MRData.StandingsTable.StandingsLists[0].DriverStandings.forEach(item => {
      const tableBody = table.querySelector('tbody');
      let tr = createNode('tr');
      tr.classList = "c-table__row";
      tr.innerHTML = `
						<td class="c-table__cell c-table__cell--place u-text--center"><span class="c-place">${item.position}</span></td>
					<td class="c-table__cell c-table__cell--name">${item.Driver.givenName} ${item.Driver.familyName}<br><small style="opacity: .4;">${item.Constructors[0].name}</small></td>
					<td class="c-table__cell c-table__cell--count"><small>${item.wins}</small></td>
					<td class="c-table__cell c-table__cell--points u-text--right"><strong>${item.points}</strong></td>
				`;

      if (item.position == 1) {
        tr.querySelector('.c-place').classList.add('c-place--first');

        if (year != 'current') {
          const firstPlaceCard = createNode('div');
          firstPlaceCard.classList = 'c-winner';
          firstPlaceCard.innerHTML = `
							<div class="c-winner__image">
								<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
									<circle cx="12" cy="8" r="7"></circle>
									<polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
								</svg>
							</div>
							<div class="c-winner__content">
								<small class="c-winner__badge">winner</small>
								<h5 class="c-winner__title">${item.Driver.givenName} ${item.Driver.familyName}</h5>
								<div class="c-winner__info">
									<small class="c-winner__info-item"><strong>${item.Constructors[0].name}</strong></small>
									<small class="c-winner__info-item">Wins: <strong>${item.wins}</strong></small>
									<small class="c-winner__info-item">Points: <strong>${item.points}</strong></small>
								</div>
							</div>
						`;
          table.parentNode.insertBefore(firstPlaceCard, table);
          console.log('sup');
        }

      } else if (item.position == 2) {
        tr.querySelector('.c-place').classList.add('c-place--second');
      } else if (item.position == 3) {
        tr.querySelector('.c-place').classList.add('c-place--third');
      }
      append(tableBody, tr);
    });

  }).
  catch(err => {
    console.log(err);
  });
};

renderList('current');