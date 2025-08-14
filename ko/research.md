---
layout: page
title: "연구"
lang: "ko"
en_url: "/research/"
---

### 출판물
<ul class="list">
{% assign pubs = site.publications | sort: 'year' | reverse %}
{% for p in pubs %}
  <li>
    <strong>{{ p.title }}</strong> ({{ p.year }}) — {{ p.venue }}<br>
    {{ p.authors | join: ", " }}
  </li>
{% endfor %}
</ul>
