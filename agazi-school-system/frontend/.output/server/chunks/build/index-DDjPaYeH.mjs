import { _ as __nuxt_component_0 } from './nuxt-link-Mg6C6SDi.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
    const selectedDate = ref((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const selectedGrade = ref("");
    const selectedSection = ref("");
    const students = ref([]);
    const attendance = ref({});
    const loading = ref(false);
    const saving = ref(false);
    const availableSections = ref([]);
    const stats = computed(() => {
      const present = Object.values(attendance.value).filter((s) => s === "PRESENT").length;
      const absent = Object.values(attendance.value).filter((s) => s === "ABSENT").length;
      const late = Object.values(attendance.value).filter((s) => s === "LATE").length;
      return { present, absent, late };
    });
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
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
            _push2(`<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-6 h-6 text-white",
                fill: "currentColor",
                viewBox: "0 0 20 20"
              }, [
                createVNode("path", {
                  "fill-rule": "evenodd",
                  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                  "clip-rule": "evenodd"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><h1 class="text-xl font-bold text-gray-800">Attendance Management</h1><p class="text-xs text-gray-500">Mark daily attendance for students</p></div></div>`);
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
      _push(`</div></div></nav><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="glass-card p-6 mb-6"><h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg> Attendance Filters </h2><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label class="block text-sm font-bold text-gray-700 mb-2">Select Date</label><input${ssrRenderAttr("value", unref(selectedDate))} type="date" class="input-field"></div><div><label class="block text-sm font-bold text-gray-700 mb-2">Select Grade *</label><select class="input-field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedGrade)) ? ssrLooseContain(unref(selectedGrade), "") : ssrLooseEqual(unref(selectedGrade), "")) ? " selected" : ""}>Choose Grade</option><option value="9"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedGrade)) ? ssrLooseContain(unref(selectedGrade), "9") : ssrLooseEqual(unref(selectedGrade), "9")) ? " selected" : ""}>Grade 9</option><option value="10"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedGrade)) ? ssrLooseContain(unref(selectedGrade), "10") : ssrLooseEqual(unref(selectedGrade), "10")) ? " selected" : ""}>Grade 10</option><option value="11"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedGrade)) ? ssrLooseContain(unref(selectedGrade), "11") : ssrLooseEqual(unref(selectedGrade), "11")) ? " selected" : ""}>Grade 11</option><option value="12"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedGrade)) ? ssrLooseContain(unref(selectedGrade), "12") : ssrLooseEqual(unref(selectedGrade), "12")) ? " selected" : ""}>Grade 12</option></select></div><div><label class="block text-sm font-bold text-gray-700 mb-2">Select Section *</label><select${ssrIncludeBooleanAttr(!unref(selectedGrade)) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": !unref(selectedGrade) }, "input-field"])}"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedSection)) ? ssrLooseContain(unref(selectedSection), "") : ssrLooseEqual(unref(selectedSection), "")) ? " selected" : ""}>All Sections</option><!--[-->`);
      ssrRenderList(unref(availableSections), (section) => {
        _push(`<option${ssrRenderAttr("value", section)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedSection)) ? ssrLooseContain(unref(selectedSection), section) : ssrLooseEqual(unref(selectedSection), section)) ? " selected" : ""}> Section ${ssrInterpolate(section)}</option>`);
      });
      _push(`<!--]--></select>`);
      if (!unref(selectedGrade)) {
        _push(`<p class="text-xs text-amber-600 mt-1">Select a grade first</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-end"><button${ssrIncludeBooleanAttr(!unref(selectedGrade) || unref(saving)) ? " disabled" : ""} class="btn-primary w-full flex items-center justify-center gap-2">`);
      if (unref(saving)) {
        _push(`<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(saving)) {
        _push(`<span>Saving...</span>`);
      } else {
        _push(`<span>\u{1F4BE} Save Attendance</span>`);
      }
      _push(`</button></div></div>`);
      if (unref(selectedGrade)) {
        _push(`<div class="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg"><p class="text-sm font-semibold text-gray-700"> \u{1F4DA} Viewing: <span class="text-amber-700">Grade ${ssrInterpolate(unref(selectedGrade))}</span>`);
        if (unref(selectedSection)) {
          _push(`<span class="text-amber-700"> - Section ${ssrInterpolate(unref(selectedSection))}</span>`);
        } else {
          _push(`<span class="text-gray-500"> (All Sections)</span>`);
        }
        _push(`</p><p class="text-xs text-gray-600 mt-1"> Showing ${ssrInterpolate(unref(students).length)} student(s) | Date: ${ssrInterpolate(formatDate(unref(selectedDate)))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"><div class="glass-card p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600 font-medium">Present</p><p class="text-3xl font-bold text-green-600">${ssrInterpolate(unref(stats).present)}</p></div><div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg></div></div></div><div class="glass-card p-4 bg-gradient-to-br from-red-50 to-rose-50 border-l-4 border-red-500"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600 font-medium">Absent</p><p class="text-3xl font-bold text-red-600">${ssrInterpolate(unref(stats).absent)}</p></div><div class="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg></div></div></div><div class="glass-card p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-yellow-500"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600 font-medium">Late</p><p class="text-3xl font-bold text-yellow-600">${ssrInterpolate(unref(stats).late)}</p></div><div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg></div></div></div><div class="glass-card p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-l-4 border-amber-500"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600 font-medium">Total</p><p class="text-3xl font-bold text-amber-700">${ssrInterpolate(unref(students).length)}</p></div><div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg></div></div></div></div><div class="glass-card overflow-hidden"><div class="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-yellow-50"><h3 class="text-lg font-bold text-gray-800 flex items-center gap-2"><svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg> Mark Attendance </h3><p class="text-sm text-gray-600 mt-1">Click on status buttons to mark attendance for each student</p></div>`);
      if (unref(loading)) {
        _push(`<div class="p-12 text-center"><svg class="animate-spin h-12 w-12 mx-auto text-amber-600 mb-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p class="text-gray-600 font-medium">Loading students...</p></div>`);
      } else if (!unref(selectedGrade)) {
        _push(`<div class="p-12 text-center text-gray-400"><svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg><p class="text-lg font-semibold mb-2">Select a grade to start</p><p class="text-sm">Choose a grade level from the dropdown above to view students</p></div>`);
      } else if (unref(students).length === 0) {
        _push(`<div class="p-12 text-center text-gray-400"><svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><p class="text-lg font-semibold mb-2">No students found</p><p class="text-sm"> No students found in Grade ${ssrInterpolate(unref(selectedGrade))} `);
        if (unref(selectedSection)) {
          _push(`<span> - Section ${ssrInterpolate(unref(selectedSection))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p></div>`);
      } else {
        _push(`<div class="divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(unref(students), (student, index) => {
          _push(`<div class="${ssrRenderClass([{ "bg-gray-50": index % 2 === 0 }, "p-4 hover:bg-amber-50 transition-colors"])}"><div class="flex items-center justify-between"><div class="flex items-center gap-4"><div class="flex-shrink-0"><div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">${ssrInterpolate(student.firstName[0])}${ssrInterpolate(student.lastName[0])}</div></div><div><p class="font-semibold text-gray-800">${ssrInterpolate(student.firstName)} ${ssrInterpolate(student.lastName)}</p><p class="text-sm text-gray-500"> Grade ${ssrInterpolate(student.gradeLevel)} `);
          if (student.section) {
            _push(`<span class="text-amber-600 font-medium"> - Section ${ssrInterpolate(student.section)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div></div><div class="flex gap-2"><button class="${ssrRenderClass([
            "px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105",
            unref(attendance)[student.id] === "PRESENT" ? "bg-green-500 text-white shadow-lg ring-2 ring-green-300" : "bg-gray-100 text-gray-600 hover:bg-green-100"
          ])}"> \u2713 Present </button><button class="${ssrRenderClass([
            "px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105",
            unref(attendance)[student.id] === "ABSENT" ? "bg-red-500 text-white shadow-lg ring-2 ring-red-300" : "bg-gray-100 text-gray-600 hover:bg-red-100"
          ])}"> \u2717 Absent </button><button class="${ssrRenderClass([
            "px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105",
            unref(attendance)[student.id] === "LATE" ? "bg-yellow-500 text-white shadow-lg ring-2 ring-yellow-300" : "bg-gray-100 text-gray-600 hover:bg-yellow-100"
          ])}"> \u23F0 Late </button></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/attendance/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DDjPaYeH.mjs.map
