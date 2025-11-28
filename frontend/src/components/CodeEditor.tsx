/**
 * Code editor component with real-time collaboration
 */
import { useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setCode, setCursorPosition } from '../store/editorSlice';
import { autocompleteApi } from '../services/api';

interface CodeEditorProps {
  roomId: string;
  onCodeChange?: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ roomId, onCodeChange }) => {
  const dispatch = useAppDispatch();
  const { code, language, isConnected, activeUsers } = useAppSelector((state) => state.editor);
  const editorRef = useRef<any>(null);
  const isRemoteUpdateRef = useRef(false);
  const providerRef = useRef<any>(null);

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Listen to cursor position changes
    editor.onDidChangeCursorPosition((e: any) => {
      const position = editor.getModel()?.getOffsetAt(e.position) || 0;
      dispatch(setCursorPosition(position));
    });

    // Dispose previous provider if exists
    if (providerRef.current) {
      providerRef.current.dispose();
    }

    // Register custom autocomplete provider
    providerRef.current = monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: async (model: any, position: any) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        try {
          const response = await autocompleteApi.getSuggestion({
            code: textUntilPosition,
            cursor_position: textUntilPosition.length,
            language,
          });

          if (response.suggestion && response.suggestion.trim()) {
            return {
              suggestions: [
                {
                  label: response.suggestion.split('\n')[0].trim(),
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: response.suggestion,
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  documentation: 'AI-powered suggestion',
                  detail: '✨ Smart completion',
                  sortText: '0', // Sort at the top
                },
              ],
            };
          }
        } catch (error) {
          console.error('Error getting autocomplete:', error);
        }

        return { suggestions: [] };
      },
      triggerCharacters: [' ', '.', '(', ':', '#', '<'],
    });
  };

  // Handle code changes
  const handleCodeChange = useCallback((value: string | undefined) => {
    if (!value) return;

    // If this is a remote update, don't trigger WebSocket send
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    // Update local state
    dispatch(setCode(value));

    // Send to other clients via callback
    if (onCodeChange) {
      onCodeChange(value);
    }
  }, [dispatch, onCodeChange]);

  // Update editor when code changes from WebSocket
  useEffect(() => {
    if (editorRef.current) {
      const currentCode = editorRef.current.getValue();
      if (currentCode !== code) {
        isRemoteUpdateRef.current = true;
        editorRef.current.setValue(code);
      }
    }
  }, [code]);

  // Cleanup provider on unmount
  useEffect(() => {
    return () => {
      if (providerRef.current) {
        providerRef.current.dispose();
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Status bar */}
      <div style={{
        padding: '8px 16px',
        backgroundColor: isConnected ? '#28a745' : '#dc3545',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <span style={{ marginRight: '16px' }}>
            Room: {roomId}
          </span>
          <span>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
        <div>
          Active Users: {activeUsers}
        </div>
      </div>

      {/* Monaco Editor */}
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
            // Autocomplete settings
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: true,
          }}
        />
      </div>
    </div>
  );
};
