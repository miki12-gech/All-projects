import { _ as __nuxt_component_0 } from './nuxt-link-Mg6C6SDi.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, openBlock, createBlock, createVNode, toRef, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useNuxtApp } from './server.mjs';
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

const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useTheme = () => {
  const isDark = useState("theme", () => false);
  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };
  const initTheme = () => {
  };
  return { isDark, toggleTheme, initTheme };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const userData = ref(null);
    const userRole = ref("");
    const { isDark } = useTheme();
    const stats = ref({
      totalStudents: 1250,
      totalTeachers: 45,
      totalClasses: 24,
      attendanceRate: 94.5
    });
    const recentStudents = ref([]);
    const announcements = ref([
      {
        id: 1,
        title: "Parent-Teacher Meeting",
        message: "Scheduled for next Saturday at 2:00 PM in the school auditorium.",
        date: "2 days ago"
      },
      {
        id: 2,
        title: "Exam Schedule Released",
        message: "Second semester final exams will begin on March 15th, 2026.",
        date: "5 days ago"
      },
      {
        id: 3,
        title: "New Canteen Menu",
        message: "Updated canteen menu is now available. Check the notice board for details.",
        date: "1 week ago"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><nav class="glass-card sticky top-0 z-40 border-b border-gray-100 shadow-lg"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center h-16"><div class="flex items-center gap-4"><div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div><div><h1 class="text-xl font-bold text-gray-800">Agazi School</h1><p class="text-xs text-gray-500">Management Dashboard</p></div></div><div class="flex items-center gap-4"><button class="relative p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg><span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button><button class="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">`);
      if (unref(isDark)) {
        _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`);
      } else {
        _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`);
      }
      _push(`</button><div class="flex items-center gap-3 pl-4 border-l border-gray-200"><div class="text-right"><p class="text-sm font-semibold text-gray-800">${ssrInterpolate(((_a = unref(userData)) == null ? void 0 : _a.email) || "User")}</p><p class="text-xs text-gray-500 capitalize">${ssrInterpolate(unref(userRole))}</p></div><div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">${ssrInterpolate((((_b = unref(userData)) == null ? void 0 : _b.email) || "U")[0].toUpperCase())}</div></div><button class="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-semibold transition-all flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Logout </button></div></div></div></nav><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="mb-8 fade-in-up"><h2 class="text-3xl font-bold text-gradient mb-2"> Welcome back, ${ssrInterpolate(((_d = (_c = unref(userData)) == null ? void 0 : _c.email) == null ? void 0 : _d.split("@")[0]) || "User")}! \u{1F44B} </h2><p class="text-gray-600">Here&#39;s what&#39;s happening with your school today.</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"><div class="stat-card bg-gradient-to-br from-amber-500 to-yellow-600 text-white"><div class="flex items-start justify-between"><div><p class="text-yellow-100 text-sm font-medium mb-1">Total Students</p><h3 class="text-3xl font-bold">${ssrInterpolate(unref(stats).totalStudents)}</h3><p class="text-yellow-100 text-xs mt-2 flex items-center gap-1"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"></path></svg> +12% from last month </p></div><div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg></div></div></div><div class="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white"><div class="flex items-start justify-between"><div><p class="text-green-100 text-sm font-medium mb-1">Teachers</p><h3 class="text-3xl font-bold">${ssrInterpolate(unref(stats).totalTeachers)}</h3><p class="text-green-100 text-xs mt-2">Active staff members</p></div><div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg></div></div></div><div class="stat-card bg-gradient-to-br from-blue-500 to-indigo-600 text-white"><div class="flex items-start justify-between"><div><p class="text-blue-100 text-sm font-medium mb-1">Classes</p><h3 class="text-3xl font-bold">${ssrInterpolate(unref(stats).totalClasses)}</h3><p class="text-blue-100 text-xs mt-2">Across all grades</p></div><div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path></svg></div></div></div><div class="stat-card bg-gradient-to-br from-orange-500 to-orange-600 text-white"><div class="flex items-start justify-between"><div><p class="text-orange-100 text-sm font-medium mb-1">Attendance Rate</p><h3 class="text-3xl font-bold">${ssrInterpolate(unref(stats).attendanceRate)}%</h3><p class="text-orange-100 text-xs mt-2">This month average</p></div><div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg></div></div></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"><div class="glass-card p-6"><div class="flex items-center justify-between mb-6"><h3 class="text-xl font-bold text-gray-800">Recent Students</h3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/students",
        class: "text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View All <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"${_scopeId}></path></svg>`);
          } else {
            return [
              createTextVNode(" View All "),
              (openBlock(), createBlock("svg", {
                class: "w-4 h-4",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M9 5l7 7-7 7"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-4"><!--[-->`);
      ssrRenderList(unref(recentStudents), (student) => {
        _push(`<div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">${ssrInterpolate(student.firstName[0])}${ssrInterpolate(student.lastName[0])}</div><div><p class="font-semibold text-gray-800">${ssrInterpolate(student.firstName)} ${ssrInterpolate(student.lastName)}</p><p class="text-sm text-gray-500">Grade ${ssrInterpolate(student.gradeLevel)}</p></div></div><div class="badge bg-amber-100 text-amber-700">${ssrInterpolate(student.stream || "General")}</div></div>`);
      });
      _push(`<!--]-->`);
      if (!unref(recentStudents).length) {
        _push(`<div class="text-center py-8 text-gray-400"><svg class="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><p>No students found</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="glass-card p-6"><h3 class="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3><div class="grid grid-cols-2 gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/students",
        class: "p-6 bg-gradient-to-br from-amber-50 to-yellow-100 hover:from-amber-100 hover:to-yellow-200 rounded-xl cursor-pointer transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-3 shadow-lg"${_scopeId}><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"${_scopeId}></path></svg></div><p class="font-bold text-gray-800"${_scopeId}>Add Student</p><p class="text-xs text-gray-600 mt-1"${_scopeId}>Register new student</p>`);
          } else {
            return [
              createVNode("div", { class: "w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-3 shadow-lg" }, [
                (openBlock(), createBlock("svg", {
                  class: "w-6 h-6 text-white",
                  fill: "currentColor",
                  viewBox: "0 0 20 20"
                }, [
                  createVNode("path", { d: "M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" })
                ]))
              ]),
              createVNode("p", { class: "font-bold text-gray-800" }, "Add Student"),
              createVNode("p", { class: "text-xs text-gray-600 mt-1" }, "Register new student")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/attendance",
        class: "p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl cursor-pointer transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3 shadow-lg"${_scopeId}><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"${_scopeId}></path></svg></div><p class="font-bold text-gray-800"${_scopeId}>Attendance</p><p class="text-xs text-gray-600 mt-1"${_scopeId}>Mark attendance</p>`);
          } else {
            return [
              createVNode("div", { class: "w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3 shadow-lg" }, [
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
              ]),
              createVNode("p", { class: "font-bold text-gray-800" }, "Attendance"),
              createVNode("p", { class: "text-xs text-gray-600 mt-1" }, "Mark attendance")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/grades",
        class: "p-6 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-xl cursor-pointer transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 shadow-lg"${_scopeId}><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"${_scopeId}></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"${_scopeId}></path></svg></div><p class="font-bold text-gray-800"${_scopeId}>Enter Grades</p><p class="text-xs text-gray-600 mt-1"${_scopeId}>Record student scores</p>`);
          } else {
            return [
              createVNode("div", { class: "w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 shadow-lg" }, [
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
              ]),
              createVNode("p", { class: "font-bold text-gray-800" }, "Enter Grades"),
              createVNode("p", { class: "text-xs text-gray-600 mt-1" }, "Record student scores")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/reports",
        class: "p-6 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl cursor-pointer transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3 shadow-lg"${_scopeId}><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"${_scopeId}></path></svg></div><p class="font-bold text-gray-800"${_scopeId}>View Reports</p><p class="text-xs text-gray-600 mt-1"${_scopeId}>Analytics &amp; reports</p>`);
          } else {
            return [
              createVNode("div", { class: "w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3 shadow-lg" }, [
                (openBlock(), createBlock("svg", {
                  class: "w-6 h-6 text-white",
                  fill: "currentColor",
                  viewBox: "0 0 20 20"
                }, [
                  createVNode("path", { d: "M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" })
                ]))
              ]),
              createVNode("p", { class: "font-bold text-gray-800" }, "View Reports"),
              createVNode("p", { class: "text-xs text-gray-600 mt-1" }, "Analytics & reports")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="glass-card p-6"><h3 class="text-xl font-bold text-gray-800 mb-6">\u{1F4E2} Latest Announcements</h3><div class="space-y-4"><!--[-->`);
      ssrRenderList(unref(announcements), (announcement) => {
        _push(`<div class="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-lg hover:shadow-md transition-shadow"><div class="flex items-start justify-between"><div><h4 class="font-bold text-gray-800">${ssrInterpolate(announcement.title)}</h4><p class="text-sm text-gray-600 mt-1">${ssrInterpolate(announcement.message)}</p></div><span class="text-xs text-gray-500">${ssrInterpolate(announcement.date)}</span></div></div>`);
      });
      _push(`<!--]--></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-BIgMZi65.mjs.map
