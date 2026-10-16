# Chartspur public discovery

Coordination: MYR-210 / `myrmitis-seo-fleet-v1`.
Finding key: `chartspur:discovery:public-sitemap-v1`.

## Scope and design

The approved map contains exactly `https://chartspur.com/` and
`https://chartspur.com/brief.html`. These are the free chart table and public
sample brief identified in README.md and ops/STATE.md. Do not add customer
reports, payment links, queries, fragments, data files, private paths, or new page
families without reviewed publication evidence. This map is not a publication
or indexing permission for any other surface.

The existing Worker serves `/sitemap.xml` and `/robots.txt` directly. The Pages
workflow copies an explicit list of assets and does not currently publish either
file. Handling them in the Worker avoids changing deployment workflows, the
refresh generator, payment behavior, or the generated `brief.html`. It also
avoids an unnecessary upstream request for each discovery-file request.

`lastmod` is deliberately omitted: Worker deployment dates and the time of a
request do not establish the pages' real modification times. The map is fixed,
not assembled from request URLs or the chart database.

The application robots file adds only the sitemap declaration. Cloudflare's
existing managed crawler policy remains in force and must be verified after
release; no Allow directives or copied training-bot policy snapshot are added.
Do not disable managed robots, training-crawler restrictions, or WAF rules to
make this check pass. A Node composition fixture is not proof of the live edge
behavior or of real crawler access.

## Offline verification

The existing read-only CI discovers `pipeline/test_edge_seo.py`; no workflow or
required-check definition changes are needed. Node 22+ and Python's standard
library are sufficient:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s pipeline -p 'test_*.py' -v
```

The new tests import the real Worker with fetch replaced by bounded local
fixtures. They cover exact map membership/XML, query exclusion, HEAD behavior,
managed-policy composition, methods, aliases, cache/security headers, and
unchanged Pages proxy/redirect/error handling. They make no network, provider,
payment, data-refresh, or deployment requests.

The canonical portfolio checker remains in `laqaer/portfolio-ops`; this repair
neither forks it nor claims that it is installed as a required site gate. For a
separately authorized live acceptance, use its reviewed current collector and
checker with origin `https://chartspur.com`, indexing `public`, required and
indexable paths `["/", "/brief.html"]`, sitemap `/sitemap.xml`, and private-path
exclusions. Capture only approved public endpoints, not the entire repository.

## Release acceptance — pending until observed

An approved merge alone does not update the Cloudflare Worker. The existing
release owner must deploy the reviewed Worker via the README's established
manual route, within its separate release authority. This document does not
permit a deployment, new preview, account change, or search submission.

Record the released commit, Worker version/deployment ID, and timestamp. Then
verify on the canonical host:

- `/robots.txt` and `/sitemap.xml` return 200 with text/plain and XML content;
  HEAD has matching headers and no body.
- The final Cloudflare-composed robots response retains the existing training
  restrictions and contains the canonical sitemap declaration. Verify search
  access separately from training access, without changing either policy.
- XML parses with exactly the two approved canonical URLs. Both pages return
  their actual public HTML and correct canonical metadata. No query, private,
  error, redirect, or data URL appears in the map.
- www keeps its existing apex redirects; ordinary chart, brief, asset, and data
  delivery still work. The payment link, offer, fulfillment, and refresh remain
  unchanged. Do not make a test payment.

Only after live acceptance may the existing SEO owner use already-authorized
console access to submit the map. Submission, processing, indexing, rankings,
and customer conversions are separate observations. Do not add another emitter
or scheduler. Rollback uses the existing release owner's approved prior Worker
version; do not change DNS or Pages custom-domain settings.

## First-party references

- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/
