/* ============================================================
   CMS RENDERING LAYER
   ============================================================
   Fetches the JSON files listed on <body data-cms-pages="...">
   from /content/<file>.json and pours them into the page. If a
   fetch fails (offline, 404, bad JSON) that file's fields are
   simply never touched — whatever text is already sitting in the
   HTML stays exactly as it is. That existing text is the fallback,
   not a loading placeholder, so pages must never be built empty
   and "waiting" for this script.

   MARKUP CONTRACT

   <body data-cms-pages="global,home,events">
     comma-separated list of content/<name>.json files this page
     needs (no extension).

   Scalar binding (one value -> one element), anywhere in the page:
     <p data-cms-bind data-cms-text="global.phone">fallback text</p>
     <img data-cms-bind data-cms-attr-src="global.logoImage" src="fallback.png">
   - data-cms-bind is required — it's the marker cms.js scans for.
   - data-cms-text sets textContent.
   - data-cms-attr-<name> sets that attribute (repeatable, e.g.
     both data-cms-attr-href and a separate data-cms-text on one <a>).
   - data-cms-prefix-<name>="literal" prepends a literal string to
     the value used for data-cms-attr-<name> (e.g. prefix-href="tel:").
   - data-cms-format="<name>" runs the resolved value through a
     named formatter (see FORMATTERS below) before it's written as text.
   - A path is "<file>.<dot.path.into.that.files.json>".

   Repeating list (array -> cloned elements), on the container:
     <ul data-cms-repeat="home.tickerAnnouncements">
       <li data-cms-item>fallback item</li>
     </ul>
   - data-cms-item marks the direct child used as the clone template.
   - data-cms-filter="flagKey" keeps only items where item[flagKey] is truthy.
     data-cms-filter="key:value" keeps only items where item[key] == value
     (string-compared) — e.g. data-cms-filter="deanery:okigwe" to pull just
     one deanery's parishes out of a shared list.
   - If the array is missing/empty/unfetched, the container's existing
     fallback children are left completely alone.
   - When data IS available, ALL existing children (including the
     template) are replaced by one clone per array item.
   - Inside the template, fields are relative to the current item:
       <h3 data-cms-fbind data-cms-field="name">fallback</h3>
       <img data-cms-fbind data-cms-field-attr-src="photo">
     data-cms-field="." (and data-cms-fbind on the template root
     itself) binds the item's own value — used for arrays of plain
     strings/numbers rather than objects.
   - A template may itself contain a nested data-cms-repeat (e.g. a
     seminary's staff list) — its path is resolved relative to the
     current item.
   ============================================================ */
(function () {
  "use strict";

  var BASE = "/content/";
  var DATA = {};

  var FORMATTERS = {
    phoneDisplay: function (v) {
      var digits = String(v).replace(/[^0-9]/g, "");
      if (digits.length === 13 && digits.indexOf("234") === 0) {
        var local = digits.slice(3);
        return (
          "+234 (0) " +
          local.slice(0, 3) +
          " " +
          local.slice(3, 6) +
          " " +
          local.slice(6, 10)
        );
      }
      return v;
    },
    statNumber: function (v) {
      var n = parseInt(v, 10);
      if (isNaN(n)) return v;
      var s = n.toLocaleString();
      return n >= 1000 ? s + "+" : s;
    },
    dateLong: function (v) {
      var d = new Date(String(v) + "T00:00:00");
      if (isNaN(d.getTime())) return v;
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });
    },
  };

  function resolve(path, ctx) {
    if (!path) return undefined;
    var segs = path.split(".");
    var cur;
    if (Object.prototype.hasOwnProperty.call(DATA, segs[0])) {
      cur = DATA[segs[0]];
      segs = segs.slice(1);
    } else if (ctx !== undefined) {
      cur = ctx;
    } else {
      return undefined;
    }
    for (var i = 0; i < segs.length && cur != null; i++) {
      cur = cur[segs[i]];
    }
    return cur;
  }

  function isEmpty(v) {
    if (v === undefined || v === null) return true;
    if (typeof v === "string") return v.trim() === "";
    if (Array.isArray(v)) return v.length === 0;
    return false;
  }

  function toText(v) {
    return Array.isArray(v) ? v.join(", ") : String(v);
  }

  function applyFieldToElement(el, val, formatAttrName, attrTargetName) {
    if (isEmpty(val)) return;
    var fmtName = el.getAttribute(formatAttrName);
    var text =
      fmtName && FORMATTERS[fmtName]
        ? FORMATTERS[fmtName](Array.isArray(val) ? val[0] : val)
        : toText(val);
    if (attrTargetName) {
      var prefix = el.getAttribute("data-cms-prefix-" + attrTargetName) || "";
      el.setAttribute(attrTargetName, prefix + text);
    } else {
      el.textContent = text;
      if (el.hasAttribute("hidden")) el.removeAttribute("hidden");
    }
  }

  function applyScalarBindings(fileName) {
    document.querySelectorAll("[data-cms-bind]").forEach(function (el) {
      var textPath = el.getAttribute("data-cms-text");
      if (textPath && textPath.split(".")[0] === fileName) {
        applyFieldToElement(el, resolve(textPath, undefined), "data-cms-format", null);
      }
      Array.prototype.slice.call(el.attributes).forEach(function (attr) {
        var m = /^data-cms-attr-(.+)$/.exec(attr.name);
        if (!m) return;
        var attrName = m[1];
        if (attr.value.split(".")[0] !== fileName) return;
        var v = resolve(attr.value, undefined);
        if (isEmpty(v)) return;
        var prefix = el.getAttribute("data-cms-prefix-" + attrName) || "";
        el.setAttribute(attrName, prefix + toText(v));
      });
    });
  }

  function bindItemField(el, item) {
    var key = el.getAttribute("data-cms-field");
    if (key) {
      var val = key === "." ? item : resolve(key, item);
      applyFieldToElement(el, val, "data-cms-format", null);
    }
    Array.prototype.slice.call(el.attributes).forEach(function (attr) {
      var m = /^data-cms-field-attr-(.+)$/.exec(attr.name);
      if (!m) return;
      var attrName = m[1];
      var fkey = attr.value;
      var val2 = fkey === "." ? item : resolve(fkey, item);
      if (isEmpty(val2)) return;
      var prefix = el.getAttribute("data-cms-field-prefix-" + attrName) || "";
      el.setAttribute(attrName, prefix + toText(val2));
    });
  }

  function populateItem(root, item) {
    if (root.hasAttribute("data-cms-fbind")) {
      bindItemField(root, item);
    }
    root.querySelectorAll("[data-cms-fbind]").forEach(function (el) {
      bindItemField(el, item);
    });
    root.querySelectorAll("[data-cms-repeat]").forEach(function (nested) {
      applyRepeat(nested, item);
    });
  }

  function applyRepeat(container, ctx) {
    var path = container.getAttribute("data-cms-repeat");
    var arr = resolve(path, ctx);
    if (!Array.isArray(arr) || !arr.length) return;

    var filterSpec = container.getAttribute("data-cms-filter");
    if (filterSpec) {
      var colonIdx = filterSpec.indexOf(":");
      if (colonIdx === -1) {
        arr = arr.filter(function (item) {
          return item && item[filterSpec];
        });
      } else {
        var fKey = filterSpec.slice(0, colonIdx);
        var fVal = filterSpec.slice(colonIdx + 1);
        arr = arr.filter(function (item) {
          return item && String(item[fKey]) === fVal;
        });
      }
    }
    if (!arr.length) return;

    var template = container.querySelector(":scope > [data-cms-item]");
    if (!template) return;

    var frag = document.createDocumentFragment();
    arr.forEach(function (item) {
      var clone = template.cloneNode(true);
      populateItem(clone, item);
      frag.appendChild(clone);
    });
    container.innerHTML = "";
    container.appendChild(frag);
  }

  function applyTopLevelRepeats(fileName) {
    document.querySelectorAll("[data-cms-repeat]").forEach(function (el) {
      if (el.closest("[data-cms-item]")) return; // nested — handled with its parent item
      var path = el.getAttribute("data-cms-repeat");
      if (path.split(".")[0] !== fileName) return;
      applyRepeat(el, undefined);
    });
  }

  function loadFile(name) {
    return fetch(BASE + name + ".json", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (json) {
        DATA[name] = json;
        applyScalarBindings(name);
        applyTopLevelRepeats(name);
        document.dispatchEvent(
          new CustomEvent("cms:data:" + name, { detail: json }),
        );
      })
      .catch(function (err) {
        console.warn(
          "[cms] " + name + ".json did not load — fallback content stays.",
          err,
        );
      });
  }

  function init() {
    var attr = document.body.getAttribute("data-cms-pages") || "";
    var files = attr
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    files.forEach(loadFile);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
