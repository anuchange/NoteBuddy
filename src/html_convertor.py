import markdown
from markdown.extensions.codehilite import CodeHiliteExtension
from markdown.extensions.fenced_code import FencedCodeExtension
from markdown.extensions.tables import TableExtension
from markdown.extensions.toc import TocExtension
from markdown.extensions.attr_list import AttrListExtension

def convert_markdown_to_html(markdown_text, code_style='monokai'):
    # Configure markdown extensions
    extensions = [
        CodeHiliteExtension(css_class='highlight', use_pygments=True),
        FencedCodeExtension(),
        TableExtension(),
        TocExtension(permalink=True),
        AttrListExtension(),
        'markdown.extensions.extra',
        'markdown.extensions.nl2br',
        'markdown.extensions.sane_lists',
    ]
    
    # Create markdown converter with extensions
    md = markdown.Markdown(extensions=extensions)
    
    # Convert markdown to HTML
    html_content = md.convert(markdown_text)
    
    # Get Pygments CSS for code highlighting
    from pygments.formatters import HtmlFormatter
    pygments_css = HtmlFormatter(style=code_style).get_style_defs('.highlight')
    
    html_template = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <!-- Mermaid Support -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/9.3.0/mermaid.min.js"></script>
        
        <!-- MathJax Support -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-mml-chtml.js"></script>
        
        <!-- Highlight.js for additional code highlighting -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/{code_style}.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
        
        <style>
            body {{
                max-width: 900px;
                margin: 0 auto;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                line-height: 1.6;
            }}
            
            /* Code blocks styling */
            .highlight {{ 
                background-color: #272822;
                padding: 1em;
                border-radius: 4px;
                margin: 1em 0;
                overflow-x: auto;
            }}
            
            /* Table styling */
            table {{
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
            }}
            th, td {{
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }}
            th {{
                background-color: #f5f5f5;
            }}
            
            /* Mermaid diagram styling */
            .mermaid {{
                text-align: center;
                margin: 1em 0;
            }}
            
            /* Math equations styling */
            .math {{
                overflow-x: auto;
                margin: 1em 0;
            }}
            
            {pygments_css}
        </style>
    </head>
    <body>
        {html_content}
        
        <script>
            // Initialize Mermaid
            mermaid.initialize({{ startOnLoad: true }});
            
            // Initialize MathJax
            MathJax.Hub.Config({{
                tex2jax: {{
                    inlineMath: [['$','$'], ['\\(','\\)']],
                    displayMath: [['$$','$$'], ['\\[','\\]']],
                    processEscapes: true
                }}
            }});
            
            // Initialize highlight.js
            hljs.highlightAll();
        </script>
    </body>
    </html>
    """
    
    return html_template