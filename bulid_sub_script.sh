#!/bin/bash

# 対象ディレクトリ
TARGET_DIR="dist/views"

# HTMLファイルを処理
find "$TARGET_DIR" -type f -name "*.html" | while IFS= read -r file; do
    # 置換処理を行い、元のファイルに上書き保存
    sed -i '' 's/&lt;/</g; s/&gt;/>/g' "$file"
    echo "Processed: $file"
done

echo "All files processed."
