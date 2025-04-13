(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.QuillResizeImage = factory());
}(this, (function () { 'use strict';

    function __$styleInject(css) {
        if (!css) return;

        if (typeof window == 'undefined') return;
        var style = document.createElement('style');
        style.setAttribute('media', 'screen');

        style.innerHTML = css;
        document.head.appendChild(style);
        return css;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    __$styleInject("#editor-resizer {\n  position: absolute;\n  border: 1px dashed #fff;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n#editor-resizer .handler {\n  position: absolute;\n  right: -5px;\n  bottom: -5px;\n  width: 10px;\n  height: 10px;\n  border: 1px solid #333;\n  background-color: rgba(255, 255, 255, 0.8);\n  cursor: nwse-resize;\n  user-select: none;\n}\n#toolbar {\n  position: fixed;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  gap: 0.25rem;\n  width: max-content;\n  padding: 4px 8px;\n  border: 1px solid #eee;\n  border-radius: 4px;\n  background-color: #fff;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  z-index: 100;\n}\n#toolbar .group-divider {\n  width: 2px;\n  height: 16px;\n  background-color: #aaa;\n}\n#toolbar .group {\n  display: flex;\n  border-radius: 6px;\n  white-space: nowrap;\n  text-align: center;\n  flex-direction: row ;\n  gap: 0.25rem;\n  color: rgba(0, 0, 0, 0.65);\n}\n#toolbar .group .btn {\n  text-align: center;\n  display: inline-block;\n  vertical-align: top;\n  user-select: none;\n  color: inherit;\n  border-radius: 3px;\n  transition: all 0.2s ease;\n  position: relative;\n  padding: 2px;\n}\n#toolbar .group .btn:hover {\n  background-color: rgba(0, 0, 0, 0.05);\n  transform: translateY(-1px);\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);\n}\n#toolbar .group .btn:not(.btn-group):active,\n#toolbar .group .btn.active {\n  background-color: rgba(0, 0, 0, 0.2);\n  color: #0366d6;\n  transform: translateY(0);\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);\n  border: 1px solid rgba(3, 102, 214, 0.5);\n  padding: 1px;\n}\n#toolbar .group .btn svg {\n  display: inline-block;\n  vertical-align: middle;\n  width: 24px;\n  height: 24px;\n}\n#toolbar .group .input-wrapper {\n  width: 25%;\n  border: 1px solid #eee;\n  position: relative;\n  border-right: 1px solid #bbb;\n  min-width: 4em;\n}\n#toolbar .group .input-wrapper::after {\n  content: \" \";\n  position: absolute;\n  height: 1px;\n  background-color: #333;\n  left: 0.5em;\n  right: 1em;\n  bottom: 0.2em;\n}\n#toolbar .group .input-wrapper input {\n  color: inherit;\n  text-align: center;\n  width: 100%;\n  border: none;\n  outline: none;\n  padding: 0 0.5em;\n  padding-right: 1.5em;\n}\n#toolbar .group .input-wrapper input:focus ~ .tooltip {\n  display: block;\n}\n#toolbar .group .input-wrapper .suffix {\n  position: absolute;\n  right: 0.5em;\n}\n#toolbar .group .input-wrapper .tooltip {\n  display: none;\n  position: absolute;\n  top: 100%;\n  left: 0;\n  font-size: small;\n  background-color: #fff;\n  box-shadow: 0 0 3px #a7a7a7;\n  padding: 0 0.6em;\n  border-radius: 5px;\n  zoom: 0.85;\n}\n/* Modal styles */\n.quill-resize-modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 9999;\n}\n.quill-resize-modal {\n  background-color: #fff;\n  border-radius: 4px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n  width: 400px;\n  max-width: 90%;\n  overflow: hidden;\n}\n.quill-resize-modal .quill-resize-modal-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 15px 20px;\n  border-bottom: 1px solid #eee;\n}\n.quill-resize-modal .quill-resize-modal-header h3 {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 500;\n}\n.quill-resize-modal .quill-resize-modal-header .quill-resize-modal-close {\n  background: none;\n  border: none;\n  font-size: 20px;\n  cursor: pointer;\n  color: #999;\n  padding: 0;\n  margin: 0;\n  line-height: 1;\n}\n.quill-resize-modal .quill-resize-modal-header .quill-resize-modal-close:hover {\n  color: #333;\n}\n.quill-resize-modal .quill-resize-modal-body {\n  padding: 20px;\n  display: flex;\n  flex-direction: column;\n}\n.quill-resize-modal .quill-resize-modal-body p {\n  margin: 0;\n}\n.quill-resize-modal .quill-resize-modal-body .quill-resize-form-group {\n  margin-bottom: 15px;\n  display: flex;\n  flex-direction: column;\n}\n.quill-resize-modal .quill-resize-modal-body .quill-resize-form-group label {\n  display: block;\n  margin-bottom: 5px;\n  font-weight: 500;\n}\n.quill-resize-modal .quill-resize-modal-body .quill-resize-form-group input[type=\"text\"] {\n  padding: 8px 12px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  font-size: 14px;\n}\n.quill-resize-modal .quill-resize-modal-body .quill-resize-form-group input[type=\"text\"]:focus {\n  outline: none;\n  border-color: #0366d6;\n  box-shadow: 0 0 0 2px rgba(3, 102, 214, 0.2);\n}\n.quill-resize-modal .quill-resize-modal-footer {\n  display: flex;\n  justify-content: flex-end;\n  padding: 15px 20px;\n  border-top: 1px solid #eee;\n  background-color: #f8f8f8;\n}\n.quill-resize-modal .quill-resize-modal-footer .quill-resize-btn {\n  padding: 6px 12px;\n  margin-left: 8px;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  font-size: 14px;\n  cursor: pointer;\n}\n.quill-resize-modal .quill-resize-modal-footer .quill-resize-btn.quill-resize-btn-cancel {\n  border-color: #ddd;\n  background-color: #fff;\n  color: #333;\n}\n.quill-resize-modal .quill-resize-modal-footer .quill-resize-btn.quill-resize-btn-cancel:hover {\n  background-color: #f5f5f5;\n}\n.quill-resize-modal .quill-resize-modal-footer .quill-resize-btn.quill-resize-btn-primary {\n  background-color: #0366d6;\n  color: white;\n}\n.quill-resize-modal .quill-resize-modal-footer .quill-resize-btn.quill-resize-btn-primary:hover {\n  background-color: #0255b3;\n}\n.quill-resize-modal .quill-resize-modal-footer .quill-resize-btn.quill-resize-btn-danger {\n  background-color: #d73a49;\n  color: white;\n}\n.quill-resize-modal .quill-resize-modal-footer .quill-resize-btn.quill-resize-btn-danger:hover {\n  background-color: #cb2431;\n}\n");

    var I18n = /** @class */ (function () {
        function I18n(config) {
            this.config = __assign(__assign({}, defaultLocale), config);
        }
        I18n.prototype.findLabel = function (key) {
            if (this.config) {
                return Reflect.get(this.config, key);
            }
            return null;
        };
        return I18n;
    }());
    var defaultLocale = {
        floatLeft: "left",
        floatRight: "right",
        center: "center",
        restore: "restore",
        altTip: "Press and hold alt to lock ratio!",
        inputTip: "Press enter key to apply change!",
    };

    function format(str) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return str.replace(/\{(\d+)\}/g, function (match, index) {
            if (values.length > index) {
                return values[index];
            }
            else {
                return "";
            }
        });
    }

    var ResizeElement = /** @class */ (function (_super) {
        __extends(ResizeElement, _super);
        function ResizeElement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.originSize = null;
            return _this;
        }
        return ResizeElement;
    }(HTMLElement));
    var resizerTemplate = "\n<div class=\"handler\" title=\"{0}\"></div>\n\n";
    var toolbarTemplate = "\n \n <div class=\"group\">\n    <a class=\"btn\" data-type=\"border\" title=\"Add border\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" role=\"presentation\"><path d=\"M8.33333 8C8.15267 8 8 8.14933 8 8.33333V15.6667C8.0007 15.7549 8.03604 15.8392 8.0984 15.9016C8.16076 15.964 8.24514 15.9993 8.33333 16H15.6667C15.8473 16 16 15.8507 16 15.6667V8.33333C16 8.15267 15.8507 8 15.6667 8H8.33333Z\" fill=\"currentColor\"></path><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4 7C4 5.34315 5.34315 4 7 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7ZM7 6C6.44772 6 6 6.44772 6 7V17C6 17.5523 6.44772 18 7 18H17C17.5523 18 18 17.5523 18 17V7C18 6.44772 17.5523 6 17 6H7Z\" fill=\"currentColor\"></path></svg></a>\n    <a class=\"btn border-dropdown-toggle\" data-type=\"border-dropdown\" title=\"Border options\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" role=\"presentation\"><path fill=\"currentcolor\" fill-rule=\"evenodd\" d=\"M8.292 10.293a1.01 1.01 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0\"></path></svg></a>\n    <div class=\"mat-menu border-dropdown-content\" style=\"display: none;\">\n      <div class=\"menu-item-wrapper\">\n        <div class=\"menu-item\" data-submenu=\"color-submenu\">\n          <span>Color</span>\n          <div class=\"current-color-preview\">\n            <div class=\"color-box\" id=\"current-color-preview\"></div>\n          </div>\n          <span class=\"submenu-arrow\">\u203A</span>\n        </div>\n        <div class=\"menu-item\" data-submenu=\"size-submenu\">\n          <span>Size</span>\n          <span class=\"submenu-arrow\">\u203A</span>\n        </div>\n      </div>\n      \n      <!-- Color submenu -->\n      <div class=\"submenu\" id=\"color-submenu\" style=\"display: none;\">\n        <div class=\"color-grid\">\n          <a class=\"color-option\" data-border-color=\"#091E4224\" style=\"background-color: #091E4224;\"></a>\n          <a class=\"color-option\" data-border-color=\"#758195\" style=\"background-color: #758195;\"></a>\n          <a class=\"color-option\" data-border-color=\"#172B4D\" style=\"background-color: #172B4D;\"></a>\n        </div>\n      </div>\n      \n      <!-- Size submenu -->\n      <div class=\"submenu\" id=\"size-submenu\" style=\"display: none;\">\n        <div class=\"size-grid\">\n          <a class=\"size-option\" data-border-width=\"1px\">\n            <div class=\"size-preview\" style=\"height: 1px;\"></div>\n          </a>\n          <a class=\"size-option\" data-border-width=\"2px\">\n            <div class=\"size-preview\" style=\"height: 2px;\"></div>\n          </a>\n          <a class=\"size-option\" data-border-width=\"4px\">\n            <div class=\"size-preview\" style=\"height: 4px;\"></div>\n          </a>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"group-divider\"></div>\n\n  <div class=\"group\">\n    <a class=\"btn\" data-type=\"align\" data-styles=\"float:left\"><svg width=\"24\" height=\"24\" role=\"presentation\"><path fill=\"currentcolor\" fill-rule=\"evenodd\" d=\"M6 17h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m0-8h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m0-4h12a1 1 0 0 1 0 2H6a1 1 0 1 1 0-2\"></path></svg></a>\n    <a class=\"btn\" data-type=\"align\" data-styles=\"display:block;margin:auto;\"><svg width=\"24\" height=\"24\" role=\"presentation\"><path fill=\"currentcolor\" fill-rule=\"evenodd\" d=\"M6 17h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m4-8h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1M6 5h12a1 1 0 0 1 0 2H6a1 1 0 1 1 0-2\"></path></svg></a>\n    <a class=\"btn\" data-type=\"align\" data-styles=\"float:right;\"><svg width=\"24\" height=\"24\" role=\"presentation\"><path fill=\"currentcolor\" fill-rule=\"evenodd\" d=\"M6 17h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m8-8h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1M6 5h12a1 1 0 0 1 0 2H6a1 1 0 1 1 0-2\"></path></svg></a>\n  </div>\n  <div class=\"group-divider\"></div>\n  <div class=\"group\">\n    <a class=\"btn\" data-type=\"wrap\" data-styles=\"float:left;margin:12px 12px 12px 0;\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" role=\"presentation\"><path fill=\"currentcolor\" fill-rule=\"evenodd\" d=\"M6 17h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m8-8h4a1 1 0 0 1 0 2h-4a1 1 0 0 1 0-2m0 4h4a1 1 0 0 1 0 2h-4a1 1 0 0 1 0-2M6 9h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m0-4h12a1 1 0 0 1 0 2H6a1 1 0 1 1 0-2\"></path></svg></a>\n    <a class=\"btn\" data-type=\"wrap\" data-styles=\"float:right;margin:12px 0 12px 12px;\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" role=\"presentation\"><path fill=\"currentcolor\" fill-rule=\"evenodd\" d=\"M6 17h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m0-8h4a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m0 4h4a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m8-4h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1M6 5h12a1 1 0 0 1 0 2H6a1 1 0 1 1 0-2\"></path></svg></a>\n  </div>\n  <div class=\"group-divider\"></div>\n  <div class=\"group\">\n    <a class=\"btn\" data-type=\"copy\" title=\"Copy image\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" role=\"presentation\"><g fill=\"currentcolor\"><path d=\"M10 19h8V8h-8zM8 7.992C8 6.892 8.902 6 10.009 6h7.982C19.101 6 20 6.893 20 7.992v11.016c0 1.1-.902 1.992-2.009 1.992H10.01A2 2 0 0 1 8 19.008z\"></path><path d=\"M5 16V4.992C5 3.892 5.902 3 7.009 3H15v13zm2 0h8V5H7z\"></path></g></svg></a>\n    <a class=\"btn\" data-type=\"link\" title=\"Add link\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" role=\"presentation\"><g fill=\"currentcolor\" fill-rule=\"evenodd\"><path d=\"m12.856 5.457-.937.92a1 1 0 0 0 0 1.437 1.047 1.047 0 0 0 1.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 0 1 .203 3.81l-2.903 2.852a2.646 2.646 0 0 1-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 0 0-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47\"></path><path d=\"m11.144 19.543.937-.92a1 1 0 0 0 0-1.437 1.047 1.047 0 0 0-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 0 1-.203-3.81l2.903-2.852a2.646 2.646 0 0 1 3.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 0 0 .357 6.82c1.893 1.517 4.695 1.226 6.422-.47\"></path></g></svg></a>\n    <a class=\"btn\" data-type=\"delete\" title=\"Delete image\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" role=\"presentation\"><path fill=\"currentcolor\" fill-rule=\"evenodd\" d=\"M7 7h10a1 1 0 0 1 0 2H7a1 1 0 1 1 0-2m2.78 11a1 1 0 0 1-.97-.757L7.156 10.62A.5.5 0 0 1 7.64 10h8.72a.5.5 0 0 1 .485.621l-1.656 6.622a1 1 0 0 1-.97.757zM11 6h2a1 1 0 0 1 1 1h-4a1 1 0 0 1 1-1\"></path></svg></a>\n  </div> \n  \n";
    // Modal templates
    var linkModalTemplate = "\n<div class=\"quill-resize-modal-overlay\">\n  <div class=\"quill-resize-modal\">\n    <div class=\"quill-resize-modal-header\">\n      <h3>Add Link</h3>\n      <button class=\"quill-resize-modal-close\" data-action=\"close\">&times;</button>\n    </div>\n    <div class=\"quill-resize-modal-body\">\n      <div class=\"quill-resize-form-group\">\n        <label for=\"quill-resize-link-url\">URL</label>\n        <input type=\"text\" id=\"quill-resize-link-url\" placeholder=\"https://\" />\n      </div>\n      <div class=\"quill-resize-form-group\">\n        <label>\n          <input type=\"checkbox\" id=\"quill-resize-link-newtab\" checked />\n          Open in new tab\n        </label>\n      </div>\n    </div>\n    <div class=\"quill-resize-modal-footer\">\n      <button class=\"quill-resize-btn quill-resize-btn-cancel\" data-action=\"cancel\">Cancel</button>\n      <button class=\"quill-resize-btn quill-resize-btn-primary\" data-action=\"save\">Add Link</button>\n    </div>\n  </div>\n</div>\n";
    // Border dropdown styles
    var borderDropdownStyles = "\n.mat-menu {\n  position: fixed;\n  background-color: #fff;\n  border-radius: 4px;\n  box-shadow: 0 2px 10px rgba(0,0,0,0.2);\n  z-index: 1000;\n  min-width: 120px;\n  overflow: visible; /* Changed to visible to allow submenus to show */\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n}\n\n.menu-item-wrapper {\n  padding: 8px 0;\n}\n\n.menu-item {\n  display: flex;\n  align-items: center;\n  padding: 8px 16px;\n  cursor: pointer;\n  color: #333;\n  font-size: 14px;\n  position: relative;\n}\n\n.menu-item:hover {\n  background-color: #f5f5f5;\n}\n\n.current-color-preview {\n  margin-left: auto;\n  margin-right: 8px;\n}\n\n.color-box {\n  width: 20px;\n  height: 20px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  background-color: #000000;\n}\n\n.submenu-arrow {\n  // margin-left: auto;\n  text-align: center;\n  justify-content: center;\n  align-items: center;\n\n  font-size: 18px;\n  color: #888;\n}\n\n.submenu {\n  position: absolute;\n  top: 0;\n  right: -200px; /* Position to the right of main menu */\n  background-color: #fff;\n  border-radius: 4px;\n  box-shadow: 0 5px 15px rgba(0,0,0,0.2);\n  padding: 8px;\n  min-width: auto\n  z-index: 1001; /* Higher than parent menu */\n}\n\n.color-grid {\n  display: flex;\n  flex-direction: row;\n  gap: 12px;  \n  margin: 5px 10px;\n}\n\n.color-option {\n  width: 24px;\n  height: 24px;\n  border-radius: 4px;\n  cursor: pointer;\n  border: 1px solid #ddd;\n  transition: transform 0.1s ease;\n}\n\n.color-option:hover {\n  transform: scale(1.1);\n}\n\n.color-option.active {\n  outline: 2px solid #0052cc;\n  outline-offset: 1px;\n}\n\n.size-grid {\n  display: flex;\n  flex-direction: row;\n  gap: 12px; \n  margin: 5px 10px;\n}\n\n.size-option {\nposition: relative;\n  display: flex;\n  align-items: center;\n  width: 24px;\n  height: 24px;\n  cursor: pointer;\n  border-radius: 4px;\n  border: 1px solid #ddd;\n\n}\n\n.size-option:hover {\n  background-color: #f5f5f5;\n}\n\n.size-preview {\n  width: 20px;\n  position: absolute;\n  top: 10px;\n  left: 1px;\n  \n  background-color: #000;\n  margin-right: 12px;\n  transform: rotate(135deg);\n}\n\n.size-option.active {\n  background-color: #e6f7ff;\n}\n";
    var confirmModalTemplate = "\n<div class=\"quill-resize-modal-overlay\">\n  <div class=\"quill-resize-modal\">\n    <div class=\"quill-resize-modal-header\">\n      <h3>Confirm</h3>\n      <button class=\"quill-resize-modal-close\" data-action=\"close\">&times;</button>\n    </div>\n    <div class=\"quill-resize-modal-body\">\n      <p>Are you sure you want to delete this image?</p>\n    </div>\n    <div class=\"quill-resize-modal-footer\">\n      <button class=\"quill-resize-btn quill-resize-btn-cancel\" data-action=\"cancel\">Cancel</button>\n      <button class=\"quill-resize-btn quill-resize-btn-danger\" data-action=\"confirm\">Delete</button>\n    </div>\n  </div>\n</div>\n";
    var ResizePlugin = /** @class */ (function () {
        function ResizePlugin(resizeTarget, container, editor, options) {
            var _this = this;
            this.resizer = null;
            this.toolbar = null;
            this.startResizePosition = null;
            // Handler for document click events to close dropdowns
            this.handleDocumentClick = function (e) {
                if (_this.toolbar) {
                    var dropdown = _this.toolbar.querySelector('.border-dropdown-content');
                    if (dropdown && dropdown.style.display === 'block') {
                        var isClickInside = e.target === dropdown || dropdown.contains(e.target);
                        var isToggleButton = e.target.closest('.border-dropdown-toggle');
                        if (!isClickInside && !isToggleButton) {
                            dropdown.style.display = 'none';
                        }
                    }
                }
            };
            // Handler for window resize events
            this.handleWindowResize = function () {
                // Reposition the toolbar
                _this.positionResizerToTarget(_this.resizeTarget);
                // Close any open dropdowns
                if (_this.toolbar) {
                    var dropdown = _this.toolbar.querySelector('.border-dropdown-content');
                    if (dropdown && dropdown.style.display === 'block') {
                        dropdown.style.display = 'none';
                    }
                }
            };
            // Handler for document scroll events
            this.handleDocumentScroll = function () {
                // Reposition the toolbar and any open dropdowns
                _this.positionResizerToTarget(_this.resizeTarget);
                // Reposition any open dropdown
                if (_this.toolbar) {
                    var dropdown = _this.toolbar.querySelector('.border-dropdown-content');
                    if (dropdown && dropdown.style.display === 'block') {
                        _this.repositionDropdown(dropdown);
                    }
                }
            };
            this.i18n = new I18n((options === null || options === void 0 ? void 0 : options.locale) || defaultLocale);
            this.options = options;
            this.resizeTarget = resizeTarget;
            if (!resizeTarget.originSize) {
                resizeTarget.originSize = {
                    width: resizeTarget.clientWidth,
                    height: resizeTarget.clientHeight,
                };
            }
            this.editor = editor;
            this.container = container;
            this.initResizer();
            this.positionResizerToTarget(resizeTarget);
            this.resizing = this.resizing.bind(this);
            this.endResize = this.endResize.bind(this);
            this.startResize = this.startResize.bind(this);
            this.toolbarClick = this.toolbarClick.bind(this);
            this.toolbarInputChange = this.toolbarInputChange.bind(this);
            this.onScroll = this.onScroll.bind(this);
            this.bindEvents();
            // Restore active button states based on current image styles
            this.restoreActiveButtonStates();
        }
        ResizePlugin.prototype.initResizer = function () {
            // First, clean up any existing resizer or toolbar
            this.cleanupExistingElements();
            // Create resizer
            var resizer = document.createElement("div");
            resizer.setAttribute("id", "editor-resizer");
            resizer.innerHTML = format(resizerTemplate, this.i18n.findLabel("altTip"));
            // Add border dropdown styles
            var styleElement = document.createElement('style');
            styleElement.textContent = borderDropdownStyles;
            resizer.appendChild(styleElement);
            this.container.appendChild(resizer);
            // Create toolbar as a separate element
            var toolbar = document.createElement("div");
            toolbar.setAttribute("id", "toolbar");
            toolbar.setAttribute("data-quill-resize-toolbar", "true");
            toolbar.innerHTML = format(toolbarTemplate, this.i18n.findLabel("altTip"));
            // Important: Make the toolbar part of the resizer in the DOM
            // This will make it pass the resizer?.contains(target) check in main.ts
            resizer.appendChild(toolbar);
            // Position the toolbar manually
            toolbar.style.position = 'fixed';
            toolbar.style.zIndex = '1000';
            // Important: Bind the click handler directly here to ensure it works
            toolbar.addEventListener("click", this.toolbarClick.bind(this));
            this.resizer = resizer;
            this.toolbar = toolbar;
        };
        /**
         * Clean up any existing resizer or toolbar elements
         * to prevent duplicates
         */
        ResizePlugin.prototype.cleanupExistingElements = function () {
            // Remove existing resizer
            var existingResizer = document.getElementById('editor-resizer');
            if (existingResizer && existingResizer.parentNode) {
                existingResizer.parentNode.removeChild(existingResizer);
            }
            // Remove existing toolbar
            var existingToolbar = document.getElementById('toolbar');
            if (existingToolbar && existingToolbar.parentNode) {
                existingToolbar.parentNode.removeChild(existingToolbar);
            }
        };
        ResizePlugin.prototype.positionResizerToTarget = function (el) {
            if (!el || !this.resizer)
                return;
            try {
                // Position the resizer relative to the image
                this.resizer.style.setProperty("left", el.offsetLeft + "px");
                this.resizer.style.setProperty("top", (el.offsetTop - this.editor.scrollTop) + "px");
                this.resizer.style.setProperty("width", el.clientWidth + "px");
                this.resizer.style.setProperty("height", el.clientHeight + "px");
                // Position the toolbar separately since it's now a child of resizer
                if (this.toolbar) {
                    var image = el.getBoundingClientRect();
                    var viewportwidth = window.innerWidth;
                    var viewportheight = window.innerHeight;
                    var toolbarwidth = this.toolbar.clientWidth;
                    var toolbarheight = this.toolbar.clientHeight;
                    // Position the toolbar below the image
                    var left = image.left + image.width / 2 - toolbarwidth / 2;
                    var top = image.bottom + 10; // 10px below the image
                    // Adjust if toolbar would go off-screen
                    if (left < 0) {
                        left = image.left;
                    }
                    if (left + toolbarwidth > viewportwidth) {
                        left = viewportwidth - toolbarwidth;
                    }
                    // Check if toolbar would go off bottom of screen
                    if (top + toolbarheight > viewportheight) {
                        // Position above the image instead if there's room
                        if (image.top > toolbarheight + 10) {
                            top = image.top - toolbarheight - 10;
                        }
                        else {
                            // Otherwise try to find a position that fits
                            top = Math.max(0, viewportheight - toolbarheight - 5);
                        }
                    }
                    // Update toolbar position
                    this.toolbar.style.setProperty("left", left + "px");
                    this.toolbar.style.setProperty("top", top + "px");
                    // Also reposition any open dropdown
                    var dropdown = this.toolbar.querySelector('.border-dropdown-content');
                    if (dropdown && dropdown.style.display === 'block') {
                        this.repositionDropdown(dropdown);
                    }
                }
            }
            catch (error) {
                console.error('Error positioning resizer:', error);
            }
        };
        ResizePlugin.prototype.bindEvents = function () {
            var _this = this;
            var _a, _b;
            if (this.resizer !== null) {
                this.resizer.addEventListener("mousedown", this.startResize);
            }
            if (this.toolbar !== null) {
                // Only add the change event listener here
                this.toolbar.addEventListener("change", this.toolbarInputChange);
                // Add event listeners for menu items with submenus
                var menuItems = this.toolbar.querySelectorAll('.menu-item[data-submenu]');
                menuItems === null || menuItems === void 0 ? void 0 : menuItems.forEach(function (item) {
                    // Handle both click and mouseenter
                    var showSubmenu = function (e) {
                        var _a, _b;
                        // Prevent default behavior for click events
                        if (e.type === 'click') {
                            e.preventDefault();
                        }
                        e.stopPropagation();
                        var submenuId = e.currentTarget.getAttribute('data-submenu');
                        if (submenuId) {
                            // Hide all submenus first
                            var allSubmenus = (_a = _this.toolbar) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.submenu');
                            allSubmenus === null || allSubmenus === void 0 ? void 0 : allSubmenus.forEach(function (submenu) {
                                submenu.style.display = 'none';
                            });
                            // Show the target submenu
                            var targetSubmenu = (_b = _this.toolbar) === null || _b === void 0 ? void 0 : _b.querySelector("#" + submenuId);
                            if (targetSubmenu) {
                                targetSubmenu.style.display = 'block';
                                // Position the submenu properly
                                var menuItemRect = e.currentTarget.getBoundingClientRect();
                                if (submenuId === 'size-submenu') {
                                    // Position size submenu below the color submenu
                                    targetSubmenu.style.top = '45px';
                                }
                                else {
                                    targetSubmenu.style.top = '0px';
                                }
                                // Check if submenu would go off-screen to the right
                                var rightEdge = menuItemRect.right + targetSubmenu.offsetWidth;
                                if (rightEdge > window.innerWidth) {
                                    // Position to the left instead
                                    targetSubmenu.style.right = '101%';
                                    targetSubmenu.style.left = 'auto';
                                }
                                else {
                                    // Position to the right
                                    targetSubmenu.style.left = '101%';
                                    targetSubmenu.style.right = 'auto';
                                }
                            }
                        }
                    };
                    // Add both event listeners
                    item.addEventListener('mouseenter', showSubmenu);
                    item.addEventListener('click', showSubmenu);
                });
                // Add event listeners for size options
                var sizeOptions_1 = (_a = this.toolbar) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.size-option');
                sizeOptions_1 === null || sizeOptions_1 === void 0 ? void 0 : sizeOptions_1.forEach(function (option) {
                    option.addEventListener('click', function (e) {
                        var _a;
                        e.stopPropagation();
                        e.preventDefault();
                        var width = e.currentTarget.getAttribute('data-border-width');
                        if (width) {
                            // Get current color or use default
                            var currentColor = _this.resizeTarget instanceof HTMLElement ?
                                _this.resizeTarget.style.borderColor || '#000000' : '#000000';
                            _this.applyBorder(width, currentColor);
                            // Update active state
                            sizeOptions_1.forEach(function (opt) { return opt.classList.remove('active'); });
                            e.currentTarget.classList.add('active');
                            // Close the dropdown after selection
                            var dropdown = (_a = _this.toolbar) === null || _a === void 0 ? void 0 : _a.querySelector('.border-dropdown-content');
                            if (dropdown)
                                dropdown.style.display = 'none';
                        }
                    });
                });
                // Add event listeners for color options
                var colorOptions_1 = (_b = this.toolbar) === null || _b === void 0 ? void 0 : _b.querySelectorAll('.color-option');
                colorOptions_1 === null || colorOptions_1 === void 0 ? void 0 : colorOptions_1.forEach(function (option) {
                    option.addEventListener('click', function (e) {
                        var _a, _b;
                        e.stopPropagation();
                        e.preventDefault();
                        var color = e.currentTarget.getAttribute('data-border-color');
                        if (color) {
                            // Get current width or use default
                            var currentWidth = _this.resizeTarget instanceof HTMLElement ?
                                _this.resizeTarget.style.borderWidth || '1px' : '1px';
                            _this.applyBorder(currentWidth, color);
                            // Update active state
                            colorOptions_1.forEach(function (opt) { return opt.classList.remove('active'); });
                            e.currentTarget.classList.add('active');
                            // Update current color preview
                            var currentColorPreview = (_a = _this.toolbar) === null || _a === void 0 ? void 0 : _a.querySelector('#current-color-preview');
                            if (currentColorPreview) {
                                currentColorPreview.style.backgroundColor = color;
                            }
                            // Close the dropdown after selection
                            var dropdown = (_b = _this.toolbar) === null || _b === void 0 ? void 0 : _b.querySelector('.border-dropdown-content');
                            if (dropdown)
                                dropdown.style.display = 'none';
                        }
                    });
                });
            }
            window.addEventListener("mouseup", this.endResize);
            window.addEventListener("mousemove", this.resizing);
            this.editor.addEventListener('scroll', this.onScroll);
            // Add event listeners for handling dropdowns and window resize
            document.addEventListener('click', this.handleDocumentClick);
            window.addEventListener('resize', this.handleWindowResize);
            // Add event listener for document scroll
            document.addEventListener('scroll', this.handleDocumentScroll);
            window.addEventListener('scroll', this.handleDocumentScroll);
        };
        ResizePlugin.prototype.onScroll = function () {
            // Update the resizer position
            this.positionResizerToTarget(this.resizeTarget);
            // Also reposition any open dropdown
            if (this.toolbar) {
                var dropdown = this.toolbar.querySelector('.border-dropdown-content');
                if (dropdown && dropdown.style.display === 'block') {
                    this.repositionDropdown(dropdown);
                }
            }
        };
        ResizePlugin.prototype._setStylesForToolbar = function (type, styles) {
            var _a;
            var storeKey = "_styles_" + type;
            var style = this.resizeTarget.style;
            var originStyles = this.resizeTarget[storeKey];
            // Save existing border styles before we modify styles
            var currentBorder = style.border;
            var currentWidth = style.width;
            var currentHeight = style.height;
            // Clear previous styles of the same type only
            if (originStyles) {
                style.cssText = style.cssText.replaceAll(" ", "").replace(originStyles, "");
            }
            // Add new styles
            if (styles) {
                style.cssText += ";" + styles;
            }
            // Preserve border if it exists and we're not explicitly changing it
            if (currentBorder && type !== 'border') {
                style.border = currentBorder;
            }
            // Always preserve dimensions
            if (currentWidth)
                style.width = currentWidth;
            if (currentHeight)
                style.height = currentHeight;
            this.resizeTarget[storeKey] = styles;
            this.positionResizerToTarget(this.resizeTarget);
            (_a = this.options) === null || _a === void 0 ? void 0 : _a.onChange(this.resizeTarget);
        };
        /**
         * Find the Quill editor root element
         */
        ResizePlugin.prototype.findQuillEditor = function () {
            // Try to find the closest Quill editor container
            var element = this.resizeTarget;
            while (element && !element.classList.contains('ql-editor')) {
                element = element.parentElement;
            }
            return element;
        };
        /**
         * Apply wrap-left styling to image in a way that works with Quill
         */
        ResizePlugin.prototype.applyWrapLeft = function () {
            var _this = this;
            console.log("Starting applyWrapLeft");
            // First unwrap if already wrapped
            this.unwrapImage();
            // Get the image element
            var imageElement = this.resizeTarget;
            // Clear any existing styles that might conflict
            this.clearImageStyles(imageElement);
            // Save current styles to preserve
            var currentBorder = imageElement.style.border;
            var currentWidth = imageElement.style.width;
            var currentHeight = imageElement.style.height;
            // Apply the float directly
            imageElement.style.float = 'left';
            imageElement.style.marginRight = '12px';
            imageElement.style.marginBottom = '12px';
            imageElement.style.marginTop = '12px';
            imageElement.style.marginLeft = '0';
            // Store wrap style
            var storeKey = "_styles_wrap";
            this.resizeTarget[storeKey] = 'float:left;margin:12px 12px 12px 0;';
            // Restore preserved styles
            if (currentBorder)
                imageElement.style.border = currentBorder;
            if (currentWidth)
                imageElement.style.width = currentWidth;
            if (currentHeight)
                imageElement.style.height = currentHeight;
            // Fix the parent if needed
            if (imageElement.parentElement) {
                imageElement.parentElement.style.overflow = 'auto';
            }
            // Update the resizer position
            this.positionResizerToTarget(this.resizeTarget);
            // Notify of changes with a small delay to let Quill stabilize
            setTimeout(function () {
                var _a;
                (_a = _this.options) === null || _a === void 0 ? void 0 : _a.onChange(_this.resizeTarget);
                console.log("Final styles after delay:", imageElement.style.cssText);
            }, 50);
        };
        /**
         * Apply wrap-right styling to image in a way that works with Quill
         */
        ResizePlugin.prototype.applyWrapRight = function () {
            var _this = this;
            console.log("Starting applyWrapRight");
            // First unwrap if already wrapped
            this.unwrapImage();
            // Get the image element
            var imageElement = this.resizeTarget;
            // Clear any existing styles that might conflict
            this.clearImageStyles(imageElement);
            // Save current styles to preserve
            var currentBorder = imageElement.style.border;
            var currentWidth = imageElement.style.width;
            var currentHeight = imageElement.style.height;
            // Apply the float directly
            imageElement.style.float = 'right';
            imageElement.style.marginLeft = '12px';
            imageElement.style.marginBottom = '12px';
            imageElement.style.marginTop = '12px';
            imageElement.style.marginRight = '0';
            // Store wrap style
            var storeKey = "_styles_wrap";
            this.resizeTarget[storeKey] = 'float:right;margin:12px 0 12px 12px;';
            // Restore preserved styles
            if (currentBorder)
                imageElement.style.border = currentBorder;
            if (currentWidth)
                imageElement.style.width = currentWidth;
            if (currentHeight)
                imageElement.style.height = currentHeight;
            // Fix the parent if needed
            if (imageElement.parentElement) {
                imageElement.parentElement.style.overflow = 'auto';
            }
            // Update the resizer position
            this.positionResizerToTarget(this.resizeTarget);
            // Notify of changes with a small delay to let Quill stabilize
            setTimeout(function () {
                var _a;
                (_a = _this.options) === null || _a === void 0 ? void 0 : _a.onChange(_this.resizeTarget);
                console.log("Final styles after delay:", imageElement.style.cssText);
            }, 50);
        };
        /**
         * Ensure proper wrapping of an image by any means necessary
         * This is a helper method that can be used by both applyWrapLeft and applyWrapRight
         */
        ResizePlugin.prototype.ensureProperImageWrapping = function (image, direction) {
            console.log("Ensuring proper " + direction + " wrapping");
            // Clear any existing styles first
            this.clearImageStyles(image);
            // Save current styles to preserve
            var currentBorder = image.style.border;
            var currentWidth = image.style.width;
            var currentHeight = image.style.height;
            // Apply the float directly to the image
            image.style.float = direction;
            // Apply margins based on direction
            if (direction === 'left') {
                image.style.marginRight = '12px';
                image.style.marginLeft = '0';
            }
            else { // right
                image.style.marginLeft = '12px';
                image.style.marginRight = '0';
            }
            // Common margins
            image.style.marginTop = '12px';
            image.style.marginBottom = '12px';
            // Store wrap style
            var storeKey = "_styles_wrap";
            image[storeKey] = "float:" + direction + ";margin:" + (direction === 'left' ? '12px 12px 12px 0' : '12px 0 12px 12px') + ";";
            // Fix the parent if needed
            if (image.parentElement) {
                // Don't apply overflow:auto to p tags as requested
                if (image.parentElement.tagName.toLowerCase() !== 'p') {
                    image.parentElement.style.overflow = 'auto';
                }
            }
            // Restore preserved styles
            if (currentBorder)
                image.style.border = currentBorder;
            if (currentWidth)
                image.style.width = currentWidth;
            if (currentHeight)
                image.style.height = currentHeight;
        };
        /**
         * Fix the parent element to properly handle a floating child
         */
        ResizePlugin.prototype.fixParentForFloating = function (element) {
            if (!element.parentElement)
                return;
            var parent = element.parentElement;
            var computedStyle = window.getComputedStyle(parent);
            // Check if parent is a flex container either explicitly or via computed style
            var isFlexContainer = parent.style.display === 'flex' ||
                computedStyle.display === 'flex' ||
                parent.style.flexDirection ||
                computedStyle.flexDirection !== 'none';
            if (isFlexContainer) {
                console.log("Found flex container parent, fixing...");
                // For paragraphs that contain the image directly, just fix the styles
                if (parent.tagName.toLowerCase() === 'p') {
                    // Reset all flex properties
                    parent.style.display = 'block';
                    parent.style.flexDirection = '';
                    parent.style.flexWrap = '';
                    parent.style.alignItems = '';
                    parent.style.justifyContent = '';
                    // Don't add overflow:auto to p tags as requested
                    // This allows text to flow naturally around the image
                    // Force redraw by toggling a harmless property
                    parent.style.zoom = '1';
                    setTimeout(function () { parent.style.zoom = ''; }, 10);
                }
                else {
                    // For other types of containers, we need a more aggressive approach
                    // Try to take image out of difficult containers and re-insert in better context
                    this.reinsertImageInProperContext(element);
                }
            }
            else {
                // Even if it's not a flex container, make sure paragraph can contain floats
                if (parent.tagName.toLowerCase() === 'p') {
                    parent.style.overflow = 'auto';
                }
            }
        };
        /**
         * Last resort - take the image out of problematic containers and reinsert it
         * in a more suitable context for floating
         */
        ResizePlugin.prototype.reinsertImageInProperContext = function (image) {
            var parent = image.parentElement;
            if (!parent || !parent.parentElement)
                return;
            // Remember float and margin
            var floatValue = image.style.float;
            var marginValue = image.style.margin;
            try {
                // Create a new paragraph to contain the image
                var newContainer = document.createElement('p');
                newContainer.style.overflow = 'auto';
                // Insert this new container before the problematic one
                parent.parentElement.insertBefore(newContainer, parent);
                // Move image to the new container
                newContainer.appendChild(image);
                // Reapply float and margin
                image.style.float = floatValue;
                image.style.margin = marginValue;
                console.log("Reinserted image in a proper floating context");
            }
            catch (error) {
                console.error("Failed to reinsert image:", error);
            }
        };
        /**
         * Clear all image styles that could conflict with float/alignment
         */
        ResizePlugin.prototype.clearImageStyles = function (element) {
            element.style.float = '';
            element.style.display = '';
            element.style.margin = '';
            element.style.marginLeft = '';
            element.style.marginRight = '';
            element.style.marginTop = '';
            element.style.marginBottom = '';
            element.style.clear = '';
            // Remove any inline text-align from parent if it exists
            if (element.parentElement) {
                element.parentElement.style.textAlign = '';
            }
        };
        /**
         * Unwrap an image from its container
         */
        ResizePlugin.prototype.unwrapImage = function () {
            console.log("Unwrapping image");
            if (!this.resizeTarget)
                return;
            var imageElement = this.resizeTarget;
            // Save border and dimensions before clearing styles
            var currentBorder = imageElement.style.border;
            var currentWidth = imageElement.style.width;
            var currentHeight = imageElement.style.height;
            // Use the clearImageStyles method to ensure all styles are properly cleared
            this.clearImageStyles(imageElement);
            // Restore border and dimensions
            if (currentBorder)
                imageElement.style.border = currentBorder;
            if (currentWidth)
                imageElement.style.width = currentWidth;
            if (currentHeight)
                imageElement.style.height = currentHeight;
            // Reset any stored wrap and align styles
            delete imageElement['_styles_wrap'];
            delete imageElement['_styles_align'];
        };
        /**
         * No longer needed with our simplified approach
         * Kept as a stub for backward compatibility
         */
        ResizePlugin.prototype.saveTextContentBeforeUnwrap = function () {
            return null;
        };
        /**
         * Apply border to the image with specified width and color
         * @param width Border width (e.g., '1px', '2px')
         * @param color Border color (e.g., '#000000', 'red')
         */
        ResizePlugin.prototype.applyBorder = function (width, color) {
            var _a;
            if (!(this.resizeTarget instanceof HTMLElement))
                return;
            // Apply border style to the image
            this.resizeTarget.style.border = width + " solid " + color;
            // Store border style
            var storeKey = "_styles_border";
            this.resizeTarget[storeKey] = width + " solid " + color;
            // Update active state in dropdown
            if (this.toolbar) {
                // Update width option active state
                var widthOptions = this.toolbar.querySelectorAll('.border-option');
                widthOptions.forEach(function (option) {
                    option.classList.remove('active');
                    if (option.getAttribute('data-border-width') === width) {
                        option.classList.add('active');
                    }
                });
                // Update color option active state
                var colorOptions = this.toolbar.querySelectorAll('.color-option');
                colorOptions.forEach(function (option) {
                    option.classList.remove('active');
                    if (option.getAttribute('data-border-color') === color) {
                        option.classList.add('active');
                    }
                });
            }
            // Notify of changes
            (_a = this.options) === null || _a === void 0 ? void 0 : _a.onChange(this.resizeTarget);
        };
        /**
         * Helper method to position a dropdown properly
         */
        ResizePlugin.prototype.repositionDropdown = function (dropdown) {
            var _this = this;
            if (!this.toolbar)
                return;
            var toggleButton = this.toolbar.querySelector('.border-dropdown-toggle');
            if (toggleButton) {
                var toggleRect = toggleButton.getBoundingClientRect();
                // Calculate optimal position - align with the toggle button
                var top = toggleRect.bottom + 5; // Add a small gap
                var left = toggleRect.left;
                // Apply the calculated position - fixed positioning since toolbar is now inside resizer
                dropdown.style.position = 'fixed';
                dropdown.style.top = top + "px";
                dropdown.style.left = left + "px";
                // Ensure dropdown doesn't go off-screen
                var dropdownRect = dropdown.getBoundingClientRect();
                if (dropdownRect.right > window.innerWidth) {
                    dropdown.style.left = window.innerWidth - dropdownRect.width - 10 + "px";
                }
                if (dropdownRect.bottom > window.innerHeight) {
                    dropdown.style.top = toggleRect.top - dropdownRect.height - 5 + "px";
                }
                // Also reposition any visible submenus
                var visibleSubmenus = dropdown.querySelectorAll('.submenu[style*="display: block"]');
                visibleSubmenus.forEach(function (submenu) {
                    var _a;
                    var submenuEl = submenu;
                    var parentItem = (_a = _this.toolbar) === null || _a === void 0 ? void 0 : _a.querySelector(".menu-item[data-submenu=\"" + submenuEl.id + "\"]");
                    if (parentItem) {
                        var parentRect = parentItem.getBoundingClientRect();
                        var submenuRect = submenuEl.getBoundingClientRect();
                        // Check if submenu would go off-screen to the right
                        var rightEdge = parentRect.right + submenuRect.width;
                        if (rightEdge > window.innerWidth) {
                            // Position to the left instead
                            submenuEl.style.right = '101%';
                            submenuEl.style.left = 'auto';
                        }
                        else {
                            // Position to the right
                            submenuEl.style.left = '101%';
                            submenuEl.style.right = 'auto';
                        }
                        // Check if submenu would go off-screen at the bottom
                        var bottomEdge = parentRect.top + submenuRect.height;
                        if (bottomEdge > window.innerHeight) {
                            submenuEl.style.top = window.innerHeight - bottomEdge - 10 + "px";
                        }
                    }
                });
            }
        };
        /**
         * Toggle the border dropdown visibility
         */
        ResizePlugin.prototype.toggleBorderDropdown = function () {
            if (!this.toolbar)
                return;
            var dropdown = this.toolbar.querySelector('.border-dropdown-content');
            if (!dropdown)
                return;
            // Toggle dropdown visibility
            if (dropdown.style.display === 'none' || !dropdown.style.display) {
                // Hide any open submenus first
                var submenus = dropdown.querySelectorAll('.submenu');
                submenus.forEach(function (submenu) {
                    submenu.style.display = 'none';
                });
                // Show the main menu
                dropdown.style.display = 'block';
                // Position the dropdown using our helper method
                this.repositionDropdown(dropdown);
                // Set a fixed width to match the reference design
                dropdown.style.width = '200px';
                // Update current color preview
                if (this.resizeTarget instanceof HTMLElement) {
                    var currentColorPreview = dropdown.querySelector('#current-color-preview');
                    if (currentColorPreview) {
                        currentColorPreview.style.backgroundColor = this.resizeTarget.style.borderColor || '#000000';
                    }
                }
                // Set initial active states based on current border
                var currentWidth_1 = this.resizeTarget instanceof HTMLElement ?
                    this.resizeTarget.style.borderWidth || '1px' : '1px';
                var currentColor_1 = this.resizeTarget instanceof HTMLElement ?
                    this.resizeTarget.style.borderColor || '#000000' : '#000000';
                // Update width option active state
                var widthOptions = dropdown.querySelectorAll('.size-option');
                widthOptions.forEach(function (option) {
                    option.classList.remove('active');
                    if (option.getAttribute('data-border-width') === currentWidth_1) {
                        option.classList.add('active');
                    }
                });
                // Update color option active state
                var colorOptions = dropdown.querySelectorAll('.color-option');
                colorOptions.forEach(function (option) {
                    option.classList.remove('active');
                    if (option.getAttribute('data-border-color') === currentColor_1) {
                        option.classList.add('active');
                    }
                });
            }
            else {
                dropdown.style.display = 'none';
            }
        };
        /**
         * Restore active states of buttons based on current image styles
         * Called when an image is selected to maintain UI state
         */
        ResizePlugin.prototype.restoreActiveButtonStates = function () {
            if (!this.toolbar)
                return;
            var imageElement = this.resizeTarget;
            var style = imageElement.style;
            // First reset all active states
            this.updateActiveButtonState(null, 'align');
            this.updateActiveButtonState(null, 'wrap');
            // Check for wrapping styles
            if (style.float === 'left') {
                // Find and activate the wrap-left button
                var wrapLeftBtn = this.toolbar.querySelector('.btn[data-type="wrap"][data-styles*="float:left"]');
                if (wrapLeftBtn) {
                    this.updateActiveButtonState(wrapLeftBtn, 'wrap');
                }
            }
            else if (style.float === 'right') {
                // Find and activate the wrap-right button
                var wrapRightBtn = this.toolbar.querySelector('.btn[data-type="wrap"][data-styles*="float:right"]');
                if (wrapRightBtn) {
                    this.updateActiveButtonState(wrapRightBtn, 'wrap');
                }
            }
            else {
                // Check for alignment styles (only if not wrapped)
                var displayBlock = style.display === 'block';
                if (displayBlock && style.marginLeft === 'auto' && style.marginRight === 'auto') {
                    // Center alignment
                    var centerBtn = this.toolbar.querySelector('.btn[data-type="align"][data-styles*="margin:auto"]');
                    if (centerBtn) {
                        this.updateActiveButtonState(centerBtn, 'align');
                    }
                }
                else if (displayBlock && style.marginLeft === 'auto') {
                    // Right alignment
                    var rightBtn = this.toolbar.querySelector('.btn[data-type="align"][data-styles*="margin-left:auto"]');
                    if (rightBtn) {
                        this.updateActiveButtonState(rightBtn, 'align');
                    }
                }
                else if (displayBlock && style.marginRight === 'auto') {
                    // Left alignment
                    var leftBtn = this.toolbar.querySelector('.btn[data-type="align"][data-styles*="margin-right:auto"]');
                    if (leftBtn) {
                        this.updateActiveButtonState(leftBtn, 'align');
                    }
                }
            }
        };
        ResizePlugin.prototype.toolbarInputChange = function (e) {
            var _a;
            var target = e.target;
            var type = (_a = target === null || target === void 0 ? void 0 : target.dataset) === null || _a === void 0 ? void 0 : _a.type;
            var value = target.value;
            if (type && Number(value)) {
                this._setStylesForToolbar(type, "width: " + Number(value) + "%;");
            }
        };
        /**
         * Update active state of buttons in a button group
         * @param activeBtn The active button or null to clear all active states
         * @param type The button type group
         */
        ResizePlugin.prototype.updateActiveButtonState = function (activeBtn, type) {
            // Find all buttons of the same type
            if (this.toolbar) {
                var allButtons = this.toolbar.querySelectorAll(".btn[data-type='" + type + "']");
                allButtons.forEach(function (btn) { return btn.classList.remove('active'); });
                // Add active class to the clicked button (if provided)
                if (activeBtn) {
                    activeBtn.classList.add('active');
                }
            }
        };
        ResizePlugin.prototype.toolbarClick = function (e) {
            console.log("toolbarClick");
            e.stopPropagation(); // Prevent event from bubbling up to document
            e.preventDefault(); // Also prevent default behavior
            var target = e.target;
            // Find the closest button if clicked on an SVG or path
            var btn = target.closest('.btn');
            if (!btn) {
                console.log("No button found");
                return;
            }
            var type = btn.getAttribute('data-type');
            console.log("Button type:", type);
            if (!type)
                return;
            if (type === 'align' || type === 'wrap') {
                console.log("Handling align/wrap");
                // Update the active state of buttons in the same group
                this.updateActiveButtonState(btn, type);
                // Get the requested styles
                var styles = btn.getAttribute('data-styles') || '';
                console.log("Styles to apply:", styles);
                // If this is an alignment button, remove any wrapping
                if (type === 'align') {
                    console.log("Applying alignment");
                    // Apply alignment using our specialized function
                    this.applyAlignment(styles);
                    // Reset the active state of wrap buttons
                    this.updateActiveButtonState(null, 'wrap');
                }
                // If this is a wrap button, handle wrapping specially
                else if (type === 'wrap') {
                    console.log("Applying wrap");
                    // Get the styles from the button and parse them
                    var styles_1 = btn.getAttribute('data-styles') || '';
                    console.log("Requested wrap styles:", styles_1);
                    // We need to implement wrapping in a way that allows text to be entered
                    if (styles_1.includes('float:left')) {
                        console.log("Detected left wrap request");
                        this.applyWrapLeft();
                    }
                    else if (styles_1.includes('float:right')) {
                        console.log("Detected right wrap request");
                        this.applyWrapRight();
                    }
                    // Update button state
                    this.updateActiveButtonState(btn, type);
                    // Remove any alignment styles and reset align buttons
                    this.updateActiveButtonState(null, 'align');
                }
            }
            else if (type === 'copy') {
                this.copyImage();
            }
            else if (type === 'link') {
                this.addLink();
            }
            else if (type === 'delete') {
                this.deleteImage();
            }
            else if (type === 'border') {
                console.log("Applying border");
                // Apply default border (1px solid black)
                this.applyBorder('1px', '#000000');
            }
            else if (type === 'border-dropdown') {
                // Toggle the border dropdown
                this.toggleBorderDropdown();
            }
        };
        ResizePlugin.prototype.startResize = function (e) {
            var target = e.target;
            if (target.classList.contains("handler") && e.which === 1) {
                this.startResizePosition = {
                    left: e.clientX,
                    top: e.clientY,
                    width: this.resizeTarget.clientWidth,
                    height: this.resizeTarget.clientHeight,
                };
            }
        };
        ResizePlugin.prototype.endResize = function () {
            var _a;
            this.startResizePosition = null;
            (_a = this.options) === null || _a === void 0 ? void 0 : _a.onChange(this.resizeTarget);
        };
        ResizePlugin.prototype.resizing = function (e) {
            if (!this.startResizePosition)
                return;
            var deltaX = e.clientX - this.startResizePosition.left;
            var deltaY = e.clientY - this.startResizePosition.top;
            var width = this.startResizePosition.width;
            var height = this.startResizePosition.height;
            width += deltaX;
            height += deltaY;
            if (e.altKey) {
                var originSize = this.resizeTarget.originSize;
                var rate = originSize.height / originSize.width;
                height = rate * width;
            }
            this.resizeTarget.style.setProperty("width", Math.max(width, 30) + "px");
            this.resizeTarget.style.setProperty("height", Math.max(height, 30) + "px");
            this.positionResizerToTarget(this.resizeTarget);
        };
        /**
         * Copy the image to clipboard
         */
        ResizePlugin.prototype.copyImage = function () {
            // Get image as HTMLImageElement
            if (this.resizeTarget instanceof HTMLImageElement) {
                // Create a canvas element
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                if (!ctx)
                    return;
                // Set canvas dimensions to match the image
                canvas.width = this.resizeTarget.naturalWidth;
                canvas.height = this.resizeTarget.naturalHeight;
                // Draw the image onto the canvas
                ctx.drawImage(this.resizeTarget, 0, 0);
                // Convert canvas to blob and copy to clipboard
                canvas.toBlob(function (blob) {
                    if (!blob)
                        return;
                    try {
                        // Modern browsers support clipboard API
                        if (navigator.clipboard && navigator.clipboard.write) {
                            var item = new ClipboardItem({ 'image/png': blob });
                            navigator.clipboard.write([item]);
                        }
                    }
                    catch (err) {
                        console.error('Failed to copy image: ', err);
                    }
                }, 'image/png');
            }
        };
        /**
         * Create a modal element
         * @param template Modal template
         * @returns Modal element
         */
        ResizePlugin.prototype.createModal = function (template) {
            var div = document.createElement('div');
            div.innerHTML = template.trim();
            return div.firstChild;
        };
        /**
         * Open a dialog to add a link to the image
         */
        ResizePlugin.prototype.addLink = function () {
            var _this = this;
            if (!(this.resizeTarget instanceof HTMLImageElement))
                return;
            // Check if image is already wrapped in an anchor tag
            var parentAnchor = this.resizeTarget.closest('a');
            var currentUrl = parentAnchor ? parentAnchor.getAttribute('href') : '';
            var currentTarget = parentAnchor ? parentAnchor.getAttribute('target') : '_blank';
            // Create modal
            var modal = this.createModal(linkModalTemplate);
            document.body.appendChild(modal);
            // Set current URL if exists
            var urlInput = modal.querySelector('#quill-resize-link-url');
            if (urlInput) {
                urlInput.value = currentUrl || 'https://';
                setTimeout(function () { return urlInput.focus(); }, 100);
            }
            // Set current target
            var newTabCheckbox = modal.querySelector('#quill-resize-link-newtab');
            if (newTabCheckbox) {
                newTabCheckbox.checked = currentTarget === '_blank';
            }
            // Handle events
            var handleModalAction = function (e) {
                var target = e.target;
                var action = target.getAttribute('data-action');
                if (action === 'save') {
                    var url = urlInput ? urlInput.value.trim() : '';
                    var openInNewTab = newTabCheckbox ? newTabCheckbox.checked : true;
                    if (url) {
                        if (parentAnchor) {
                            // Update existing link
                            parentAnchor.setAttribute('href', url);
                            parentAnchor.setAttribute('target', openInNewTab ? '_blank' : '_self');
                        }
                        else {
                            // Create new link
                            var anchor = document.createElement('a');
                            anchor.setAttribute('href', url);
                            anchor.setAttribute('target', openInNewTab ? '_blank' : '_self');
                            // Replace the image with the linked image
                            var parent = _this.resizeTarget.parentNode;
                            if (parent) {
                                parent.insertBefore(anchor, _this.resizeTarget);
                                anchor.appendChild(_this.resizeTarget);
                                // We need to recreate the resizer for the linked image
                                _this.destroy();
                                // Emit onChange event with a slight delay to let Quill stabilize
                                setTimeout(function () {
                                    var _a;
                                    (_a = _this.options) === null || _a === void 0 ? void 0 : _a.onChange(_this.resizeTarget);
                                }, 0);
                            }
                        }
                    }
                    // Close modal
                    document.body.removeChild(modal);
                    document.removeEventListener('click', handleClickOutside);
                }
                else if (action === 'close' || action === 'cancel') {
                    // Close modal
                    document.body.removeChild(modal);
                    document.removeEventListener('click', handleClickOutside);
                }
            };
            // Close when clicking outside
            var handleClickOutside = function (e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    document.removeEventListener('click', handleClickOutside);
                }
            };
            // Attach event listeners
            modal.addEventListener('click', handleClickOutside);
            modal.querySelectorAll('[data-action]').forEach(function (el) {
                el.addEventListener('click', handleModalAction);
            });
        };
        /**
         * Delete the image using a custom confirmation modal
         */
        ResizePlugin.prototype.deleteImage = function () {
            var _this = this;
            // Create modal
            var modal = this.createModal(confirmModalTemplate);
            document.body.appendChild(modal);
            // Handle events
            var handleModalAction = function (e) {
                var _a;
                var target = e.target;
                var action = target.getAttribute('data-action');
                if (action === 'confirm') {
                    // Remove the image from the DOM
                    var parent = _this.resizeTarget.parentNode;
                    if (parent) {
                        parent.removeChild(_this.resizeTarget);
                        _this.destroy();
                        // Emit onChange event
                        (_a = _this.options) === null || _a === void 0 ? void 0 : _a.onChange(null);
                    }
                    // Close modal
                    document.body.removeChild(modal);
                    document.removeEventListener('click', handleClickOutside);
                }
                else if (action === 'close' || action === 'cancel') {
                    // Close modal
                    document.body.removeChild(modal);
                    document.removeEventListener('click', handleClickOutside);
                }
            };
            // Close when clicking outside
            var handleClickOutside = function (e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    document.removeEventListener('click', handleClickOutside);
                }
            };
            // Attach event listeners
            modal.addEventListener('click', handleModalAction);
            modal.querySelectorAll('[data-action]').forEach(function (el) {
                el.addEventListener('click', handleModalAction);
            });
        };
        /**
         * Clean up resources and remove event listeners
         */
        ResizePlugin.prototype.destroy = function () {
            try {
                // Only attempt to remove the resizer if it exists and is a child of the container
                if (this.resizer && this.resizer.parentNode) {
                    this.resizer.parentNode.removeChild(this.resizer);
                }
                // Also remove the toolbar if it exists (now in document.body)
                if (this.toolbar && this.toolbar.parentNode) {
                    console.log("toolbar destroy");
                    // No need to explicitly remove event listeners when removing the element
                    // as they will be garbage collected
                    this.toolbar.parentNode.removeChild(this.toolbar);
                }
                // Always remove event listeners
                window.removeEventListener("mouseup", this.endResize);
                window.removeEventListener("mousemove", this.resizing);
                this.editor.removeEventListener('scroll', this.onScroll);
                // Remove document click listener for dropdown
                document.removeEventListener('click', this.handleDocumentClick);
                // Remove window resize listener
                window.removeEventListener('resize', this.handleWindowResize);
                // Remove document and window scroll listeners
                document.removeEventListener('scroll', this.handleDocumentScroll);
                window.removeEventListener('scroll', this.handleDocumentScroll);
                // Clean up references
                this.resizer = null;
                this.toolbar = null;
            }
            catch (error) {
                console.error('Error during cleanup:', error);
            }
        };
        /**
         * Legacy method with typo - kept for backward compatibility
         * @deprecated Use destroy() instead
         */
        ResizePlugin.prototype.destory = function () {
            return this.destroy();
        };
        /**
         * Apply alignment based on button data
         */
        ResizePlugin.prototype.applyAlignment = function (styles) {
            var _a;
            // First unwrap image completely
            this.unwrapImage();
            // Get the image element
            var imageElement = this.resizeTarget;
            // Clear any existing styles that might conflict
            this.clearImageStyles(imageElement);
            // Store current styles to preserve
            var currentBorder = imageElement.style.border;
            var currentWidth = imageElement.style.width;
            var currentHeight = imageElement.style.height;
            // Check what type of alignment we're applying
            if (styles.includes('margin:auto')) {
                // Center alignment
                console.log("Applying center alignment");
                imageElement.style.display = 'block';
                imageElement.style.marginLeft = 'auto';
                imageElement.style.marginRight = 'auto';
                imageElement.style.marginTop = '12px';
                imageElement.style.marginBottom = '12px';
                imageElement.style.float = 'none';
            }
            else if (styles.includes('float:left')) {
                // Left alignment
                console.log("Applying left alignment");
                imageElement.style.display = 'block';
                imageElement.style.float = 'none'; // Don't use float for alignment
                imageElement.style.marginLeft = '0';
                imageElement.style.marginRight = 'auto';
                imageElement.style.marginTop = '12px';
                imageElement.style.marginBottom = '12px';
            }
            else if (styles.includes('float:right')) {
                // Right alignment
                console.log("Applying right alignment");
                imageElement.style.display = 'block';
                imageElement.style.float = 'none'; // Don't use float for alignment
                imageElement.style.marginLeft = 'auto';
                imageElement.style.marginRight = '0';
                imageElement.style.marginTop = '12px';
                imageElement.style.marginBottom = '12px';
            }
            // Restore preserved styles
            if (currentBorder)
                imageElement.style.border = currentBorder;
            if (currentWidth)
                imageElement.style.width = currentWidth;
            if (currentHeight)
                imageElement.style.height = currentHeight;
            // Store styles for future reference
            var storeKey = "_styles_align";
            this.resizeTarget[storeKey] = styles;
            // Fix the parent if needed
            if (imageElement.parentElement) {
                // For alignment, we want to make sure the parent doesn't have overflow:auto
                // which could interfere with alignment
                imageElement.parentElement.style.overflow = '';
            }
            // Update the resizer position
            this.positionResizerToTarget(this.resizeTarget);
            // Notify of changes
            (_a = this.options) === null || _a === void 0 ? void 0 : _a.onChange(this.resizeTarget);
            console.log("After alignment:", imageElement.style.cssText);
        };
        return ResizePlugin;
    }());

    var Iframe = /** @class */ (function () {
        function Iframe(element, cb) {
            this.element = element;
            this.cb = cb;
            this.hasTracked = false;
        }
        return Iframe;
    }());
    var IframeClick = /** @class */ (function () {
        function IframeClick() {
        }
        IframeClick.track = function (element, cb) {
            this.iframes.push(new Iframe(element, cb));
            if (!this.interval) {
                this.interval = setInterval(function () {
                    IframeClick.checkClick();
                }, this.resolution);
            }
        };
        IframeClick.checkClick = function () {
            if (document.activeElement) {
                var activeElement = document.activeElement;
                for (var i in this.iframes) {
                    if (activeElement === this.iframes[i].element) {
                        if (this.iframes[i].hasTracked == false) {
                            this.iframes[i].cb.apply(window, []);
                            this.iframes[i].hasTracked = true;
                        }
                    }
                    else {
                        this.iframes[i].hasTracked = false;
                    }
                }
            }
        };
        IframeClick.resolution = 200;
        IframeClick.iframes = [];
        IframeClick.interval = null;
        return IframeClick;
    }());

    function QuillResizeImage(quill, options) {
        var container = quill.root;
        var resizeTarge;
        var resizePlugin;
        function triggerTextChange() {
            var Delta = quill.getContents().constructor;
            var delta = new Delta().retain(1);
            quill.updateContents(delta);
        }
        container.addEventListener("click", function (e) {
            var target = e.target;
            if (e.target && ["img", "video"].includes(target.tagName.toLowerCase())) {
                resizeTarge = target;
                resizePlugin = new ResizePlugin(target, container.parentElement, container, __assign(__assign({}, options), { onChange: triggerTextChange }));
            }
        });
        quill.on("text-change", function (delta, source) {
            // iframe 大小调整
            container.querySelectorAll("iframe").forEach(function (item) {
                IframeClick.track(item, function () {
                    resizeTarge = item;
                    resizePlugin = new ResizePlugin(item, container.parentElement, container, __assign(__assign({}, options), { onChange: triggerTextChange }));
                });
            });
        });
        document.addEventListener("mousedown", function (e) {
            var _a, _b, _c;
            var target = e.target;
            if (target !== resizeTarge &&
                !((_b = (_a = resizePlugin === null || resizePlugin === void 0 ? void 0 : resizePlugin.resizer) === null || _a === void 0 ? void 0 : _a.contains) === null || _b === void 0 ? void 0 : _b.call(_a, target))) {
                (_c = resizePlugin === null || resizePlugin === void 0 ? void 0 : resizePlugin.destory) === null || _c === void 0 ? void 0 : _c.call(resizePlugin);
                resizePlugin = null;
                resizeTarge = null;
            }
        }, { capture: true });
    }

    return QuillResizeImage;

})));
