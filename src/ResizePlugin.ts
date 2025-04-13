import "./ResizePlugin.less";
import { I18n, Locale, defaultLocale } from "./i18n";
import { format } from "./utils";

interface Size {
  width: number;
  height: number;
}
interface Position {
  left: number;
  top: number;
  width: number;
  height: number;
}
class ResizeElement extends HTMLElement {
  public originSize?: Size | null = null;
  [key: string]: any;
}

interface ResizePluginOption {
  locale?: Locale;
  [index: string]: any;
}
const resizerTemplate = `
<div class="handler" title="{0}"></div>

`;

const toolbarTemplate = `
 
 <div class="group">
    <a class="btn" data-type="border" title="Add border"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation"><path d="M8.33333 8C8.15267 8 8 8.14933 8 8.33333V15.6667C8.0007 15.7549 8.03604 15.8392 8.0984 15.9016C8.16076 15.964 8.24514 15.9993 8.33333 16H15.6667C15.8473 16 16 15.8507 16 15.6667V8.33333C16 8.15267 15.8507 8 15.6667 8H8.33333Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4 7C4 5.34315 5.34315 4 7 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7ZM7 6C6.44772 6 6 6.44772 6 7V17C6 17.5523 6.44772 18 7 18H17C17.5523 18 18 17.5523 18 17V7C18 6.44772 17.5523 6 17 6H7Z" fill="currentColor"></path></svg></a>
    <a class="btn border-dropdown-toggle" data-type="border-dropdown" title="Border options"><svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M8.292 10.293a1.01 1.01 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0"></path></svg></a>
    <div class="mat-menu border-dropdown-content" style="display: none;">
      <div class="menu-item-wrapper">
        <div class="menu-item" data-submenu="color-submenu">
          <span>Color</span>
          <div class="current-color-preview">
            <div class="color-box" id="current-color-preview"></div>
          </div>
          <span class="submenu-arrow">›</span>
        </div>
        <div class="menu-item" data-submenu="size-submenu">
          <span>Size</span>
          <span class="submenu-arrow">›</span>
        </div>
      </div>
      
      <!-- Color submenu -->
      <div class="submenu" id="color-submenu" style="display: none;">
        <div class="color-grid">
          <a class="color-option" data-border-color="#091E4224" style="background-color: #091E4224;"></a>
          <a class="color-option" data-border-color="#758195" style="background-color: #758195;"></a>
          <a class="color-option" data-border-color="#172B4D" style="background-color: #172B4D;"></a>
        </div>
      </div>
      
      <!-- Size submenu -->
      <div class="submenu" id="size-submenu" style="display: none;">
        <div class="size-grid">
          <a class="size-option" data-border-width="1px">
            <div class="size-preview" style="height: 1px;"></div>
          </a>
          <a class="size-option" data-border-width="2px">
            <div class="size-preview" style="height: 2px;"></div>
          </a>
          <a class="size-option" data-border-width="4px">
            <div class="size-preview" style="height: 4px;"></div>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="group-divider"></div>

  <div class="group">
    <a class="btn" data-type="align" data-styles="float:left"><svg width="24" height="24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M6 17h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m0-8h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m0-4h12a1 1 0 0 1 0 2H6a1 1 0 1 1 0-2"></path></svg></a>
    <a class="btn" data-type="align" data-styles="display:block;margin:auto;"><svg width="24" height="24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M6 17h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m4-8h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1M6 5h12a1 1 0 0 1 0 2H6a1 1 0 1 1 0-2"></path></svg></a>
    <a class="btn" data-type="align" data-styles="float:right;"><svg width="24" height="24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M6 17h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m8-8h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1M6 5h12a1 1 0 0 1 0 2H6a1 1 0 1 1 0-2"></path></svg></a>
  </div>
  <div class="group-divider"></div>
  <div class="group">
    <a class="btn" data-type="wrap" data-styles="float:left;margin:12px 12px 12px 0;"><svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M6 17h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m8-8h4a1 1 0 0 1 0 2h-4a1 1 0 0 1 0-2m0 4h4a1 1 0 0 1 0 2h-4a1 1 0 0 1 0-2M6 9h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m0-4h12a1 1 0 0 1 0 2H6a1 1 0 1 1 0-2"></path></svg></a>
    <a class="btn" data-type="wrap" data-styles="float:right;margin:12px 0 12px 12px;"><svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M6 17h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m0-8h4a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m0 4h4a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2m8-4h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1M6 5h12a1 1 0 0 1 0 2H6a1 1 0 1 1 0-2"></path></svg></a>
  </div>
  <div class="group-divider"></div>
  <div class="group">
    <a class="btn" data-type="copy" title="Copy image"><svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor"><path d="M10 19h8V8h-8zM8 7.992C8 6.892 8.902 6 10.009 6h7.982C19.101 6 20 6.893 20 7.992v11.016c0 1.1-.902 1.992-2.009 1.992H10.01A2 2 0 0 1 8 19.008z"></path><path d="M5 16V4.992C5 3.892 5.902 3 7.009 3H15v13zm2 0h8V5H7z"></path></g></svg></a>
    <a class="btn" data-type="link" title="Add link"><svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor" fill-rule="evenodd"><path d="m12.856 5.457-.937.92a1 1 0 0 0 0 1.437 1.047 1.047 0 0 0 1.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 0 1 .203 3.81l-2.903 2.852a2.646 2.646 0 0 1-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 0 0-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47"></path><path d="m11.144 19.543.937-.92a1 1 0 0 0 0-1.437 1.047 1.047 0 0 0-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 0 1-.203-3.81l2.903-2.852a2.646 2.646 0 0 1 3.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 0 0 .357 6.82c1.893 1.517 4.695 1.226 6.422-.47"></path></g></svg></a>
    <a class="btn" data-type="delete" title="Delete image"><svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M7 7h10a1 1 0 0 1 0 2H7a1 1 0 1 1 0-2m2.78 11a1 1 0 0 1-.97-.757L7.156 10.62A.5.5 0 0 1 7.64 10h8.72a.5.5 0 0 1 .485.621l-1.656 6.622a1 1 0 0 1-.97.757zM11 6h2a1 1 0 0 1 1 1h-4a1 1 0 0 1 1-1"></path></svg></a>
  </div> 
  
`;

// Modal templates
const linkModalTemplate = `
<div class="quill-resize-modal-overlay">
  <div class="quill-resize-modal">
    <div class="quill-resize-modal-header">
      <h3>Add Link</h3>
      <button class="quill-resize-modal-close" data-action="close">&times;</button>
    </div>
    <div class="quill-resize-modal-body">
      <div class="quill-resize-form-group">
        <label for="quill-resize-link-url">URL</label>
        <input type="text" id="quill-resize-link-url" placeholder="https://" />
      </div>
      <div class="quill-resize-form-group">
        <label>
          <input type="checkbox" id="quill-resize-link-newtab" checked />
          Open in new tab
        </label>
      </div>
    </div>
    <div class="quill-resize-modal-footer">
      <button class="quill-resize-btn quill-resize-btn-cancel" data-action="cancel">Cancel</button>
      <button class="quill-resize-btn quill-resize-btn-primary" data-action="save">Add Link</button>
    </div>
  </div>
</div>
`;

// Border dropdown styles
const borderDropdownStyles = `
.mat-menu {
  position: fixed;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 1000;
  min-width: 120px;
  overflow: visible; /* Changed to visible to allow submenus to show */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.menu-item-wrapper {
  padding: 8px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  position: relative;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.current-color-preview {
  margin-left: auto;
  margin-right: 8px;
}

.color-box {
  width: 20px;
  height: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #000000;
}

.submenu-arrow {
  // margin-left: auto;
  text-align: center;
  justify-content: center;
  align-items: center;

  font-size: 18px;
  color: #888;
}

.submenu {
  position: absolute;
  top: 0;
  right: -200px; /* Position to the right of main menu */
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  padding: 8px;
  min-width: auto
  z-index: 1001; /* Higher than parent menu */
}

.color-grid {
  display: flex;
  flex-direction: row;
  gap: 12px;  
  margin: 5px 10px;
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ddd;
  transition: transform 0.1s ease;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  outline: 2px solid #0052cc;
  outline-offset: 1px;
}

.size-grid {
  display: flex;
  flex-direction: row;
  gap: 12px; 
  margin: 5px 10px;
}

.size-option {
position: relative;
  display: flex;
  align-items: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #ddd;

}

.size-option:hover {
  background-color: #f5f5f5;
}

.size-preview {
  width: 20px;
  position: absolute;
  top: 10px;
  left: 1px;
  
  background-color: #000;
  margin-right: 12px;
  transform: rotate(135deg);
}

.size-option.active {
  background-color: #e6f7ff;
}
`;

const confirmModalTemplate = `
<div class="quill-resize-modal-overlay">
  <div class="quill-resize-modal">
    <div class="quill-resize-modal-header">
      <h3>Confirm</h3>
      <button class="quill-resize-modal-close" data-action="close">&times;</button>
    </div>
    <div class="quill-resize-modal-body">
      <p>Are you sure you want to delete this image?</p>
    </div>
    <div class="quill-resize-modal-footer">
      <button class="quill-resize-btn quill-resize-btn-cancel" data-action="cancel">Cancel</button>
      <button class="quill-resize-btn quill-resize-btn-danger" data-action="confirm">Delete</button>
    </div>
  </div>
</div>
`;
class ResizePlugin {
  resizeTarget: ResizeElement;
  resizer: HTMLElement | null = null;
  toolbar: HTMLElement | null = null;
  container: HTMLElement;
  editor: HTMLElement;
  startResizePosition: Position | null = null;
  i18n: I18n;
  options: any;

  // Handler for document click events to close dropdowns
  private handleDocumentClick = (e: MouseEvent) => {
    if (this.toolbar) {
      const dropdown = this.toolbar.querySelector('.border-dropdown-content');
      if (dropdown && (dropdown as HTMLElement).style.display === 'block') {
        const isClickInside = e.target === dropdown || dropdown.contains(e.target as Node);
        const isToggleButton = (e.target as HTMLElement).closest('.border-dropdown-toggle');
        if (!isClickInside && !isToggleButton) {
          (dropdown as HTMLElement).style.display = 'none';
        }
      }
    }
  };
  
  // Handler for window resize events
  private handleWindowResize = () => {
    // Reposition the toolbar
    this.positionResizerToTarget(this.resizeTarget);
    
    // Close any open dropdowns
    if (this.toolbar) {
      const dropdown = this.toolbar.querySelector('.border-dropdown-content') as HTMLElement;
      if (dropdown && dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
      }
    }
  };
  
  // Handler for document scroll events
  private handleDocumentScroll = () => {
    // Reposition the toolbar and any open dropdowns
    this.positionResizerToTarget(this.resizeTarget);
    
    // Reposition any open dropdown
    if (this.toolbar) {
      const dropdown = this.toolbar.querySelector('.border-dropdown-content') as HTMLElement;
      if (dropdown && dropdown.style.display === 'block') {
        this.repositionDropdown(dropdown);
      }
    }
  };

  constructor(
    resizeTarget: ResizeElement,
    container: HTMLElement,
    editor: HTMLElement,
    options?: ResizePluginOption
  ) {
    this.i18n = new I18n(options?.locale || defaultLocale);
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

  initResizer() {
    // First, clean up any existing resizer or toolbar
    this.cleanupExistingElements();
    
    // Create resizer
    const resizer = document.createElement("div");
    resizer.setAttribute("id", "editor-resizer");
    resizer.innerHTML = format(
      resizerTemplate,
      this.i18n.findLabel("altTip")
    );
    
    // Add border dropdown styles
    const styleElement = document.createElement('style');
    styleElement.textContent = borderDropdownStyles;
    resizer.appendChild(styleElement);
    
    this.container.appendChild(resizer);

    // Create toolbar as a separate element
    const toolbar = document.createElement("div");
    toolbar.setAttribute("id", "toolbar");
    toolbar.setAttribute("data-quill-resize-toolbar", "true");
    toolbar.innerHTML = format(
      toolbarTemplate,
      this.i18n.findLabel("altTip")
    );
    
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
  }
  
  /**
   * Clean up any existing resizer or toolbar elements
   * to prevent duplicates
   */
  private cleanupExistingElements(): void {
    // Remove existing resizer
    const existingResizer = document.getElementById('editor-resizer');
    if (existingResizer && existingResizer.parentNode) {
      existingResizer.parentNode.removeChild(existingResizer);
    }
    
    // Remove existing toolbar
    const existingToolbar = document.getElementById('toolbar');
    if (existingToolbar && existingToolbar.parentNode) {
      existingToolbar.parentNode.removeChild(existingToolbar);
    }
  }
  positionResizerToTarget(el: HTMLElement) {
    if (!el || !this.resizer) return;
    
    try {
      // Position the resizer relative to the image
      this.resizer.style.setProperty("left", el.offsetLeft + "px");
      this.resizer.style.setProperty("top", (el.offsetTop - this.editor.scrollTop) + "px");
      this.resizer.style.setProperty("width", el.clientWidth + "px");
      this.resizer.style.setProperty("height", el.clientHeight + "px");
      
      // Position the toolbar separately since it's now a child of resizer
      if (this.toolbar) {
        const image = el.getBoundingClientRect();
        const viewportwidth = window.innerWidth;
        const viewportheight = window.innerHeight;
        const toolbarwidth = this.toolbar.clientWidth;
        const toolbarheight = this.toolbar.clientHeight;

        // Position the toolbar below the image
        let left = image.left + image.width / 2 - toolbarwidth / 2;
        let top = image.bottom + 10; // 10px below the image

        // Adjust if toolbar would go off-screen
        if(left < 0) {
          left = image.left;
        }
        if(left + toolbarwidth > viewportwidth) {
          left = viewportwidth - toolbarwidth;
        }
        
        // Check if toolbar would go off bottom of screen
        if (top + toolbarheight > viewportheight) {
          // Position above the image instead if there's room
          if (image.top > toolbarheight + 10) {
            top = image.top - toolbarheight - 10;
          } else {
            // Otherwise try to find a position that fits
            top = Math.max(0, viewportheight - toolbarheight - 5);
          }
        }
        
        // Update toolbar position
        this.toolbar.style.setProperty("left", left + "px");
        this.toolbar.style.setProperty("top", top + "px");
        
        // Also reposition any open dropdown
        const dropdown = this.toolbar.querySelector('.border-dropdown-content') as HTMLElement;
        if (dropdown && dropdown.style.display === 'block') {
          this.repositionDropdown(dropdown);
        }
      }
    } catch (error) {
      console.error('Error positioning resizer:', error);
    }
  }
  bindEvents() {
    if (this.resizer !== null) {
      this.resizer.addEventListener("mousedown", this.startResize);
    }
    
    if (this.toolbar !== null) {
      // Only add the change event listener here
      this.toolbar.addEventListener("change", this.toolbarInputChange);
      
      // Add event listeners for menu items with submenus
      const menuItems = this.toolbar.querySelectorAll('.menu-item[data-submenu]');
      menuItems?.forEach(item => {
        // Handle both click and mouseenter
        const showSubmenu = (e: Event) => {
          // Prevent default behavior for click events
          if (e.type === 'click') {
            e.preventDefault();
          }
          e.stopPropagation();
          const submenuId = (e.currentTarget as HTMLElement).getAttribute('data-submenu');
          if (submenuId) {
            // Hide all submenus first
            const allSubmenus = this.toolbar?.querySelectorAll('.submenu');
            allSubmenus?.forEach(submenu => {
              (submenu as HTMLElement).style.display = 'none';
            });
            
            // Show the target submenu
            const targetSubmenu = this.toolbar?.querySelector(`#${submenuId}`) as HTMLElement;
            if (targetSubmenu) {
              targetSubmenu.style.display = 'block';
              
              // Position the submenu properly
              const menuItemRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              if (submenuId === 'size-submenu') {
                // Position size submenu below the color submenu
                targetSubmenu.style.top = '45px';
              } else {
                targetSubmenu.style.top = '0px';
              }
              
              // Check if submenu would go off-screen to the right
              const rightEdge = menuItemRect.right + targetSubmenu.offsetWidth;
              if (rightEdge > window.innerWidth) {
                // Position to the left instead
                targetSubmenu.style.right = '101%';
                targetSubmenu.style.left = 'auto';
              } else {
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
      const sizeOptions = this.toolbar?.querySelectorAll('.size-option');
      sizeOptions?.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          const width = (e.currentTarget as HTMLElement).getAttribute('data-border-width');
          if (width) {
            // Get current color or use default
            const currentColor = this.resizeTarget instanceof HTMLElement ? 
              this.resizeTarget.style.borderColor || '#000000' : '#000000';
            this.applyBorder(width, currentColor);
            
            // Update active state
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            (e.currentTarget as HTMLElement).classList.add('active');
            
            // Close the dropdown after selection
            const dropdown = this.toolbar?.querySelector('.border-dropdown-content') as HTMLElement;
            if (dropdown) dropdown.style.display = 'none';
          }
        });
      });
      
      // Add event listeners for color options
      const colorOptions = this.toolbar?.querySelectorAll('.color-option');
      colorOptions?.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          const color = (e.currentTarget as HTMLElement).getAttribute('data-border-color');
          if (color) {
            // Get current width or use default
            const currentWidth = this.resizeTarget instanceof HTMLElement ? 
              this.resizeTarget.style.borderWidth || '1px' : '1px';
            this.applyBorder(currentWidth, color);
            
            // Update active state
            colorOptions.forEach(opt => opt.classList.remove('active'));
            (e.currentTarget as HTMLElement).classList.add('active');
            
            // Update current color preview
            const currentColorPreview = this.toolbar?.querySelector('#current-color-preview') as HTMLElement;
            if (currentColorPreview) {
              currentColorPreview.style.backgroundColor = color;
            }
            
            // Close the dropdown after selection
            const dropdown = this.toolbar?.querySelector('.border-dropdown-content') as HTMLElement;
            if (dropdown) dropdown.style.display = 'none';
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
  }
  onScroll() {
    // Update the resizer position
    this.positionResizerToTarget(this.resizeTarget);
    
    // Also reposition any open dropdown
    if (this.toolbar) {
      const dropdown = this.toolbar.querySelector('.border-dropdown-content') as HTMLElement;
      if (dropdown && dropdown.style.display === 'block') {
        this.repositionDropdown(dropdown);
      }
    }
  }
  _setStylesForToolbar(type: string, styles: string | undefined) {
    const storeKey = `_styles_${type}`;
    const style: CSSStyleDeclaration = this.resizeTarget.style;
    const originStyles = this.resizeTarget[storeKey];
    
    // Save existing border styles before we modify styles
    const currentBorder = style.border;
    const currentWidth = style.width;
    const currentHeight = style.height;
    
    // Clear previous styles of the same type only
    if (originStyles) {
      style.cssText = style.cssText.replaceAll(" ", "").replace(originStyles, "");
    }
    
    // Add new styles
    if (styles) {
      style.cssText += `;${styles}`;
    }
    
    // Preserve border if it exists and we're not explicitly changing it
    if (currentBorder && type !== 'border') {
      style.border = currentBorder;
    }
    
    // Always preserve dimensions
    if (currentWidth) style.width = currentWidth;
    if (currentHeight) style.height = currentHeight;
    
    this.resizeTarget[storeKey] = styles;

    this.positionResizerToTarget(this.resizeTarget);
    this.options?.onChange(this.resizeTarget);
  }

  /**
   * Find the Quill editor root element
   */
  private findQuillEditor(): HTMLElement | null {
    // Try to find the closest Quill editor container
    let element: HTMLElement | null = this.resizeTarget;
    while (element && !element.classList.contains('ql-editor')) {
      element = element.parentElement;
    }
    return element;
  }
  
  /**
   * Apply wrap-left styling to image in a way that works with Quill
   */
  private applyWrapLeft(): void {
    console.log("Starting applyWrapLeft");
    
    // First unwrap if already wrapped
    this.unwrapImage();
    
    // Get the image element
    const imageElement = this.resizeTarget;
    
    // Clear any existing styles that might conflict
    this.clearImageStyles(imageElement);
    
    // Save current styles to preserve
    const currentBorder = imageElement.style.border;
    const currentWidth = imageElement.style.width;
    const currentHeight = imageElement.style.height;
    
    // Apply the float directly
    imageElement.style.float = 'left';
    imageElement.style.marginRight = '12px';
    imageElement.style.marginBottom = '12px';
    imageElement.style.marginTop = '12px';
    imageElement.style.marginLeft = '0';
    
    // Store wrap style
    const storeKey = `_styles_wrap`;
    this.resizeTarget[storeKey] = 'float:left;margin:12px 12px 12px 0;';
    
    // Restore preserved styles
    if (currentBorder) imageElement.style.border = currentBorder;
    if (currentWidth) imageElement.style.width = currentWidth;
    if (currentHeight) imageElement.style.height = currentHeight;
    
    // Fix the parent if needed
    if (imageElement.parentElement) {
      imageElement.parentElement.style.overflow = 'auto';
    }
    
    // Update the resizer position
    this.positionResizerToTarget(this.resizeTarget);
    
    // Notify of changes with a small delay to let Quill stabilize
    setTimeout(() => {
      this.options?.onChange(this.resizeTarget);
      console.log("Final styles after delay:", imageElement.style.cssText);
    }, 50);
  }
  
  /**
   * Apply wrap-right styling to image in a way that works with Quill
   */
  private applyWrapRight(): void {
    console.log("Starting applyWrapRight");
    
    // First unwrap if already wrapped
    this.unwrapImage();
    
    // Get the image element
    const imageElement = this.resizeTarget;
    
    // Clear any existing styles that might conflict
    this.clearImageStyles(imageElement);
    
    // Save current styles to preserve
    const currentBorder = imageElement.style.border;
    const currentWidth = imageElement.style.width;
    const currentHeight = imageElement.style.height;
    
    // Apply the float directly
    imageElement.style.float = 'right';
    imageElement.style.marginLeft = '12px';
    imageElement.style.marginBottom = '12px';
    imageElement.style.marginTop = '12px';
    imageElement.style.marginRight = '0';
    
    // Store wrap style
    const storeKey = `_styles_wrap`;
    this.resizeTarget[storeKey] = 'float:right;margin:12px 0 12px 12px;';
    
    // Restore preserved styles
    if (currentBorder) imageElement.style.border = currentBorder;
    if (currentWidth) imageElement.style.width = currentWidth;
    if (currentHeight) imageElement.style.height = currentHeight;
    
    // Fix the parent if needed
    if (imageElement.parentElement) {
      imageElement.parentElement.style.overflow = 'auto';
    }
    
    // Update the resizer position
    this.positionResizerToTarget(this.resizeTarget);
    
    // Notify of changes with a small delay to let Quill stabilize
    setTimeout(() => {
      this.options?.onChange(this.resizeTarget);
      console.log("Final styles after delay:", imageElement.style.cssText);
    }, 50);
  }
  
  /**
   * Ensure proper wrapping of an image by any means necessary
   * This is a helper method that can be used by both applyWrapLeft and applyWrapRight
   */
  private ensureProperImageWrapping(image: HTMLElement, direction: 'left' | 'right'): void {
    console.log(`Ensuring proper ${direction} wrapping`);
    
    // Clear any existing styles first
    this.clearImageStyles(image);
    
    // Save current styles to preserve
    const currentBorder = image.style.border;
    const currentWidth = image.style.width;
    const currentHeight = image.style.height;
    
    // Apply the float directly to the image
    image.style.float = direction;
    
    // Apply margins based on direction
    if (direction === 'left') {
      image.style.marginRight = '12px';
      image.style.marginLeft = '0';
    } else { // right
      image.style.marginLeft = '12px';
      image.style.marginRight = '0';
    }
    
    // Common margins
    image.style.marginTop = '12px';
    image.style.marginBottom = '12px';
    
    // Store wrap style
    const storeKey = `_styles_wrap`;
    (image as any)[storeKey] = `float:${direction};margin:${direction === 'left' ? '12px 12px 12px 0' : '12px 0 12px 12px'};`;
    
    // Fix the parent if needed
    if (image.parentElement) {
      // Don't apply overflow:auto to p tags as requested
      if (image.parentElement.tagName.toLowerCase() !== 'p') {
        image.parentElement.style.overflow = 'auto';
      }
    }
    
    // Restore preserved styles
    if (currentBorder) image.style.border = currentBorder;
    if (currentWidth) image.style.width = currentWidth;
    if (currentHeight) image.style.height = currentHeight;
  }
  
  /**
   * Fix the parent element to properly handle a floating child
   */
  private fixParentForFloating(element: HTMLElement): void {
    if (!element.parentElement) return;
    
    const parent = element.parentElement;
    const computedStyle = window.getComputedStyle(parent);
    
    // Check if parent is a flex container either explicitly or via computed style
    const isFlexContainer = parent.style.display === 'flex' || 
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
        setTimeout(() => { parent.style.zoom = ''; }, 10);
      } else {
        // For other types of containers, we need a more aggressive approach
        // Try to take image out of difficult containers and re-insert in better context
        this.reinsertImageInProperContext(element);
      }
    } else {
      // Even if it's not a flex container, make sure paragraph can contain floats
      if (parent.tagName.toLowerCase() === 'p') {
        parent.style.overflow = 'auto';
      }
    }
  }
  
  /**
   * Last resort - take the image out of problematic containers and reinsert it
   * in a more suitable context for floating
   */
  private reinsertImageInProperContext(image: HTMLElement): void {
    const parent = image.parentElement;
    if (!parent || !parent.parentElement) return;
    
    // Remember float and margin
    const floatValue = image.style.float;
    const marginValue = image.style.margin;
    
    try {
      // Create a new paragraph to contain the image
      const newContainer = document.createElement('p');
      newContainer.style.overflow = 'auto';
      
      // Insert this new container before the problematic one
      parent.parentElement.insertBefore(newContainer, parent);
      
      // Move image to the new container
      newContainer.appendChild(image);
      
      // Reapply float and margin
      image.style.float = floatValue;
      image.style.margin = marginValue;
      
      console.log("Reinserted image in a proper floating context");
    } catch (error) {
      console.error("Failed to reinsert image:", error);
    }
  }
  
  /**
   * Clear all image styles that could conflict with float/alignment
   */
  private clearImageStyles(element: HTMLElement): void {
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
  }
  
  /**
   * Unwrap an image from its container
   */
  private unwrapImage(): void {
    console.log("Unwrapping image");
    
    if (!this.resizeTarget) return;
    
    const imageElement = this.resizeTarget;
    
    // Save border and dimensions before clearing styles
    const currentBorder = imageElement.style.border;
    const currentWidth = imageElement.style.width;
    const currentHeight = imageElement.style.height;
    
    // Use the clearImageStyles method to ensure all styles are properly cleared
    this.clearImageStyles(imageElement);
    
    // Restore border and dimensions
    if (currentBorder) imageElement.style.border = currentBorder;
    if (currentWidth) imageElement.style.width = currentWidth;
    if (currentHeight) imageElement.style.height = currentHeight;
    
    // Reset any stored wrap and align styles
    delete imageElement['_styles_wrap'];
    delete imageElement['_styles_align'];
  }
  
  /**
   * No longer needed with our simplified approach
   * Kept as a stub for backward compatibility
   */
  private saveTextContentBeforeUnwrap(): string | null {
    return null;
  }
  
  /**
   * Apply border to the image with specified width and color
   * @param width Border width (e.g., '1px', '2px')
   * @param color Border color (e.g., '#000000', 'red')
   */
  private applyBorder(width: string, color: string): void {
    if (!(this.resizeTarget instanceof HTMLElement)) return;
    
    // Apply border style to the image
    this.resizeTarget.style.border = `${width} solid ${color}`;
    
    // Store border style
    const storeKey = `_styles_border`;
    this.resizeTarget[storeKey] = `${width} solid ${color}`;
    
    // Update active state in dropdown
    if (this.toolbar) {
      // Update width option active state
      const widthOptions = this.toolbar.querySelectorAll('.border-option');
      widthOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-border-width') === width) {
          option.classList.add('active');
        }
      });
      
      // Update color option active state
      const colorOptions = this.toolbar.querySelectorAll('.color-option');
      colorOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-border-color') === color) {
          option.classList.add('active');
        }
      });
    }
    
    // Notify of changes
    this.options?.onChange(this.resizeTarget);
  }
  
  /**
   * Helper method to position a dropdown properly
   */
  private repositionDropdown(dropdown: HTMLElement): void {
    if (!this.toolbar) return;
    
    const toggleButton = this.toolbar.querySelector('.border-dropdown-toggle');
    if (toggleButton) {
      const toggleRect = toggleButton.getBoundingClientRect();
      
      // Calculate optimal position - align with the toggle button
      const top = toggleRect.bottom + 5; // Add a small gap
      const left = toggleRect.left;
      
      // Apply the calculated position - fixed positioning since toolbar is now inside resizer
      dropdown.style.position = 'fixed';
      dropdown.style.top = `${top}px`;
      dropdown.style.left = `${left}px`;
      
      // Ensure dropdown doesn't go off-screen
      const dropdownRect = dropdown.getBoundingClientRect();
      if (dropdownRect.right > window.innerWidth) {
        dropdown.style.left = `${window.innerWidth - dropdownRect.width - 10}px`;
      }
      if (dropdownRect.bottom > window.innerHeight) {
        dropdown.style.top = `${toggleRect.top - dropdownRect.height - 5}px`;
      }
      
      // Also reposition any visible submenus
      const visibleSubmenus = dropdown.querySelectorAll('.submenu[style*="display: block"]');
      visibleSubmenus.forEach((submenu) => {
        const submenuEl = submenu as HTMLElement;
        const parentItem = this.toolbar?.querySelector(`.menu-item[data-submenu="${submenuEl.id}"]`);
        
        if (parentItem) {
          const parentRect = parentItem.getBoundingClientRect();
          const submenuRect = submenuEl.getBoundingClientRect();
          
          // Check if submenu would go off-screen to the right
          const rightEdge = parentRect.right + submenuRect.width;
          if (rightEdge > window.innerWidth) {
            // Position to the left instead
            submenuEl.style.right = '101%';
            submenuEl.style.left = 'auto';
          } else {
            // Position to the right
            submenuEl.style.left = '101%';
            submenuEl.style.right = 'auto';
          }
          
          // Check if submenu would go off-screen at the bottom
          const bottomEdge = parentRect.top + submenuRect.height;
          if (bottomEdge > window.innerHeight) {
            submenuEl.style.top = `${window.innerHeight - bottomEdge - 10}px`;
          }
        }
      });
    }
  }
  
  /**
   * Toggle the border dropdown visibility
   */
  private toggleBorderDropdown(): void {
    if (!this.toolbar) return;
    
    const dropdown = this.toolbar.querySelector('.border-dropdown-content') as HTMLElement;
    if (!dropdown) return;
    
    // Toggle dropdown visibility
    if (dropdown.style.display === 'none' || !dropdown.style.display) {
      // Hide any open submenus first
      const submenus = dropdown.querySelectorAll('.submenu');
      submenus.forEach(submenu => {
        (submenu as HTMLElement).style.display = 'none';
      });
      
      // Show the main menu
      dropdown.style.display = 'block';
      
      // Position the dropdown using our helper method
      this.repositionDropdown(dropdown);
      
      // Set a fixed width to match the reference design
      dropdown.style.width = '200px';
      
      // Update current color preview
      if (this.resizeTarget instanceof HTMLElement) {
        const currentColorPreview = dropdown.querySelector('#current-color-preview') as HTMLElement;
        if (currentColorPreview) {
          currentColorPreview.style.backgroundColor = this.resizeTarget.style.borderColor || '#000000';
        }
      }
      
      // Set initial active states based on current border
      const currentWidth = this.resizeTarget instanceof HTMLElement ? 
        this.resizeTarget.style.borderWidth || '1px' : '1px';
      const currentColor = this.resizeTarget instanceof HTMLElement ? 
        this.resizeTarget.style.borderColor || '#000000' : '#000000';
      
      // Update width option active state
      const widthOptions = dropdown.querySelectorAll('.size-option');
      widthOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-border-width') === currentWidth) {
          option.classList.add('active');
        }
      });
      
      // Update color option active state
      const colorOptions = dropdown.querySelectorAll('.color-option');
      colorOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-border-color') === currentColor) {
          option.classList.add('active');
        }
      });
    } else {
      dropdown.style.display = 'none';
    }
  }
  
  /**
   * Restore active states of buttons based on current image styles
   * Called when an image is selected to maintain UI state
   */
  private restoreActiveButtonStates(): void {
    if (!this.toolbar) return;
    
    const imageElement = this.resizeTarget;
    const style = imageElement.style;
    
    // First reset all active states
    this.updateActiveButtonState(null, 'align');
    this.updateActiveButtonState(null, 'wrap');
    
    // Check for wrapping styles
    if (style.float === 'left') {
      // Find and activate the wrap-left button
      const wrapLeftBtn = this.toolbar.querySelector('.btn[data-type="wrap"][data-styles*="float:left"]');
      if (wrapLeftBtn) {
        this.updateActiveButtonState(wrapLeftBtn as HTMLElement, 'wrap');
      }
    } else if (style.float === 'right') {
      // Find and activate the wrap-right button
      const wrapRightBtn = this.toolbar.querySelector('.btn[data-type="wrap"][data-styles*="float:right"]');
      if (wrapRightBtn) {
        this.updateActiveButtonState(wrapRightBtn as HTMLElement, 'wrap');
      }
    } else {
      // Check for alignment styles (only if not wrapped)
      const displayBlock = style.display === 'block';
      
      if (displayBlock && style.marginLeft === 'auto' && style.marginRight === 'auto') {
        // Center alignment
        const centerBtn = this.toolbar.querySelector('.btn[data-type="align"][data-styles*="margin:auto"]');
        if (centerBtn) {
          this.updateActiveButtonState(centerBtn as HTMLElement, 'align');
        }
      } else if (displayBlock && style.marginLeft === 'auto') {
        // Right alignment
        const rightBtn = this.toolbar.querySelector('.btn[data-type="align"][data-styles*="margin-left:auto"]');
        if (rightBtn) {
          this.updateActiveButtonState(rightBtn as HTMLElement, 'align');
        }
      } else if (displayBlock && style.marginRight === 'auto') {
        // Left alignment
        const leftBtn = this.toolbar.querySelector('.btn[data-type="align"][data-styles*="margin-right:auto"]');
        if (leftBtn) {
          this.updateActiveButtonState(leftBtn as HTMLElement, 'align');
        }
      }
    }
  }
  
  toolbarInputChange(e: Event) {
    const target: HTMLInputElement = e.target as HTMLInputElement;
    const type = target?.dataset?.type;
    const value = target.value;
    if (type && Number(value)) {
      this._setStylesForToolbar(type, `width: ${Number(value)}%;`);
    }
  }
  /**
   * Update active state of buttons in a button group
   * @param activeBtn The active button or null to clear all active states
   * @param type The button type group
   */
  private updateActiveButtonState(activeBtn: HTMLElement | null, type: string) {
    // Find all buttons of the same type
    if (this.toolbar) {
      const allButtons = this.toolbar.querySelectorAll(`.btn[data-type='${type}']`);
      allButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to the clicked button (if provided)
      if (activeBtn) {
        activeBtn.classList.add('active');
      }
    }
  }

  toolbarClick(e: MouseEvent) {
    console.log("toolbarClick");
    e.stopPropagation(); // Prevent event from bubbling up to document
    e.preventDefault(); // Also prevent default behavior
    
    const target: HTMLElement = e.target as HTMLElement;
    // Find the closest button if clicked on an SVG or path
    const btn = target.closest('.btn');
    if (!btn) {
      console.log("No button found");
      return;
    }
    
    const type = btn.getAttribute('data-type');
    console.log("Button type:", type);
    if (!type) return;
    
    if (type === 'align' || type === 'wrap') {
      console.log("Handling align/wrap");
      // Update the active state of buttons in the same group
      this.updateActiveButtonState(btn as HTMLElement, type);
      
      // Get the requested styles
      const styles = btn.getAttribute('data-styles') || '';
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
        const styles = btn.getAttribute('data-styles') || '';
        console.log("Requested wrap styles:", styles);
        
        // We need to implement wrapping in a way that allows text to be entered
        if (styles.includes('float:left')) {
          console.log("Detected left wrap request");
          this.applyWrapLeft();
        } else if (styles.includes('float:right')) {
          console.log("Detected right wrap request");
          this.applyWrapRight();
        }
        
        // Update button state
        this.updateActiveButtonState(btn as HTMLElement, type);
        
        // Remove any alignment styles and reset align buttons
        this.updateActiveButtonState(null, 'align');
      }
    } else if (type === 'copy') {
      this.copyImage();
    } else if (type === 'link') {
      this.addLink();
    } else if (type === 'delete') {
      this.deleteImage();
    } else if (type === 'border') {
      console.log("Applying border");
      // Apply default border (1px solid black)
      this.applyBorder('1px', '#000000');
    } else if (type === 'border-dropdown') {
      // Toggle the border dropdown
      this.toggleBorderDropdown();
    }
  }
  startResize(e: MouseEvent) {
    const target: HTMLElement = e.target as HTMLElement;
    if (target.classList.contains("handler") && e.which === 1) {
      this.startResizePosition = {
        left: e.clientX,
        top: e.clientY,
        width: this.resizeTarget.clientWidth,
        height: this.resizeTarget.clientHeight,
      };
    }
  }
  endResize() {
    this.startResizePosition = null;
    this.options?.onChange(this.resizeTarget);
  }
  resizing(e: MouseEvent) {
    if (!this.startResizePosition) return;
    const deltaX: number = e.clientX - this.startResizePosition.left;
    const deltaY: number = e.clientY - this.startResizePosition.top;
    let width = this.startResizePosition.width;
    let height = this.startResizePosition.height;
    width += deltaX;
    height += deltaY;

    if (e.altKey) {
      const originSize = this.resizeTarget.originSize as Size;
      const rate: number = originSize.height / originSize.width;
      height = rate * width;
    }

    this.resizeTarget.style.setProperty("width", Math.max(width, 30) + "px");
    this.resizeTarget.style.setProperty("height", Math.max(height, 30) + "px");
    this.positionResizerToTarget(this.resizeTarget);
  }

  /**
   * Copy the image to clipboard
   */
  copyImage() {
    // Get image as HTMLImageElement
    if (this.resizeTarget instanceof HTMLImageElement) {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas dimensions to match the image
      canvas.width = this.resizeTarget.naturalWidth;
      canvas.height = this.resizeTarget.naturalHeight;
      
      // Draw the image onto the canvas
      ctx.drawImage(this.resizeTarget, 0, 0);
      
      // Convert canvas to blob and copy to clipboard
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        try {
          // Modern browsers support clipboard API
          if (navigator.clipboard && navigator.clipboard.write) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]);
          }
        } catch (err) {
          console.error('Failed to copy image: ', err);
        }
      }, 'image/png');
    }
  }
  
  /**
   * Create a modal element
   * @param template Modal template
   * @returns Modal element
   */
  private createModal(template: string): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = template.trim();
    return div.firstChild as HTMLElement;
  }

  /**
   * Open a dialog to add a link to the image
   */
  addLink() {
    if (!(this.resizeTarget instanceof HTMLImageElement)) return;
    
    // Check if image is already wrapped in an anchor tag
    const parentAnchor = this.resizeTarget.closest('a');
    const currentUrl = parentAnchor ? parentAnchor.getAttribute('href') : '';
    const currentTarget = parentAnchor ? parentAnchor.getAttribute('target') : '_blank';
    
    // Create modal
    const modal = this.createModal(linkModalTemplate);
    document.body.appendChild(modal);
    
    // Set current URL if exists
    const urlInput = modal.querySelector('#quill-resize-link-url') as HTMLInputElement;
    if (urlInput) {
      urlInput.value = currentUrl || 'https://';
      setTimeout(() => urlInput.focus(), 100);
    }
    
    // Set current target
    const newTabCheckbox = modal.querySelector('#quill-resize-link-newtab') as HTMLInputElement;
    if (newTabCheckbox) {
      newTabCheckbox.checked = currentTarget === '_blank';
    }
    
    // Handle events
    const handleModalAction = (e: Event) => {
      const target = e.target as HTMLElement;
      const action = target.getAttribute('data-action');
      
      if (action === 'save') {
        const url = urlInput ? urlInput.value.trim() : '';
        const openInNewTab = newTabCheckbox ? newTabCheckbox.checked : true;
        
        if (url) {
          if (parentAnchor) {
            // Update existing link
            parentAnchor.setAttribute('href', url);
            parentAnchor.setAttribute('target', openInNewTab ? '_blank' : '_self');
          } else {
            // Create new link
            const anchor = document.createElement('a');
            anchor.setAttribute('href', url);
            anchor.setAttribute('target', openInNewTab ? '_blank' : '_self');
            
            // Replace the image with the linked image
            const parent = this.resizeTarget.parentNode;
            if (parent) {
              parent.insertBefore(anchor, this.resizeTarget);
              anchor.appendChild(this.resizeTarget);
              
              // We need to recreate the resizer for the linked image
              this.destroy();
              
              // Emit onChange event with a slight delay to let Quill stabilize
              setTimeout(() => {
                this.options?.onChange(this.resizeTarget);
              }, 0);
            }
          }
        }
        
        // Close modal
        document.body.removeChild(modal);
        document.removeEventListener('click', handleClickOutside);
      } else if (action === 'close' || action === 'cancel') {
        // Close modal
        document.body.removeChild(modal);
        document.removeEventListener('click', handleClickOutside);
      }
    };
    
    // Close when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        document.removeEventListener('click', handleClickOutside);
      }
    };
    
    // Attach event listeners
    modal.addEventListener('click', handleClickOutside);
    modal.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', handleModalAction);
    });
  }
  
  /**
   * Delete the image using a custom confirmation modal
   */
  deleteImage() {
    // Create modal
    const modal = this.createModal(confirmModalTemplate);
    document.body.appendChild(modal);
    
    // Handle events
    const handleModalAction = (e: Event) => {
      const target = e.target as HTMLElement;
      const action = target.getAttribute('data-action');
      
      if (action === 'confirm') {
        // Remove the image from the DOM
        const parent = this.resizeTarget.parentNode;
        if (parent) {
          parent.removeChild(this.resizeTarget);
          this.destroy();
          
          // Emit onChange event
          this.options?.onChange(null);
        }
        
        // Close modal
        document.body.removeChild(modal);
        document.removeEventListener('click', handleClickOutside);
      } else if (action === 'close' || action === 'cancel') {
        // Close modal
        document.body.removeChild(modal);
        document.removeEventListener('click', handleClickOutside);
      }
    };
    
    // Close when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        document.removeEventListener('click', handleClickOutside);
      }
    };
    
    // Attach event listeners
    modal.addEventListener('click', handleModalAction);
    modal.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', handleModalAction);
    });
  }
  
  /**
   * Clean up resources and remove event listeners
   */
  destroy() {
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
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
  
  /**
   * Legacy method with typo - kept for backward compatibility
   * @deprecated Use destroy() instead
   */
  destory() {
    return this.destroy();
  }

  /**
   * Apply alignment based on button data
   */
  private applyAlignment(styles: string): void {
    // First unwrap image completely
    this.unwrapImage();
    
    // Get the image element
    const imageElement = this.resizeTarget;
    
    // Clear any existing styles that might conflict
    this.clearImageStyles(imageElement);
    
    // Store current styles to preserve
    const currentBorder = imageElement.style.border;
    const currentWidth = imageElement.style.width;
    const currentHeight = imageElement.style.height;
    
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
    } else if (styles.includes('float:left')) {
      // Left alignment
      console.log("Applying left alignment");
      imageElement.style.display = 'block';
      imageElement.style.float = 'none'; // Don't use float for alignment
      imageElement.style.marginLeft = '0';
      imageElement.style.marginRight = 'auto';
      imageElement.style.marginTop = '12px';
      imageElement.style.marginBottom = '12px';
    } else if (styles.includes('float:right')) {
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
    if (currentBorder) imageElement.style.border = currentBorder;
    if (currentWidth) imageElement.style.width = currentWidth;
    if (currentHeight) imageElement.style.height = currentHeight;
    
    // Store styles for future reference
    const storeKey = `_styles_align`;
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
    this.options?.onChange(this.resizeTarget);
    
    console.log("After alignment:", imageElement.style.cssText);
  }
}

export default ResizePlugin;
