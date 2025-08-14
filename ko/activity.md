---
layout: page
title: "활동"
lang: "ko"
en_url: "/activity/"
---

## 소식
<ul class="list">
{% for post in site.posts %}
  {% if post.categories contains "news" %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span class="badge">News</span> — {{ post.date | date: "%Y-%m-%d" }}</li>
  {% endif %}
{% endfor %}
</ul>

## 팁 · 에세이
<ul class="list">
{% for post in site.posts %}
  {% if post.categories contains "tips" %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span class="badge">Tips</span> — {{ post.date | date: "%Y-%m-%d" }}</li>
  {% endif %}
{% endfor %}
</ul>
