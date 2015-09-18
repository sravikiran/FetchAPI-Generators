function *pollForWeatherInfo() {
	while (true) {
		yield fetch('/api/currentWeather', {
			method: 'get'
		}).then(function (d) {
			var json = d.json();
			return json;
		});
	}
}

function runPolling(generator) {
	if (!generator) {
		generator = pollForWeatherInfo();
	}

	var p = generator.next();
	p.value.then(function (d) {
		if (!d.temperature) {
			runPolling(generator);
		}
		else {
			console.log(d);
		}
	});
}

runPolling();

function *gitHubDetails(orgName) {
  var baseUrl = "https://api.github.com/orgs/";
  var url = baseUrl + orgName;

  var reposUrl = yield wrapperOnFetch(url);
  var repoFullName = yield wrapperOnFetch(reposUrl);

  yield wrapperOnFetch(`https://api.github.com/repos/${repoFullName}/contributors`);
}

function wrapperOnFetch(url) {
	var headers = new Headers();
	headers.append('Accept', 'application/vnd.github.v3+json');
	var request = new Request(url, { headers: headers });

	return fetch(request).then(function (res) {
		return res.json();
	});
}

var generator = gitHubDetails("aspnet");

generator.next().value.then(function (userData) {
 document.querySelector("#avatar").src = userData.avatar_url;
  document.querySelector("#login").textContent = userData.login;
  document.querySelector("#login").href = userData.html_url;
  document.querySelector("#repoCount").textContent = userData.public_repos;
  
  return generator.next(userData.repos_url).value.then(function (reposData) {
    return reposData;
  });
}).then(function (reposData) {
  var randomIndex = Math.round(Math.random() * 100) % reposData.length;
  var link = `<a href="https://"github.com/${reposData[randomIndex].full_name}">${reposData[randomIndex].name}</a>`;
  
  document.querySelector("#repoName").innerHTML = link;
  document.querySelector("#repoDescription").textContent = reposData[randomIndex].description;
  return generator.next(reposData[randomIndex].full_name).value.then(function (selectedRepoCommits) {
    var tiles = "";
    selectedRepoCommits.forEach(function (contributor) {
      var tile = `<div class="col-md-3 tile">
        <div class="col-md-8">
        <img src="${contributor.avatar_url}" alt="${contributor.login}" class="avatar">
        </div>
        <div class="col-md-4">
        <a href="${contributor.html_url}">${contributor.login}</a>
        <br>
        <a href="${contributor.html_url}?tab=repositories">Repos</a>
        </div>
        </div>`;
      tiles += tile;
    });

    document.querySelector("#contributors").innerHTML = tiles;
    return selectedRepoCommits;
 });
});
