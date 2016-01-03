window.save = function(e) {
	var item = e.target;

	if(document.saving)
		return;

	document.saving = true;

	var key = item.id;
	var value = item.value;

	item.classList.add('saving');
	kaze.content.style.cursor = 'wait';

	kaze.postJSON('/api/users/me', {
		function: 'save',
		key: key,
		value: value
	}, function(error, response) {
		if(error)
			console.log(error);

		window.postSave(key, response);

		kaze.get('/_' + location.pathname, function(error, newPageCode) {
			if(error)
				console.log(error);

			var focusedElementId = document.activeElement.id;
			var focusedElementValue = document.activeElement.value;

			kaze.onResponse(newPageCode);

			// Re-focus previously selected element
			if(focusedElementId) {
				var focusedElement = document.getElementById(focusedElementId);

				if(focusedElement) {
					focusedElement.value = focusedElementValue;

					if(focusedElement.select)
						focusedElement.select();
					else if(focusedElement.focus)
						focusedElement.focus();
				}
			}

			kaze.content.style.cursor = 'auto';
			document.saving = false;
		})
	});
};

window.postSave = function(key, value) {
	switch(key) {
		case 'nick':
			value = value.replace(/\s+/g, '');
			var oldPath = window.location.pathname;
			var newPath = '/+' + value;

			window.history.pushState('', document.title, newPath);

			var links = document.querySelectorAll('a');
			for(var l = 0; l < links.length; ++l) {
				var link = links[l];
				if(link.href.endsWith(oldPath))
					link.href = newPath;
			}

			break;
	}
};

window.loadAnimeList = function() {
	var animeList = document.getElementById('animeList');
	animeList.innerText = 'Loading your anime list...';

	var userName = window.location.pathname.substring(2);

	kaze.getJSON('/api/animelist/' + userName, function(error, response) {
		if(error) {
			animeList.innerText = 'Error loading your anime list: ' + error.toString();
			return;
		}

		if(!response.watching) {
			animeList.innerText = 'There are no anime your watching list.';
			return;
		}

		animeList.innerHTML = '';

		var list = document.createElement('ul');
		list.className = 'anime-list';

		response.watching.forEach(function(anime) {
			var item = document.createElement('li');
			item.className = 'anime';

			var link = document.createElement('a');
			link.appendChild(document.createTextNode(anime.title));
			link.href = anime.url;
			link.target = '_blank';
			link.className = 'anime-link';

			item.appendChild(link);

			if(anime.episodes.available >= anime.episodes.next) {
				var view = document.createElement('a');
				view.href = anime.animeProvider.nextEpisodeUrl;
				view.target = '_blank';
				view.className = 'anime-view-link';

				if(anime.episodes.next && anime.episodes.next !== 0)
					view.title = 'Watch episode ' + anime.episodes.next;

				var icon = document.createElement('div');
				icon.className = 'glyphicon glyphicon-eye-open';
				view.appendChild(icon);
				item.appendChild(view);
			}

			list.appendChild(item);
		});

		animeList.appendChild(list);
	});
}

var myNodeList = document.querySelectorAll('.save-on-change');

for(var i = 0; i < myNodeList.length; ++i) {
	var element = myNodeList[i];
	element.onchange = window.save;
}

window.loadAnimeList();