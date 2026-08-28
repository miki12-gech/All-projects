import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const rememberMe = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");
    const isLoading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center p-4 relative overflow-hidden" }, _attrs))} data-v-b1cd9a82><div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600" data-v-b1cd9a82><div class="absolute inset-0 opacity-30" data-v-b1cd9a82><div class="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" data-v-b1cd9a82></div><div class="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" data-v-b1cd9a82></div><div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" data-v-b1cd9a82></div></div></div><div class="glass-card max-w-md w-full relative z-10 fade-in-up" data-v-b1cd9a82><div class="text-center p-8 pb-4" data-v-b1cd9a82><div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl transform hover:rotate-12 transition-transform duration-300" data-v-b1cd9a82><svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-b1cd9a82><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-v-b1cd9a82></path></svg></div><h1 class="text-3xl font-bold text-gray-800 mb-2" data-v-b1cd9a82>\u12A0\u130B\u12DA \u1218\u1230\u1293\u12F6</h1><p class="text-gray-600 font-medium" data-v-b1cd9a82>School Management System</p></div><form class="p-8 pt-4 space-y-6" data-v-b1cd9a82>`);
      if (unref(errorMessage)) {
        _push(`<div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-pulse" data-v-b1cd9a82><div class="flex items-center" data-v-b1cd9a82><svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" data-v-b1cd9a82><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" data-v-b1cd9a82></path></svg><p class="text-red-700 text-sm font-semibold" data-v-b1cd9a82>${ssrInterpolate(unref(errorMessage))}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(successMessage)) {
        _push(`<div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-pulse" data-v-b1cd9a82><div class="flex items-center" data-v-b1cd9a82><svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" data-v-b1cd9a82><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-b1cd9a82></path></svg><p class="text-green-700 text-sm font-semibold" data-v-b1cd9a82>${ssrInterpolate(unref(successMessage))}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-2" data-v-b1cd9a82><label class="block text-sm font-bold text-gray-700 flex items-center gap-2" data-v-b1cd9a82><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" data-v-b1cd9a82><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" data-v-b1cd9a82></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" data-v-b1cd9a82></path></svg> Email Address </label><input${ssrRenderAttr("value", unref(email))} type="email" required placeholder="example@agazi.edu.et" class="input-field" data-v-b1cd9a82></div><div class="space-y-2" data-v-b1cd9a82><label class="block text-sm font-bold text-gray-700 flex items-center gap-2" data-v-b1cd9a82><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" data-v-b1cd9a82><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" data-v-b1cd9a82></path></svg> Password </label><div class="relative" data-v-b1cd9a82><input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(password), null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} required placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" class="input-field pr-12" data-v-b1cd9a82><button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors" data-v-b1cd9a82>`);
      if (!unref(showPassword)) {
        _push(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-b1cd9a82><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-b1cd9a82></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" data-v-b1cd9a82></path></svg>`);
      } else {
        _push(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-b1cd9a82><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" data-v-b1cd9a82></path></svg>`);
      }
      _push(`</button></div></div><div class="flex items-center justify-between" data-v-b1cd9a82><label class="flex items-center gap-2 cursor-pointer" data-v-b1cd9a82><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(rememberMe)) ? ssrLooseContain(unref(rememberMe), null) : unref(rememberMe)) ? " checked" : ""} class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" data-v-b1cd9a82><span class="text-sm text-gray-700" data-v-b1cd9a82>Remember me</span></label><a href="#" class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors" data-v-b1cd9a82> Forgot Password? </a></div><button${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} type="submit" class="w-full btn-primary flex items-center justify-center gap-2 group" data-v-b1cd9a82>`);
      if (unref(isLoading)) {
        _push(`<span class="flex items-center gap-2" data-v-b1cd9a82><svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" data-v-b1cd9a82><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" data-v-b1cd9a82></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-b1cd9a82></path></svg> Signing in... </span>`);
      } else {
        _push(`<span class="flex items-center gap-2" data-v-b1cd9a82> Sign In <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-b1cd9a82><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" data-v-b1cd9a82></path></svg></span>`);
      }
      _push(`</button></form><div class="p-6 bg-gray-50/50 text-center border-t border-gray-100" data-v-b1cd9a82><p class="text-xs text-gray-600" data-v-b1cd9a82> \xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Agazi Preparatory School. All rights reserved. </p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b1cd9a82"]]);

export { login as default };
//# sourceMappingURL=login-Da-OpPKC.mjs.map
