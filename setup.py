import os
folders = [
    "datasets", "models", "src", "frontend", "backend", "docs"
]

for folder in folders:
    os.makedirs(folder, exist_ok=True)
