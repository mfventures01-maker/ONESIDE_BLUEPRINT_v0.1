import os
import re
import json

def analyze_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        imports = re.findall(r'import\s+.*?\s+from\s+[\'"](.*?)[\'"]', content)
        exports = re.findall(r'export\s+(?:const|function|interface|type|class)\s+(\w+)', content)
        default_exports = re.findall(r'export\s+default\s+(\w+)', content)
        hooks = re.findall(r'use[A-Z]\w+', content)
        jsx_elements = list(set(re.findall(r'<([A-Z]\w+)', content)))
        supabase_calls = list(set(re.findall(r'supabase\.\w+', content)))
        
        return {
            'file': filepath,
            'imports': list(set(imports)),
            'exports': exports + default_exports,
            'hooks': list(set(hooks)),
            'jsx': jsx_elements,
            'supabase_calls': supabase_calls,
            'lines': len(content.splitlines())
        }
    except Exception as e:
        return {'file': filepath, 'error': str(e)}

results = []
for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            results.append(analyze_file(os.path.join(root, file)))

with open('analysis.json', 'w') as f:
    json.dump(results, f, indent=2)
