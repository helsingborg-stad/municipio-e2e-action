# Municipio E2E tests action

This action runs E2E tests Municipio.

## Inputs
```yaml
inputs:
    sitemap-urls:
        description: A space-separated list of sitemap URLs to extract URLs from
        required: true
    shard:
        description: The shard index to run
        default: 'false'
        required: false
    total-shards:
        description: The total number of shards
        default: 'false'
        required: true
```

## Example usage
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4] # optional
        total-shards: [4] # optional
    steps:
      - name: Run Municipio E2E Tests
        uses: helsingborg-stad/municipio-e2e-action@v1
        with:
          sitemap-urls: ${{ vars.SITEMAP_URLS }}
          shard: ${{ github.job }}
          total-shards: 2 
```