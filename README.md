<p align="center">
  <a href="https://github.com/ruchika-org/package-action"></a>
</p>

# Package and Publish

This action packages your action repository as OCI artifacts and publishes it to [GHCR](ghcr.io), so your action can then be consumed as a package to make the actions ecosystem more secure.

The whole action repository is packaged by default. Set `path` input to specify which path you want to package if you want only a few folders (for eg. dist) to be packaged.

# Usage

<!-- start usage -->
```yaml
- uses: actions/package-action@1.0.1
  with:
  
    # Personal access token (PAT) or GITHUB_TOKEN with write:package scope used to upload the package to GHCR. The GITHUB_TOKEN is taken by default.
    #
    # We recommend using a service account with the least permissions necessary. Also
    # when generating a new PAT, select the least scopes necessary.
    #
    # [Learn more about creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
    #
    # Default: ${{ github.token }}
    token: ''

    # Relative path of the working directory of the repository to be tar archived
    # and uploaded as OCI Artifact layer. You can mention multiple files/folders
    # by mentioning relative paths as space separated values. 
    # 
    # This defaults to the entire action repository contents if not explicitly defined.
    # Default: '.'
    path: 'src/ action.yml dist/'

    
```
<!-- end usage -->

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
