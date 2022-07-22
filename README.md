# lb/template-web

### Setting Up Continuous Integration (CI)

Continuous Integration runs checks on every commit to ensure the integrity of the project.

This template includes a Gitlab CI setup which is mostly batteries included, but may fail out of the box
because Gitlab's shared runners don't have pull secrets configured for our custom CI container images.

You'll want to click **Settings** in the sidebar, select **CI/CD**, expand **Runners**, and toggle **Enable Shared Runners for this Project** to off.  
This ensures that only Launchbadge's self-managed runners are chosen, which have the pull secrets configured.

### Setting Up Continuous Deployment (CD)

For sandbox environments, we want to deploy immediately on every push to `main`.

The `.gitlab-ci.yml` that comes with this project is capable of automatically deploying to Firebase, but requires credentials to do so.

First, ensure the project is set up to deploy to Firebase and that `firebase.json` and `.firebaserc` exist.

**DO NOT** use `firebase login:ci` as that creates an authentication token that can deploy to _any_ Firebase project managed by Launchbadge.

Instead, you want to create a Service Account that can _only_ deploy to the given Firebase project.

- Open "IAM and Admin -> Service Accounts" in Google Cloud Console
  - Navigate to https://console.cloud.google.com
  - From the dropdown at the top, select the project with the same name as the Firebase project.
    - If you can't find it, try changing "Select From" to "No Organization" and/or selecting the "All" tab instead of the "Recent" tab.
    - Alternatively, if you have the project open in the Firebase console, you can click the gear icon next to "Project Overview", select "Users and Permissions",
      and click the tiny link in the bottom right labeled "Advanced permissions settings" and then select "Service Accounts" from the left. You can skip the next step.
  - From the hamburger menu in the top left, point to "IAM and Admin" and then click "Service Accounts".
- Create a Service Account with the role "Firebase Hosting Admin"
  - Click "Create Service Account" at the top.
  - Give the service account a descriptive name like "Gitlab Sandbox Deploy" and optionally a description.
  - Take note of the generated value in the "Service account ID" field.
  - then click "Create and Continue".
  - In the new section that appeared, click "Select a Role" and search for then select "Firebase Hosting Admin"
  - Click Done
- Get a new JSON key for that service account.
  - In the listing, find the Service Account you just created and click the three-vertical-dot menu on the far right, then select "Manage Keys".
  - Select "Add Key" then "Create new key"
  - Ensure the "JSON" radio button is selected and click "Create"
  - Your browser will automatically download a `.json` file; open it and copy its contents.
- Add the contents of the key file as a "File" variable named `GOOGLE_APPLICATION_CREDENTIALS` in the CI/CD settings for the Gitlab project.
  - Navigate to the project in Gitlab.
  - Click "Settings" in the sidebar, select "CI/CD" and expand "Variables".
  - Click "Add Variable"
  - For the name, enter `GOOGLE_APPLICATION_CREDENTIALS`
  - For the value, paste the contents of the JSON file.
  - Change "Type" to "File"
  - If you only want the key to be available on `main`, check "Protect variable".
  - Click "Add variable"
- Trigger a pipeline by pushing to `main` or manually via "CI/CD -> Pipelines -> Run Pipeline"
