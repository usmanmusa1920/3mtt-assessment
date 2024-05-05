// -- Fetches GitHub repository stats and displays them on a website using JavaScript and HTML --
// Stores the fetched data in the sessionStorage of the browser to limit the amount of API calls made and to make displaying repositories faster for returning visitors.
// This includes the HTML code that I used on my website, so it might not match with how you want it to look so feel free to mess with it to reach your desired look.
// CSS is not included.
// Both files are licensed under the CC0 1.0 license and can be used however you want :)
// 
// Happy coding!

// The repositories to fetch statistics for (in this order).
const reposToFetch = [
  "BreadcrumbIsTaken/BreadVibesMC",
  "BreadcrumbIsTaken/mcgen",
  "DenizenScript/denizenscript-grammar",
  "BreadcrumbIsTaken/RootbeerSSG",
  "BreadcrumbIsTaken/wobbly-icon-theme",
  "BreadcrumbIsTaken/TOH",
  "BreadcrumbIsTaken/denizen-bounties",
  "BreadcrumbIsTaken/old.breadcrumb.fun",
  "BreadcrumbIsTaken/RootbeerSSG-Plugins",
  "BreadcrumbIsTaken/SpamThingPython",
  "BreadcrumbIsTaken/MCSkinerBoi",
  "BreadcrumbIsTaken/BreadcrumbIsTaken",
];

// List of language keys and their colors.
const languages = {
  "CSS": "#563C7D",
  "DenizenScript": "#FBEE96",
  "HTML": "#E24C27",
  "JavaScript": "#F0E15A",
  "Python": "#3573A4",
  "Rust": "#DFA585",

  "Other": "#EDECEC",
}

// Check for sorage data cache.
if (sessionStorage.getItem("repo_data") == null) {
  var githubData = [];
  await fetchRepositories(reposToFetch, githubData)
  sessionStorage.setItem("repo_data", JSON.stringify(githubData));
}

var repos = JSON.parse(sessionStorage.getItem("repo_data"));

displayCodeRepos(repos);

// Fetch the repositories.
async function fetchRepositories(repositories, list) {
  for (let repo of repositories) {
      await fetch(`https://api.github.com/repos/${repo}`, {
          method: "GET"
      })
          .then((response) => {
              return response.json()
          })
          .then((data) => {
              list.push(data);
          });
  }
}

// Fetch the language statistics for each repository.
async function fetchLangauges(repo) {
  await fetch(repo.languages_url, {
          method: "GET"
      })
          .then((response) => {
              return response.json()
          })
          .then((data) => {
              sessionStorage.setItem(`${repo.name}_language_data`, JSON.stringify(data))
          });
}

// Display the HTML with code statistics.
async function displayCodeRepos(repos) {
  for (let repo of repos) {
      const reposDiv = document.getElementById("gh-code-repos");
      
      // <div id="gh-code-repo">
      var div = document.createElement("div");
      div.id = "gh-code-repo";

      // <h3 id="gh-code-repo-name"></h3>
      const repoName = document.createElement("h3");
      const repoNameNode = document.createTextNode(repo.full_name);
      const repoLink = document.createElement("a");
      repoLink.href = repo.html_url;
      repoLink.id = "gh-code-repo-link";
      repoLink.target = "_blank";
      repoLink.rel = "noopener noreferrer"
      repoLink.appendChild(repoNameNode)
      repoName.id = "gh-code-repo-name";
      repoName.appendChild(repoLink);
      div.appendChild(repoName);

      // <p id="gh-code-repo-desc">Desc</p>
      const description = document.createElement("p");
      var descriptionNode;
      if (repo.description != null) {
          descriptionNode = document.createTextNode(repo.description);
      } else {
          descriptionNode = document.createTextNode("No description.");
      }
      description.id = "gh-code-repo-desc"
      description.appendChild(descriptionNode);
      div.appendChild(description);

      // <div id="gh-code-repo-langauge-stats"></div>
      var stats = document.createElement("div");
      stats.id = "gh-code-repo-language-stats";

      // <div id="gh-code-repo-language-bar"></div>
      const bar = document.createElement("div");
      bar.id = "gh-code-repo-language-bar";

      if (sessionStorage.getItem(`${repo.name}_language_data`) == null) {
          await fetchLangauges(repo);
      }
      const repoLangs = JSON.parse(sessionStorage.getItem(`${repo.name}_language_data`));

      var totalBytes = 0;
      for (const [langauge, bytes] of Object.entries(repoLangs)) {
          totalBytes += bytes;
      }

      var barPercent = 0.0;

      for (const [langauge, bytes] of Object.entries(repoLangs)) {
          var a = bytes;
          var b = totalBytes;
          var c = a / b;
          var d = Math.floor(c * 100);
          if (d != 0) {
              // <div id="gh-code-repo-language"></div>
              const langDiv = document.createElement("div");
              langDiv.id = "gh-code-repo-language";

              var actualPercent = (c * 100).toFixed(1);

              if (actualPercent > 100) {
                  actualPercent = 100;
              }

              barPercent = barPercent + parseFloat(actualPercent);

              var color = languages[langauge];
              if (color == null) {
                  color = languages["Other"];
              }

              // <div id="gh-code-repo-language-key"></div>
              const langKeyDiv = document.createElement("div");
              langKeyDiv.id = "gh-code-repo-language-key";
              langKeyDiv.style = `background-color: ${color};`;

              const langKeyText = document.createTextNode(langauge);
              
              langDiv.appendChild(langKeyDiv);
              langDiv.appendChild(langKeyText);

              stats.appendChild(langDiv);

              var slice = document.createElement("div");
              slice.className = "gh-lang-bar-slice";

              slice.style = `background-color: ${color}; width: ${actualPercent}%; height: 100%;`
              bar.appendChild(slice);
          }
      }
      if (barPercent < 100 && barPercent != 0) {
          var percent = 100 - barPercent;

          // <div id="gh-code-repo-language"></div>
          const langDiv = document.createElement("div");
          langDiv.id = "gh-code-repo-language";

          var slice = document.createElement("div");
          slice.className = "gh-lang-bar-slice";

          slice.style = `background-color: ${languages['Other']}; width: ${percent}%; height: 100%;`;
          bar.appendChild(slice);

          // <div id="gh-code-repo-language-key"></div>
          const langKeyDiv = document.createElement("div");
          langKeyDiv.id = "gh-code-repo-language-key";
          langKeyDiv.style = `background-color: ${languages['Other']};`;

          const langKeyText = document.createTextNode("Other");
          langDiv.appendChild(langKeyDiv);
          langDiv.appendChild(langKeyText);
          stats.appendChild(langDiv)
      }
      
      div.appendChild(stats);
      div.appendChild(bar);
      reposDiv.appendChild(div);
  }
  document.getElementById("loader-repos").style = "display: none;"
}