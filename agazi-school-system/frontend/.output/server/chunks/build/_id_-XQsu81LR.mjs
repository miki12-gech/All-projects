import { _ as __nuxt_component_0 } from './nuxt-link-Mg6C6SDi.mjs';
import { defineComponent, ref, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc, a as useRoute } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const report = ref(null);
    const studentInfo = ref(null);
    const loading = ref(false);
    const selectedTerm = ref(1);
    const getLetterGrade = (score) => {
      if (score >= 90) return "A";
      if (score >= 80) return "B";
      if (score >= 70) return "C";
      if (score >= 60) return "D";
      return "F";
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 p-4 md:p-10" }, _attrs))} data-v-15c8b3b1><div class="max-w-4xl mx-auto mb-4" data-v-15c8b3b1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/reports",
        class: "inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 font-semibold transition-all"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-15c8b3b1${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" data-v-15c8b3b1${_scopeId}></path></svg> Back to Reports `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-5 h-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                })
              ])),
              createTextVNode(" Back to Reports ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="max-w-4xl mx-auto glass-card overflow-hidden fade-in-up" data-v-15c8b3b1><div class="p-8 text-center bg-gradient-to-br from-blue-600 to-purple-600 text-white" data-v-15c8b3b1><div class="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl" data-v-15c8b3b1><svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-15c8b3b1><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-v-15c8b3b1></path></svg></div><h1 class="text-4xl font-bold mb-2" data-v-15c8b3b1>\u12A0\u130B\u12DA \u1218\u1230\u1293\u12F6 \u1275\u121D\u1205\u122D\u1275 \u1264\u1275</h1><p class="text-blue-100 font-semibold uppercase tracking-widest" data-v-15c8b3b1>Student Report Card</p><div class="mt-6 flex justify-center" data-v-15c8b3b1><select class="px-6 py-3 bg-white/20 backdrop-blur-lg border-2 border-white/30 rounded-xl text-white font-semibold outline-none focus:ring-4 focus:ring-white/30 transition-all cursor-pointer" data-v-15c8b3b1><option value="1" class="text-gray-800" data-v-15c8b3b1${ssrIncludeBooleanAttr(Array.isArray(unref(selectedTerm)) ? ssrLooseContain(unref(selectedTerm), "1") : ssrLooseEqual(unref(selectedTerm), "1")) ? " selected" : ""}>Term 1</option><option value="2" class="text-gray-800" data-v-15c8b3b1${ssrIncludeBooleanAttr(Array.isArray(unref(selectedTerm)) ? ssrLooseContain(unref(selectedTerm), "2") : ssrLooseEqual(unref(selectedTerm), "2")) ? " selected" : ""}>Term 2</option></select></div></div>`);
      if (unref(studentInfo)) {
        _push(`<div class="p-8 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100" data-v-15c8b3b1><div class="flex items-center justify-between" data-v-15c8b3b1><div class="flex items-center gap-4" data-v-15c8b3b1><div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" data-v-15c8b3b1>${ssrInterpolate((unref(studentInfo).firstName || "S")[0])}${ssrInterpolate((unref(studentInfo).lastName || "T")[0])}</div><div data-v-15c8b3b1><h2 class="text-2xl font-bold text-gray-800" data-v-15c8b3b1>${ssrInterpolate(unref(studentInfo).firstName)} ${ssrInterpolate(unref(studentInfo).lastName)}</h2><p class="text-gray-600" data-v-15c8b3b1>Grade ${ssrInterpolate(unref(studentInfo).gradeLevel)} \u2022 ${ssrInterpolate(unref(studentInfo).stream || "General")}</p></div></div><div class="text-right" data-v-15c8b3b1><p class="text-sm text-gray-500 font-semibold" data-v-15c8b3b1>Student ID</p><p class="text-lg font-bold text-gray-800" data-v-15c8b3b1>${ssrInterpolate(unref(route).params.id.slice(0, 8))}</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="p-20 text-center" data-v-15c8b3b1><svg class="animate-spin h-16 w-16 mx-auto text-blue-600 mb-4" viewBox="0 0 24 24" data-v-15c8b3b1><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" data-v-15c8b3b1></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-15c8b3b1></path></svg><p class="text-gray-600 font-semibold" data-v-15c8b3b1>Loading report card...</p></div>`);
      } else if (!unref(report)) {
        _push(`<div class="p-20 text-center text-gray-400" data-v-15c8b3b1><svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-15c8b3b1><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-15c8b3b1></path></svg><p class="text-xl font-bold mb-2" data-v-15c8b3b1>No Report Available</p><p class="text-sm" data-v-15c8b3b1>No grades have been recorded for this term yet.</p></div>`);
      } else {
        _push(`<div data-v-15c8b3b1><div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gray-50" data-v-15c8b3b1><div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white" data-v-15c8b3b1><div class="text-center" data-v-15c8b3b1><p class="text-blue-100 text-sm font-medium mb-2" data-v-15c8b3b1>Average Score</p><p class="text-5xl font-bold" data-v-15c8b3b1>${ssrInterpolate(unref(report).average)}%</p><div class="mt-3" data-v-15c8b3b1><div class="${ssrRenderClass([
          "inline-block px-4 py-1 rounded-full font-semibold text-sm",
          unref(report).average >= 90 ? "bg-green-400" : unref(report).average >= 80 ? "bg-blue-400" : unref(report).average >= 70 ? "bg-yellow-400" : unref(report).average >= 60 ? "bg-orange-400" : "bg-red-400"
        ])}" data-v-15c8b3b1>${ssrInterpolate(getLetterGrade(unref(report).average))}</div></div></div></div><div class="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white" data-v-15c8b3b1><div class="text-center" data-v-15c8b3b1><p class="text-purple-100 text-sm font-medium mb-2" data-v-15c8b3b1>Total Score</p><p class="text-5xl font-bold" data-v-15c8b3b1>${ssrInterpolate(unref(report).totalScore)}</p><p class="text-purple-100 text-sm mt-3" data-v-15c8b3b1>Out of ${ssrInterpolate(unref(report).totalPossible || (((_a = unref(report).details) == null ? void 0 : _a.length) || 0) * 100)}</p></div></div><div class="stat-card bg-gradient-to-br from-green-500 to-emerald-600 text-white" data-v-15c8b3b1><div class="text-center" data-v-15c8b3b1><p class="text-green-100 text-sm font-medium mb-2" data-v-15c8b3b1>Status</p><div class="my-3" data-v-15c8b3b1>`);
        if (unref(report).status === "PASSED") {
          _push(`<svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" data-v-15c8b3b1><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-15c8b3b1></path></svg>`);
        } else {
          _push(`<svg class="w-16 h-16 mx-auto text-red-300" fill="currentColor" viewBox="0 0 20 20" data-v-15c8b3b1><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" data-v-15c8b3b1></path></svg>`);
        }
        _push(`</div><p class="text-2xl font-bold" data-v-15c8b3b1>${ssrInterpolate(unref(report).status === "PASSED" ? "PASSED" : "FAILED")}</p></div></div></div><div class="p-8" data-v-15c8b3b1><h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2" data-v-15c8b3b1><svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" data-v-15c8b3b1><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" data-v-15c8b3b1></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-15c8b3b1></path></svg> Subject Grades </h3><table class="data-table" data-v-15c8b3b1><thead data-v-15c8b3b1><tr data-v-15c8b3b1><th data-v-15c8b3b1>Subject</th><th data-v-15c8b3b1>Score</th><th data-v-15c8b3b1>Letter Grade</th><th data-v-15c8b3b1>Status</th></tr></thead><tbody data-v-15c8b3b1><!--[-->`);
        ssrRenderList(unref(report).details, (item) => {
          _push(`<tr data-v-15c8b3b1><td data-v-15c8b3b1><div class="flex items-center gap-3" data-v-15c8b3b1><div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold" data-v-15c8b3b1>${ssrInterpolate(item.subject.charAt(0))}</div><span class="font-semibold text-gray-800" data-v-15c8b3b1>${ssrInterpolate(item.subject)}</span></div></td><td data-v-15c8b3b1><span class="text-xl font-bold text-blue-600" data-v-15c8b3b1>${ssrInterpolate(item.score)}%</span></td><td data-v-15c8b3b1><div class="${ssrRenderClass([
            "badge",
            getLetterGrade(item.score) === "A" ? "badge-success" : "",
            getLetterGrade(item.score) === "B" ? "badge-info" : "",
            getLetterGrade(item.score) === "C" ? "badge-warning" : "",
            ["D", "F"].includes(getLetterGrade(item.score)) ? "badge-error" : ""
          ])}" data-v-15c8b3b1>${ssrInterpolate(getLetterGrade(item.score))}</div></td><td data-v-15c8b3b1>`);
          if (item.score >= 50) {
            _push(`<div class="badge badge-success" data-v-15c8b3b1>Passed</div>`);
          } else {
            _push(`<div class="badge badge-error" data-v-15c8b3b1>Failed</div>`);
          }
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div><div class="p-8 bg-gray-50" data-v-15c8b3b1><h3 class="text-xl font-bold text-gray-800 mb-4" data-v-15c8b3b1>Performance Distribution</h3><div class="space-y-3" data-v-15c8b3b1><!--[-->`);
        ssrRenderList(unref(report).details, (item) => {
          _push(`<div data-v-15c8b3b1><div class="flex justify-between mb-1" data-v-15c8b3b1><span class="text-sm font-semibold text-gray-700" data-v-15c8b3b1>${ssrInterpolate(item.subject)}</span><span class="text-sm font-bold text-blue-600" data-v-15c8b3b1>${ssrInterpolate(item.score)}%</span></div><div class="w-full bg-gray-200 rounded-full h-3" data-v-15c8b3b1><div class="${ssrRenderClass([
            "h-3 rounded-full transition-all duration-500",
            item.score >= 90 ? "bg-gradient-to-r from-green-400 to-green-600" : item.score >= 80 ? "bg-gradient-to-r from-blue-400 to-blue-600" : item.score >= 70 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" : item.score >= 60 ? "bg-gradient-to-r from-orange-400 to-orange-600" : "bg-gradient-to-r from-red-400 to-red-600"
          ])}" style="${ssrRenderStyle({ width: item.score + "%" })}" data-v-15c8b3b1></div></div></div>`);
        });
        _push(`<!--]--></div></div><div class="p-6 bg-white border-t border-gray-100 flex justify-between items-center" data-v-15c8b3b1><div class="text-sm text-gray-500" data-v-15c8b3b1><p class="font-semibold" data-v-15c8b3b1>Report Generated: ${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString())}</p><p data-v-15c8b3b1>Term ${ssrInterpolate(unref(selectedTerm))} \u2022 Academic Year 2025/2026</p></div><div class="flex gap-3" data-v-15c8b3b1><button class="btn-secondary flex items-center gap-2" data-v-15c8b3b1><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-15c8b3b1><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" data-v-15c8b3b1></path></svg> Export PDF </button><button class="btn-primary flex items-center gap-2" data-v-15c8b3b1><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-15c8b3b1><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" data-v-15c8b3b1></path></svg> Print Report </button></div></div></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reports/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-15c8b3b1"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-XQsu81LR.mjs.map
