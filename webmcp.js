/* Twinstar privacy policy — agent access layer.
 *
 * WebMCP (navigator.modelContext) is an emerging proposal and is NOT yet shipped
 * in stable browsers, so this file is written as pure progressive enhancement:
 *   - If the agent supports it, five read-only tools are registered.
 *   - If it does not, nothing happens and the page is unaffected.
 *   - Either way `window.twinstarPrivacy` is exposed, and privacy.json +
 *     the JSON-LD block in <head> remain machine-readable with no JS at all.
 *
 * Every tool is READ-ONLY. There is nothing to mutate here, no form, no auth,
 * and no user data on this page — an agent can call any of these freely.
 * All answers come from privacy.json, which is the single source of truth that
 * the human-readable page is written from.
 */
(function () {
  "use strict";

  var DATA_URL = "privacy.json";
  var cache = null;

  function load() {
    if (cache) return Promise.resolve(cache);
    return fetch(DATA_URL, { credentials: "omit" })
      .then(function (r) {
        if (!r.ok) throw new Error("privacy.json HTTP " + r.status);
        return r.json();
      })
      .then(function (j) { cache = j; return j; });
  }

  function text(obj) {
    return { content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] };
  }

  var TOOLS = [
    {
      name: "get_privacy_summary",
      description: "Plain-language summary of the Twinstar: Mirror Comets privacy policy, " +
                   "plus app facts (platforms, whether an account or purchases are required) " +
                   "and the date it was last updated.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      run: function () {
        return load().then(function (d) {
          return text({
            document: d.document, summary: d.summary, app: d.app,
            last_updated: d.last_updated, canonical_url: d.canonical_url
          });
        });
      }
    },
    {
      name: "list_data_collected",
      description: "Every category of data the app causes to be collected. Each entry names the " +
                   "third party that processes it, why, which platforms it applies to, whether it " +
                   "is linked to the user's identity, and whether it is used for tracking. " +
                   "Optionally filter by platform.",
      inputSchema: {
        type: "object",
        properties: { platform: { type: "string", enum: ["Android", "iOS"], description: "Only return items that apply to this platform." } },
        additionalProperties: false
      },
      run: function (args) {
        return load().then(function (d) {
          var items = d.data_collected;
          var p = args && args.platform;
          if (p) items = items.filter(function (i) { return i.platforms.indexOf(p) !== -1; });
          return text({ platform: p || "all", count: items.length, data_collected: items, data_not_collected: d.data_not_collected });
        });
      }
    },
    {
      name: "list_third_party_services",
      description: "The third-party services the app integrates with, what each one is used for, " +
                   "and a link to that provider's own privacy policy.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      run: function () {
        return load().then(function (d) { return text({ third_party_services: d.third_party_services }); });
      }
    },
    {
      name: "get_opt_out_instructions",
      description: "Concrete steps a user can take to opt out of personalized ads, leaderboards, " +
                   "or online multiplayer data, plus every permission prompt the app shows and " +
                   "what happens if it is denied.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      run: function () {
        return load().then(function (d) {
          return text({ opt_out: d.opt_out, permission_prompts: d.permission_prompts });
        });
      }
    },
    {
      name: "get_contact_and_deletion",
      description: "How to contact the developer, how data retention works, how to delete data, " +
                   "and the policy's position on children's privacy.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      run: function () {
        return load().then(function (d) {
          return text({ contact: d.contact, retention_and_deletion: d.retention_and_deletion, children: d.children });
        });
      }
    }
  ];

  // Always available, with or without WebMCP.
  window.twinstarPrivacy = {
    url: DATA_URL,
    tools: TOOLS.map(function (t) { return { name: t.name, description: t.description }; }),
    call: function (name, args) {
      var t = TOOLS.filter(function (x) { return x.name === name; })[0];
      if (!t) return Promise.reject(new Error("Unknown tool: " + name));
      return t.run(args || {});
    },
    data: load
  };

  var mc = typeof navigator !== "undefined" && navigator.modelContext;
  if (!mc) return; // no WebMCP agent present — nothing further to do

  var descriptors = TOOLS.map(function (t) {
    return {
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
      annotations: { readOnlyHint: true, openWorldHint: false },
      execute: function (args) { return t.run(args || {}); }
    };
  });

  try {
    // The proposal has moved between two shapes; support both rather than betting on one.
    if (typeof mc.provideContext === "function") {
      mc.provideContext({ tools: descriptors });
    } else if (typeof mc.registerTool === "function") {
      descriptors.forEach(function (d) { mc.registerTool(d); });
    }
  } catch (e) {
    // A failed registration must never break the page for a human reader.
    if (window.console && console.debug) console.debug("WebMCP registration skipped:", e);
  }
})();
