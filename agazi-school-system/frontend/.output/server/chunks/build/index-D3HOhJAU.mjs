import { _ as __nuxt_component_0 } from './nuxt-link-Mg6C6SDi.mjs';
import { defineComponent, ref, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
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
    const loading = ref(true);
    const submitting = ref(false);
    const showModal = ref(false);
    const isEditing = ref(false);
    ref(null);
    const filters = ref({
      grade: "",
      section: "",
      stream: ""
    });
    const availableSections = ref([]);
    const form = ref({
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      phoneNumber: "",
      address: "",
      gradeLevel: 9,
      stream: "",
      section: "",
      // Read-only for edit
      fatherName: "",
      motherName: "",
      guardianName: "",
      guardianPhone: "",
      emergencyContact: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><nav class="glass-card sticky top-0 z-40 border-b border-gray-100 shadow-lg"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center h-16"><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-6 h-6 text-white",
                fill: "currentColor",
                viewBox: "0 0 20 20"
              }, [
                createVNode("path", { d: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><h1 class="text-xl font-bold text-gray-800">Student Management</h1><p class="text-xs text-gray-500">Register, update and manage students</p></div></div>`);
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
      _push(`</div></div></nav><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="glass-card p-6 mb-6"><div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"><h2 class="text-lg font-bold text-gray-800 flex items-center gap-2"><svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"></path></svg> Filters </h2><button class="btn-primary flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> Register Student </button></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label class="block text-sm font-bold text-gray-700 mb-2">Grade Level</label><select class="input-field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).grade) ? ssrLooseContain(unref(filters).grade, "") : ssrLooseEqual(unref(filters).grade, "")) ? " selected" : ""}>All Grades</option><option value="9"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).grade) ? ssrLooseContain(unref(filters).grade, "9") : ssrLooseEqual(unref(filters).grade, "9")) ? " selected" : ""}>Grade 9</option><option value="10"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).grade) ? ssrLooseContain(unref(filters).grade, "10") : ssrLooseEqual(unref(filters).grade, "10")) ? " selected" : ""}>Grade 10</option><option value="11"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).grade) ? ssrLooseContain(unref(filters).grade, "11") : ssrLooseEqual(unref(filters).grade, "11")) ? " selected" : ""}>Grade 11</option><option value="12"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).grade) ? ssrLooseContain(unref(filters).grade, "12") : ssrLooseEqual(unref(filters).grade, "12")) ? " selected" : ""}>Grade 12</option></select></div><div><label class="block text-sm font-bold text-gray-700 mb-2">Section</label><select${ssrIncludeBooleanAttr(!unref(filters).grade) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": !unref(filters).grade }, "input-field"])}"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).section) ? ssrLooseContain(unref(filters).section, "") : ssrLooseEqual(unref(filters).section, "")) ? " selected" : ""}>All Sections</option><!--[-->`);
      ssrRenderList(unref(availableSections), (sec) => {
        _push(`<option${ssrRenderAttr("value", sec)}${ssrIncludeBooleanAttr(Array.isArray(unref(filters).section) ? ssrLooseContain(unref(filters).section, sec) : ssrLooseEqual(unref(filters).section, sec)) ? " selected" : ""}>Section ${ssrInterpolate(sec)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-sm font-bold text-gray-700 mb-2">Stream</label><select class="input-field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).stream) ? ssrLooseContain(unref(filters).stream, "") : ssrLooseEqual(unref(filters).stream, "")) ? " selected" : ""}>All Streams</option><option value="NATURAL"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).stream) ? ssrLooseContain(unref(filters).stream, "NATURAL") : ssrLooseEqual(unref(filters).stream, "NATURAL")) ? " selected" : ""}>Natural Science</option><option value="SOCIAL"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).stream) ? ssrLooseContain(unref(filters).stream, "SOCIAL") : ssrLooseEqual(unref(filters).stream, "SOCIAL")) ? " selected" : ""}>Social Science</option></select></div></div></div><div class="glass-card overflow-hidden">`);
      if (unref(loading)) {
        _push(`<div class="p-12 text-center"><svg class="animate-spin h-12 w-12 mx-auto text-amber-600 mb-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p class="text-gray-600">Loading students...</p></div>`);
      } else if (unref(students).length === 0) {
        _push(`<div class="p-12 text-center text-gray-400"><svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg><p class="text-lg font-semibold">No students found</p><p>Try adjusting your filters or add a new student.</p></div>`);
      } else {
        _push(`<div class="overflow-x-auto"><table class="data-table w-full"><thead><tr><th class="px-6 py-4">Student Name</th><th class="px-6 py-4">ID / Email</th><th class="px-6 py-4">Grade &amp; Section</th><th class="px-6 py-4">Phone</th><th class="px-6 py-4">Actions</th></tr></thead><tbody class="divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(unref(students), (student) => {
          var _a;
          _push(`<tr class="hover:bg-amber-50 transition-colors"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">${ssrInterpolate(student.firstName[0])}${ssrInterpolate(student.lastName[0])}</div><div><p class="font-semibold text-gray-800">${ssrInterpolate(student.firstName)} ${ssrInterpolate(student.lastName)}</p><p class="text-xs text-gray-500">Gender: ${ssrInterpolate(student.gender || "N/A")}</p></div></div></td><td class="px-6 py-4"><div class="text-sm"><p class="text-gray-800 font-medium">${ssrInterpolate(((_a = student.user) == null ? void 0 : _a.email) || "N/A")}</p><p class="text-xs text-gray-500">ID: ${ssrInterpolate(student.id.substring(0, 8))}...</p></div></td><td class="px-6 py-4"><span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold"> Grade ${ssrInterpolate(student.gradeLevel)} - ${ssrInterpolate(student.section || "N/A")}</span>`);
          if (student.stream) {
            _push(`<p class="text-xs text-gray-500 mt-1">${ssrInterpolate(student.stream)} Science</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-6 py-4 text-gray-600">${ssrInterpolate(student.phoneNumber || "N/A")}</td><td class="px-6 py-4"><div class="flex gap-2"><button class="text-blue-600 hover:text-blue-800 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button class="text-red-600 hover:text-red-800 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      _push(`</div></div>`);
      if (unref(showModal)) {
        _push(`<div class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"><div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all"><div class="p-6 bg-gradient-to-r from-amber-500 to-yellow-600 text-white flex justify-between items-center sticky top-0 z-10"><h3 class="text-2xl font-bold">${ssrInterpolate(unref(isEditing) ? "Edit Student" : "Register New Student")}</h3><button class="text-white hover:text-gray-200"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="p-6 space-y-6"><div><h4 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Personal Information</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-bold text-gray-700 mb-1">First Name *</label><input${ssrRenderAttr("value", unref(form).firstName)} type="text" class="input-field" required></div><div><label class="block text-sm font-bold text-gray-700 mb-1">Last Name *</label><input${ssrRenderAttr("value", unref(form).lastName)} type="text" class="input-field" required></div><div><label class="block text-sm font-bold text-gray-700 mb-1">Email `);
        if (!unref(isEditing)) {
          _push(`<span>(Auto-generated if empty)</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label><input${ssrRenderAttr("value", unref(form).email)} type="email" class="input-field"${ssrIncludeBooleanAttr(unref(isEditing)) ? " disabled" : ""}></div><div><label class="block text-sm font-bold text-gray-700 mb-1">Date of Birth *</label><input${ssrRenderAttr("value", unref(form).dateOfBirth)} type="date" class="input-field" required></div><div><label class="block text-sm font-bold text-gray-700 mb-1">Phone Number (10 digits) *</label><input${ssrRenderAttr("value", unref(form).phoneNumber)} type="tel" placeholder="0911000000" pattern="0[0-9]{9}" class="input-field" required><p class="text-xs text-gray-500 mt-1">Must start with 0 and be 10 digits.</p></div><div><label class="block text-sm font-bold text-gray-700 mb-1">Address</label><input${ssrRenderAttr("value", unref(form).address)} type="text" class="input-field"></div></div></div><div><h4 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Academic Information</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-bold text-gray-700 mb-1">Grade Level *</label><select class="input-field" required><option value="9"${ssrIncludeBooleanAttr(Array.isArray(unref(form).gradeLevel) ? ssrLooseContain(unref(form).gradeLevel, "9") : ssrLooseEqual(unref(form).gradeLevel, "9")) ? " selected" : ""}>Grade 9</option><option value="10"${ssrIncludeBooleanAttr(Array.isArray(unref(form).gradeLevel) ? ssrLooseContain(unref(form).gradeLevel, "10") : ssrLooseEqual(unref(form).gradeLevel, "10")) ? " selected" : ""}>Grade 10</option><option value="11"${ssrIncludeBooleanAttr(Array.isArray(unref(form).gradeLevel) ? ssrLooseContain(unref(form).gradeLevel, "11") : ssrLooseEqual(unref(form).gradeLevel, "11")) ? " selected" : ""}>Grade 11</option><option value="12"${ssrIncludeBooleanAttr(Array.isArray(unref(form).gradeLevel) ? ssrLooseContain(unref(form).gradeLevel, "12") : ssrLooseEqual(unref(form).gradeLevel, "12")) ? " selected" : ""}>Grade 12</option></select></div>`);
        if (unref(form).gradeLevel >= 11) {
          _push(`<div><label class="block text-sm font-bold text-gray-700 mb-1">Stream *</label><select class="input-field" required><option value="NATURAL"${ssrIncludeBooleanAttr(Array.isArray(unref(form).stream) ? ssrLooseContain(unref(form).stream, "NATURAL") : ssrLooseEqual(unref(form).stream, "NATURAL")) ? " selected" : ""}>Natural Science</option><option value="SOCIAL"${ssrIncludeBooleanAttr(Array.isArray(unref(form).stream) ? ssrLooseContain(unref(form).stream, "SOCIAL") : ssrLooseEqual(unref(form).stream, "SOCIAL")) ? " selected" : ""}>Social Science</option></select></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(isEditing)) {
          _push(`<div><label class="block text-sm font-bold text-gray-700 mb-1">Section (Assigned)</label><input${ssrRenderAttr("value", unref(form).section)} type="text" class="input-field bg-gray-100" disabled></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div><h4 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Family &amp; Emergency Contact</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-bold text-gray-700 mb-1">Father&#39;s Name</label><input${ssrRenderAttr("value", unref(form).fatherName)} type="text" class="input-field"></div><div><label class="block text-sm font-bold text-gray-700 mb-1">Mother&#39;s Name</label><input${ssrRenderAttr("value", unref(form).motherName)} type="text" class="input-field"></div><div><label class="block text-sm font-bold text-gray-700 mb-1">Guardian Name</label><input${ssrRenderAttr("value", unref(form).guardianName)} type="text" class="input-field"></div><div><label class="block text-sm font-bold text-gray-700 mb-1">Guardian Phone (10 digits)</label><input${ssrRenderAttr("value", unref(form).guardianPhone)} type="tel" pattern="0[0-9]{9}" class="input-field" placeholder="0911000000"></div><div class="md:col-span-2"><label class="block text-sm font-bold text-gray-700 mb-1">Emergency Contact Name</label><input${ssrRenderAttr("value", unref(form).emergencyContact)} type="text" class="input-field"></div></div></div><div class="flex justify-end gap-4 mt-6 pt-4 border-t"><button type="button" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors"> Cancel </button><button type="submit"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="btn-primary flex items-center gap-2">`);
        if (unref(submitting)) {
          _push(`<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(unref(submitting) ? "Saving..." : unref(isEditing) ? "Update Student" : "Register Student")}</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/students/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D3HOhJAU.mjs.map
