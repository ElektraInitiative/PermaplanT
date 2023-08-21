import requests
from datetime import datetime, timedelta

# Replace these with your own values
repository_owner = "ElektraInitiative"
repository_name = "PermaplanT"
excluded_author = "4ydan"  # Replace with the author's name you want to exclude

base_url = f"https://api.github.com/repos/{repository_owner}/{repository_name}"

# Fetch all pull requests using pagination
pulls_url = f"{base_url}/pulls?state=closed&per_page=100"  # Set per_page to 100
all_pulls = []
page = 1
while True:
    response = requests.get(f"{pulls_url}&page={page}")
    pulls_data = response.json()
    if not pulls_data:  # Stop pagination if there are no more results
        break
    all_pulls.extend(pulls_data)
    page += 1

# Print the total number of pull requests fetched
total_pulls = len(all_pulls)
print(f"Total pull requests fetched: {total_pulls}")

# Analyze pull request data
merged_pulls = []
for pull in all_pulls:
    state = pull.get("state", "")
    author = pull.get("user", {}).get("login", "")
    base_ref = pull["base"]["ref"] if "base" in pull and "ref" in pull["base"] else None
    if state == "closed" and base_ref == "master" and author != excluded_author:
        merged_pulls.append(pull)

merge_counts = {}
for pull in merged_pulls:
    merged_at_str = pull.get("merged_at")
    if merged_at_str:
        merged_at = datetime.strptime(merged_at_str, "%Y-%m-%dT%H:%M:%SZ")
        week_start = (merged_at - timedelta(days=merged_at.weekday())).date()
        if week_start in merge_counts:
            merge_counts[week_start] += 1
        else:
            merge_counts[week_start] = 1

# Print merge counts per week
for week, count in merge_counts.items():
    print(f"Week starting {week}: {count} merges")
