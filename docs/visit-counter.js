/* Tiny visit counter for the footer.
   Service: Abacus (https://abacus.jasoncameron.dev), free, no account, no cookies.
   The counter key comes from data-counter on #visit-counter (for example "mkweli-tech/aml").
   Counts one visit per browser tab session. Stays hidden if the service does not answer in 4 seconds.
   Privacy notice: https://mkweli.tech/privacy.html */
(function () {
  "use strict";
  var el = document.getElementById("visit-counter");
  /* Never count inside an app that loads the page from a local file. */
  if (!el || !window.fetch || location.protocol === "file:") return;
  var key = el.getAttribute("data-counter");
  if (!key || !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(key)) return;
  var BASE = "https://abacus.jasoncameron.dev";
  var SEEN = "mkweliVisitCounted:" + key;

  function run() {
    var seen = false;
    try { seen = sessionStorage.getItem(SEEN) === "1"; } catch (e) {}
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 4000);
    fetch(BASE + (seen ? "/get/" : "/hit/") + key, {
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        clearTimeout(timer);
        var n = data && Number(data.value);
        if (!n || !isFinite(n) || n < 1) return;
        try { sessionStorage.setItem(SEEN, "1"); } catch (e) {}
        show(n);
      })
      .catch(function () { clearTimeout(timer); });
  }
  /* Pages that switch language without reloading can give labels as data-label-en, data-label-fr, ... */
  function show(n) {
    function paint() {
      var l = (document.documentElement.lang || "en").slice(0, 2);
      var label = el.getAttribute("data-label-" + l) || el.getAttribute("data-label-en");
      var lab = el.querySelector(".visit-label");
      if (label && lab) lab.textContent = label;
      var num = el.querySelector(".visit-count");
      var loc = l === "fr" ? "fr-FR" : l === "pt" ? "pt-PT" : "en-GB";
      if (num) num.textContent = n.toLocaleString(loc);
    }
    paint();
    el.hidden = false;
    if (window.MutationObserver && el.hasAttribute("data-label-en")) {
      new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    }
  }
  function schedule() {
    if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 3000 });
    else setTimeout(run, 1);
  }
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule);
})();
