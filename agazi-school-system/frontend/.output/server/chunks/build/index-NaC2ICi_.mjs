import { _ as __nuxt_component_0 } from './nuxt-link-Mg6C6SDi.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const students = ref([]);
    const subjects = ref([]);
    const availableSections = ref(["A", "B", "C", "D", "E", "F", "G"]);
    const loaded = ref(false);
    const saving = ref(false);
    const selection = ref({
      grade: "",
      section: "",
      subjectId: "",
      term: "1"
    });
    const isValidSelection = computed(() => {
      return selection.value.grade && selection.value.section && selection.value.subjectId;
    });
    const getSubjectName = (id) => {
      const s = subjects.value.find((sub) => sub.id === id);
      return s ? s.name : "";
    };
    const calculateTotal = (student) => {
      return (student.finalExam || 0) + (student.midExam || 0) + (student.quiz || 0) + (student.classActivity || 0);
    };
    const calculateLetter = (score) => {
      if (score >= 90) return "A+";
      if (score >= 85) return "A";
      if (score >= 80) return "A-";
      if (score >= 75) return "B+";
      if (score >= 70) return "B";
      if (score >= 65) return "B-";
      if (score >= 60) return "C+";
      if (score >= 55) return "C";
      if (score >= 50) return "C-";
      if (score >= 45) return "D";
      return "F";
    };
    const getGradeColor = (score) => {
      if (score >= 80) return "bg-green-100 text-green-800";
      if (score >= 60) return "bg-yellow-100 text-yellow-800";
      if (score >= 50) return "bg-orange-100 text-orange-800";
      return "bg-red-100 text-red-800";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><nav class="glass-card sticky top-0 z-40 border-b border-gray-100 shadow-lg"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center h-16"><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"${_scopeId}></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-6 h-6 text-white",
                fill: "currentColor",
                viewBox: "0 0 20 20"
              }, [
                createVNode("path", { d: "M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" }),
                createVNode("path", {
                  "fill-rule": "evenodd",
                  d: "M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                  "clip-rule": "evenodd"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><h1 class="text-xl font-bold text-gray-800">Grade Entry</h1><p class="text-xs text-gray-500">Record and manage student assessments</p></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "px-4 py-2 text-gray-600 hover:text-amber-600 font-semibold transition-all flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId}></path></svg> Back `);
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
              createTextVNode(" Back ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></nav><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="glass-card p-6 mb-6"><h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"></path></svg> Select Class &amp; Subject </h2><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label class="block text-sm font-bold text-gray-700 mb-2">Grade Level *</label><select class="input-field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selection).grade) ? ssrLooseContain(unref(selection).grade, "") : ssrLooseEqual(unref(selection).grade, "")) ? " selected" : ""}>Select Grade</option><option value="9"${ssrIncludeBooleanAttr(Array.isArray(unref(selection).grade) ? ssrLooseContain(unref(selection).grade, "9") : ssrLooseEqual(unref(selection).grade, "9")) ? " selected" : ""}>Grade 9</option><option value="10"${ssrIncludeBooleanAttr(Array.isArray(unref(selection).grade) ? ssrLooseContain(unref(selection).grade, "10") : ssrLooseEqual(unref(selection).grade, "10")) ? " selected" : ""}>Grade 10</option><option value="11"${ssrIncludeBooleanAttr(Array.isArray(unref(selection).grade) ? ssrLooseContain(unref(selection).grade, "11") : ssrLooseEqual(unref(selection).grade, "11")) ? " selected" : ""}>Grade 11</option><option value="12"${ssrIncludeBooleanAttr(Array.isArray(unref(selection).grade) ? ssrLooseContain(unref(selection).grade, "12") : ssrLooseEqual(unref(selection).grade, "12")) ? " selected" : ""}>Grade 12</option></select></div><div><label class="block text-sm font-bold text-gray-700 mb-2">Section *</label><select${ssrIncludeBooleanAttr(!unref(selection).grade) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-50": !unref(selection).grade }, "input-field"])}"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selection).section) ? ssrLooseContain(unref(selection).section, "") : ssrLooseEqual(unref(selection).section, "")) ? " selected" : ""}>Select Section</option><!--[-->`);
      ssrRenderList(unref(availableSections), (sec) => {
        _push(`<option${ssrRenderAttr("value", sec)}${ssrIncludeBooleanAttr(Array.isArray(unref(selection).section) ? ssrLooseContain(unref(selection).section, sec) : ssrLooseEqual(unref(selection).section, sec)) ? " selected" : ""}>Section ${ssrInterpolate(sec)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-sm font-bold text-gray-700 mb-2">Subject *</label><select${ssrIncludeBooleanAttr(!unref(selection).grade) ? " disabled" : ""} class="input-field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selection).subjectId) ? ssrLooseContain(unref(selection).subjectId, "") : ssrLooseEqual(unref(selection).subjectId, "")) ? " selected" : ""}>Select Subject</option><!--[-->`);
      ssrRenderList(unref(subjects), (sub) => {
        _push(`<option${ssrRenderAttr("value", sub.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(selection).subjectId) ? ssrLooseContain(unref(selection).subjectId, sub.id) : ssrLooseEqual(unref(selection).subjectId, sub.id)) ? " selected" : ""}>${ssrInterpolate(sub.name)} (${ssrInterpolate(sub.code)})</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-sm font-bold text-gray-700 mb-2">Term *</label><select class="input-field"><option value="1"${ssrIncludeBooleanAttr(Array.isArray(unref(selection).term) ? ssrLooseContain(unref(selection).term, "1") : ssrLooseEqual(unref(selection).term, "1")) ? " selected" : ""}>Term 1</option><option value="2"${ssrIncludeBooleanAttr(Array.isArray(unref(selection).term) ? ssrLooseContain(unref(selection).term, "2") : ssrLooseEqual(unref(selection).term, "2")) ? " selected" : ""}>Term 2</option></select></div></div><div class="mt-4 flex justify-end"><button${ssrIncludeBooleanAttr(!unref(isValidSelection)) ? " disabled" : ""} class="btn-primary w-full md:w-auto flex items-center justify-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Load Students </button></div></div>`);
      if (unref(loaded)) {
        _push(`<div class="glass-card overflow-hidden"><div class="p-4 bg-amber-50 border-b border-amber-100 flex justify-between items-center"><div><h3 class="font-bold text-gray-800">Grade ${ssrInterpolate(unref(selection).grade)}${ssrInterpolate(unref(selection).section)} - ${ssrInterpolate(getSubjectName(unref(selection).subjectId))}</h3><p class="text-xs text-gray-500">Academic Year: 2025/2026</p></div><button${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2">`);
        if (unref(saving)) {
          _push(`<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(unref(saving) ? "Saving..." : "\u{1F4BE} Save All Grades")}</button></div><div class="overflow-x-auto"><table class="w-full"><thead><tr class="bg-gray-50 text-gray-600 text-sm border-b"><th class="px-4 py-3 text-left w-64 sticky left-0 bg-gray-50 z-10">Student Name</th><th class="px-2 py-3 text-center">Final (50%)</th><th class="px-2 py-3 text-center">Mid (30%)</th><th class="px-2 py-3 text-center">Quiz (10%)</th><th class="px-2 py-3 text-center">Activity (10%)</th><th class="px-4 py-3 text-center font-bold text-gray-800">Total (100%)</th><th class="px-4 py-3 text-center">Grade</th><th class="px-4 py-3 text-center">Status</th></tr></thead><tbody class="divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(unref(students), (student) => {
          _push(`<tr class="hover:bg-amber-50"><td class="px-4 py-3 sticky left-0 bg-white z-10 font-medium text-gray-800 border-r">${ssrInterpolate(student.name)}</td><td class="px-2 py-3"><input type="number"${ssrRenderAttr("value", student.finalExam)} min="0" max="50" class="w-full px-2 py-1 border rounded text-center focus:ring-2 focus:ring-amber-300 outline-none" placeholder="0-50"></td><td class="px-2 py-3"><input type="number"${ssrRenderAttr("value", student.midExam)} min="0" max="30" class="w-full px-2 py-1 border rounded text-center focus:ring-2 focus:ring-amber-300 outline-none" placeholder="0-30"></td><td class="px-2 py-3"><input type="number"${ssrRenderAttr("value", student.quiz)} min="0" max="10" class="w-full px-2 py-1 border rounded text-center focus:ring-2 focus:ring-amber-300 outline-none" placeholder="0-10"></td><td class="px-2 py-3"><input type="number"${ssrRenderAttr("value", student.classActivity)} min="0" max="10" class="w-full px-2 py-1 border rounded text-center focus:ring-2 focus:ring-amber-300 outline-none" placeholder="0-10"></td><td class="px-4 py-3 text-center font-bold text-lg text-gray-800">${ssrInterpolate(calculateTotal(student))}</td><td class="px-4 py-3 text-center"><span class="${ssrRenderClass([getGradeColor(calculateTotal(student)), "px-3 py-1 rounded-full font-bold text-sm"])}">${ssrInterpolate(calculateLetter(calculateTotal(student)))}</span></td><td class="px-4 py-3 text-center"><span class="${ssrRenderClass([calculateTotal(student) >= 50 ? "text-green-600" : "text-red-600", "text-xs font-bold uppercase"])}">${ssrInterpolate(calculateTotal(student) >= 50 ? "PASS" : "FAIL")}</span></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
        if (unref(students).length === 0) {
          _push(`<div class="p-12 text-center text-gray-500"> No students found in this class. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/grades/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-NaC2ICi_.mjs.map
