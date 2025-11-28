"""Service for mocked AI autocomplete suggestions."""
from app.schemas.room import AutocompleteRequest, AutocompleteResponse
import re


class AutocompleteService:
    """Service for providing mocked autocomplete suggestions."""

    @staticmethod
    def get_suggestion(request: AutocompleteRequest) -> AutocompleteResponse:
        """
        Generate a mocked autocomplete suggestion based on the code and cursor position.
        This is a simple rule-based system for demonstration purposes.
        """
        code = request.code
        cursor_pos = request.cursor_position
        language = request.language

        # Get the current line up to cursor
        lines = code[:cursor_pos].split('\n')
        current_line = lines[-1] if lines else ""

        # Simple pattern matching for common code patterns
        suggestion = ""

        # Python-specific suggestions
        if language == "python":
            if current_line.strip().startswith("def "):
                suggestion = ":\n    pass"
            elif current_line.strip().startswith("class "):
                suggestion = ":\n    def __init__(self):\n        pass"
            elif current_line.strip().startswith("if "):
                suggestion = ":\n    pass"
            elif current_line.strip().startswith("for "):
                suggestion = ":\n    pass"
            elif current_line.strip().startswith("while "):
                suggestion = ":\n    pass"
            elif current_line.strip().startswith("try"):
                suggestion = ":\n    pass\nexcept Exception as e:\n    pass"
            elif "print" in current_line and not current_line.strip().endswith(")"):
                suggestion = ")"
            elif current_line.strip() == "import":
                suggestion = " numpy as np"
            elif current_line.strip().startswith("from "):
                suggestion = " import "
            elif current_line.strip().startswith("with "):
                suggestion = ":\n    pass"

        # JavaScript/TypeScript suggestions
        elif language in ["javascript", "typescript"]:
            if current_line.strip().startswith("function "):
                suggestion = " {\n  // TODO: Implement\n}"
            elif current_line.strip().startswith("const "):
                suggestion = " = "
            elif current_line.strip().startswith("let "):
                suggestion = " = "
            elif current_line.strip().startswith("if "):
                suggestion = " {\n  \n}"
            elif current_line.strip().startswith("for "):
                suggestion = " {\n  \n}"
            elif current_line.strip().startswith("while "):
                suggestion = " {\n  \n}"
            elif current_line.strip().startswith("class "):
                suggestion = " {\n  constructor() {\n  }\n}"
            elif current_line.strip().startswith("async "):
                suggestion = " () => {\n  \n}"
            elif current_line.strip().startswith("try"):
                suggestion = " {\n  \n} catch (error) {\n  \n}"
            elif "console.log" in current_line and not current_line.strip().endswith(")"):
                suggestion = ")"
            elif current_line.strip().startswith("import "):
                suggestion = " from ''"
            elif current_line.strip().startswith("export "):
                suggestion = " default "

        # Java suggestions
        elif language == "java":
            if current_line.strip().startswith("public class "):
                suggestion = " {\n  public static void main(String[] args) {\n    \n  }\n}"
            elif current_line.strip().startswith("private ") or current_line.strip().startswith("public "):
                if "(" in current_line:
                    suggestion = " {\n    \n  }"
                else:
                    suggestion = ";"
            elif current_line.strip().startswith("if "):
                suggestion = " {\n    \n  }"
            elif current_line.strip().startswith("for "):
                suggestion = " {\n    \n  }"
            elif current_line.strip().startswith("while "):
                suggestion = " {\n    \n  }"
            elif current_line.strip().startswith("try"):
                suggestion = " {\n    \n  } catch (Exception e) {\n    \n  }"
            elif "System.out.println" in current_line and not current_line.strip().endswith(")"):
                suggestion = ")"
            elif current_line.strip().startswith("import "):
                suggestion = ";"

        # C++ suggestions
        elif language in ["cpp", "c++"]:
            if current_line.strip().startswith("#include"):
                if "<" in current_line:
                    suggestion = "iostream>"
                else:
                    suggestion = " <iostream>"
            elif current_line.strip().startswith("int main"):
                suggestion = " {\n  return 0;\n}"
            elif current_line.strip().startswith("class "):
                suggestion = " {\npublic:\n  \nprivate:\n  \n};"
            elif current_line.strip().startswith("struct "):
                suggestion = " {\n  \n};"
            elif "void " in current_line or "int " in current_line or "double " in current_line:
                if "(" in current_line and ")" in current_line:
                    suggestion = " {\n  \n}"
            elif current_line.strip().startswith("if "):
                suggestion = " {\n  \n}"
            elif current_line.strip().startswith("for "):
                suggestion = " {\n  \n}"
            elif current_line.strip().startswith("while "):
                suggestion = " {\n  \n}"
            elif "std::cout" in current_line:
                suggestion = " << std::endl;"
            elif "std::cin" in current_line:
                suggestion = " >> "
            elif current_line.strip().startswith("using "):
                suggestion = "namespace std;"


        # Go suggestions
        elif language == "go":
            if current_line.strip().startswith("package "):
                suggestion = "main"
            elif current_line.strip().startswith("import "):
                suggestion = '("fmt")'
            elif current_line.strip().startswith("func main"):
                suggestion = "() {\n  \n}"
            elif current_line.strip().startswith("func "):
                suggestion = "() {\n  \n}"
            elif current_line.strip().startswith("type "):
                if "struct" in current_line:
                    suggestion = " {\n  \n}"
                else:
                    suggestion = " struct {\n  \n}"
            elif current_line.strip().startswith("if "):
                suggestion = " {\n  \n}"
            elif current_line.strip().startswith("for "):
                suggestion = " {\n  \n}"
            elif "fmt.Println" in current_line and not current_line.strip().endswith(")"):
                suggestion = ")"
            elif current_line.strip().startswith("var "):
                suggestion = " := "
            elif current_line.strip() == ":":
                suggestion = "= "


        # Generic fallback
        else:
            suggestion = "  // Continue coding..."

        return AutocompleteResponse(
            suggestion=suggestion,
            start_position=cursor_pos,
            end_position=cursor_pos + len(suggestion)
        )
