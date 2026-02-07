* {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #1e1e1e;
            color: #cccccc;
            height: 100vh;
            overflow: hidden;
        }

        .app-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        /* Top Bar */
        .top-bar {
            background: #323233;
            height: 35px;
            display: flex;
            align-items: center;
            padding: 0 15px;
            border-bottom: 1px solid #1e1e1e;
            flex-shrink: 0;
        }

        .app-title {
            font-size: 13px;
            color: #cccccc;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .php-icon {
            width: 18px;
            height: 18px;
            background: linear-gradient(135deg, #8993be 0%, #6f7eb8 100%);
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: white;
        }

        /* Main Content */
        .main-content {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        /* Sidebar */
        .sidebar {
            width: 50px;
            background: #333333;
            border-right: 1px solid #1e1e1e;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 10px;
            gap: 5px;
        }

        .sidebar-icon {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            color: #858585;
            font-size: 24px;
            transition: all 0.2s;
        }

        .sidebar-icon:hover {
            color: #ffffff;
            background: #2a2a2a;
        }

        .sidebar-icon.active {
            color: #ffffff;
            border-left: 2px solid #007acc;
        }

        /* Editor Section */
        .editor-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .tabs-bar {
            background: #252526;
            height: 35px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #1e1e1e;
        }

        .tab {
            height: 35px;
            padding: 0 15px;
            display: flex;
            align-items: center;
            gap: 8px;
            background: #2d2d2d;
            border-right: 1px solid #1e1e1e;
            cursor: pointer;
            font-size: 13px;
            color: #969696;
            transition: all 0.2s;
        }

        .tab.active {
            background: #1e1e1e;
            color: #ffffff;
        }

        .tab:hover {
            color: #ffffff;
        }

        .tab-icon {
            font-size: 16px;
        }

        .editor-wrapper {
            flex: 1;
            overflow: hidden;
            position: relative;
        }

        .CodeMirror {
            height: 100% !important;
            font-size: 14px;
            line-height: 1.6;
            font-family: 'Consolas', 'Courier New', monospace;
        }

        .CodeMirror-gutters {
            background: #1e1e1e;
            border-right: 1px solid #333333;
        }

        .CodeMirror-linenumber {
            color: #858585;
            padding: 0 10px;
        }

        /* Console Section */
        .console-section {
            height: 300px;
            background: #1e1e1e;
            border-top: 1px solid #333333;
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
        }

        .console-header {
            height: 35px;
            background: #252526;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            border-bottom: 1px solid #1e1e1e;
        }

        .console-title {
            font-size: 13px;
            color: #cccccc;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .console-actions {
            display: flex;
            gap: 10px;
        }

        .console-btn {
            background: none;
            border: none;
            color: #cccccc;
            cursor: pointer;
            font-size: 16px;
            padding: 5px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .console-btn:hover {
            color: #ffffff;
            background: #2a2a2a;
            border-radius: 3px;
        }

        .console-output {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            background: #1e1e1e;
        }

        .console-entry {
            margin-bottom: 20px;
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .console-timestamp {
            color: #858585;
            font-size: 12px;
            margin-bottom: 8px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .console-timestamp::before {
            content: '▶';
            color: #4ec9b0;
        }

        .console-content {
            color: #d4d4d4;
            white-space: pre-wrap;
            word-wrap: break-word;
            padding-left: 16px;
            border-left: 2px solid #4ec9b0;
            margin-left: 5px;
        }

        .console-error {
            border-left-color: #f48771;
        }

        .console-error .console-timestamp::before {
            color: #f48771;
        }

        .console-error .console-content {
            color: #f48771;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        ::-webkit-scrollbar-track {
            background: #1e1e1e;
        }

        ::-webkit-scrollbar-thumb {
            background: #424242;
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #4e4e4e;
        }

        /* Action Bar */
        .action-bar {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 10px;
            z-index: 1000;
        }

        .action-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .run-button {
            background: #0e639c;
            color: #ffffff;
        }

        .run-button:hover {
            background: #1177bb;
        }

        .run-button:active {
            transform: scale(0.95);
        }

        .clear-button {
            background: #3c3c3c;
            color: #cccccc;
        }

        .clear-button:hover {
            background: #505050;
        }

        /* Examples Panel */
        .examples-panel {
            position: absolute;
            bottom: 20px;
            left: 70px;
            background: #252526;
            border: 1px solid #333333;
            border-radius: 6px;
            padding: 15px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            z-index: 999;
            max-width: 300px;
        }

        .examples-title {
            font-size: 13px;
            color: #cccccc;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .example-list {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .example-item {
            padding: 8px 12px;
            background: #2d2d2d;
            border: 1px solid #3c3c3c;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            color: #cccccc;
            transition: all 0.2s;
        }

        .example-item:hover {
            background: #3c3c3c;
            border-color: #007acc;
            color: #ffffff;
        }

        .hide {
            display: none;
        }

        /* Resize Handle */
        .resize-handle {
            height: 4px;
            background: #1e1e1e;
            cursor: ns-resize;
            transition: background 0.2s;
        }

        .resize-handle:hover {
            background: #007acc;
        }

        /* Status Bar */
        .status-bar {
            height: 22px;
            background: #007acc;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            font-size: 12px;
            color: #ffffff;
        }

        .status-left, .status-right {
            display: flex;
            gap: 15px;
        }

        .status-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
